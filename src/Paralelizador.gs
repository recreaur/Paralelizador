const PROPERTIES_PREFIX = "PARALLEL_";
const MAX_RUNNING_TIME = 250000;
const REASONABLE_TIME_TO_WAIT = 100;

const ENUMPROPERTIES = {
  ITERATIONS_LEFT : PROPERTIES_PREFIX + 'iterationsLeft',
  ITERATIONS_EXECUTING : PROPERTIES_PREFIX + 'iterationsExecuting',
  ITERATIONS : PROPERTIES_PREFIX + 'iterations',
  RESULTS : PROPERTIES_PREFIX + 'results',
  FUNC : PROPERTIES_PREFIX + 'func',
  TRIGGERS_IDS : PROPERTIES_PREFIX + 'triggersIds',
};

/**
 * Este callback es la función que ejecutará el trabajo
 *
 * @callback workerCb
 * @param {number} iteration - El índice de la iteración que ha de hacer
 * @return {*} Puede devolver algo o no, pero el programa lo desecha
 */
/**
 * Función handler llamada cada X minutos 
 *
 * @param {integer} triggerUid - Uid of the trigger
 * @param {workerCb} func - Función worker pasada como callback
 * @param {boolean} newExecution - Variable usada para saber si es una nueva ejecución
 * @param {integer} iterations - Número de iteraciones
 * @return {string[]} - Los resultados de cada una de las iteraciones
 */
function manager(triggerUid, func, newExecution, iterations, numThreads){
  const properties = PropertiesService.getUserProperties();
  const lock = LockService.getUserLock();  
   
  //Primera llamada - Establecemos los parámetros predeterminados
  if(newExecution){

    Logger.log("******** Empieza la ejecucición a través de la librería Paralelizador ********");
    properties.setProperty(ENUMPROPERTIES.ITERATIONS_LEFT, JSON.stringify([...Array(iterations).keys()]));  
    properties.setProperty(ENUMPROPERTIES.ITERATIONS_EXECUTING, JSON.stringify([]));  
    properties.setProperty(ENUMPROPERTIES.ITERATIONS, JSON.stringify([...Array(iterations).keys()]));
    properties.setProperty(ENUMPROPERTIES.RESULTS, JSON.stringify([])); 
    properties.setProperty(ENUMPROPERTIES.FUNC, func);
    properties.setProperty(ENUMPROPERTIES.TRIGGERS_IDS, JSON.stringify([])); 
  }
  
  Logger.log("**** Empieza en Manager ****");

  //Creamos los hilos
  const currTime = (new Date()).getTime();
  const currentNumTriggers = getNumTriggers_('Paralelizador.runParallelThread');

  //Si no hay iteraciones restantes, termina el programa
  try{
    lock.waitLock(15000); 
    const iterationsLeft = JSON.parse(properties.getProperty(ENUMPROPERTIES.ITERATIONS_LEFT));
    const iterationsExecuting = JSON.parse(properties.getProperty(ENUMPROPERTIES.ITERATIONS_EXECUTING));
    var triggersIds = JSON.parse(properties.getProperty(ENUMPROPERTIES.TRIGGERS_IDS));

    if(iterationsLeft === undefined || isNaN(iterationsLeft.length)){
      Logger.log("Fallo, no están bien establecidos los parámetros");
      Logger.log("Se debería borrar el trigger: " + triggerUid);
      removeTrigger_(triggerUid);  // Borramos el trigger que llama al manager
      Logger.log("Eliminamos los triggers");
      removeAllTriggers('Paralelizador.runParallelThread');   // Borramos los triggers workers si hubiera
      Logger.log("Eliminamos las properties");
      removeProperties(); // Borramos propiedades
      return;
    }

    if(iterationsLeft == 0 && iterationsExecuting == 0){
      Logger.log("Ejecución terminada")
      removeTrigger_(triggerUid);  // Borramos el trigger que llama al manager
      removeAllTriggers('Paralelizador.runParallelThread');   // Borramos los triggers workers si hubiera
      removeProperties(); // Borramos propiedades
      return;
    }
  }catch(e){
    Logger.log('No se pudo bloquear el almacén de llaves: ' + e);
  }

  try{
    for(i=currentNumTriggers; i<numThreads; i++){
      var trigger = ScriptApp.newTrigger('Paralelizador.runParallelThread')//"Paralelizacion.runParallelThread")
            .timeBased()
            .at(new Date(currTime))
            .create();
      Logger.log(i + " - " + numThreads + " - " + getNumTriggers_('Paralelizador.runParallelThread'));
    }
  }catch(e){
    Logger.log("Error al crear los triggers");
    triggersIds.forEach(id => removeTrigger_(id));
  }
}


/**
 * Función handler llamada por los triggers que ejecutan Threads
 *
 * @param {Object} e - event object
 */
function runParallelThread(e) {
  Logger.log(e);
  const lock = LockService.getUserLock();    
  const properties = PropertiesService.getUserProperties();
  
  var funcionTexto = properties.getProperty(ENUMPROPERTIES.FUNC);
  var funcionTexto = funcionTexto.substring(funcionTexto.indexOf("\n") + 1);
  var funcionTexto = funcionTexto.substring(funcionTexto.lastIndexOf("\n") + 1, -1);
  const funcToExecute = Function("i", "triggerUid", funcionTexto);

  var startTime = (new Date()).getTime();
  var currTime = (new Date()).getTime();
  
  while(currTime - startTime < MAX_RUNNING_TIME) {
    try{
      lock.waitLock(15000); 
      var iterationsLeft = JSON.parse(properties.getProperty(ENUMPROPERTIES.ITERATIONS_LEFT));
      var iterationsExecuting = JSON.parse(properties.getProperty(ENUMPROPERTIES.ITERATIONS_EXECUTING));
      const currentIteration = iterationsLeft.shift();
      iterationsExecuting.push(currentIteration);
      // Si esta condición se cumple, significa que no hay tareas pendientes
      if(currentIteration == undefined) break;
      
      // Actualizamos valores en el almacén
      properties.setProperty(ENUMPROPERTIES.ITERATIONS_LEFT, JSON.stringify(iterationsLeft));  
      properties.setProperty(ENUMPROPERTIES.ITERATIONS_EXECUTING, JSON.stringify(iterationsExecuting));  

      Logger.log(20);
      lock.releaseLock();

      Logger.log(25);
      Logger.log("Current Iteration: " + currentIteration);
      // EJECUTAMOS LA FUNCIÓN
      result = funcToExecute(currentIteration, e.triggerUid);
       Logger.log(30);
      lock.waitLock(15000); 
      // Guardamos el resultado
      var results = JSON.parse(properties.getProperty(ENUMPROPERTIES.RESULTS));
      results[currentIteration] = result;
      properties.setProperty(ENUMPROPERTIES.RESULTS, JSON.stringify(results)); 

      Logger.log(35);
      // Quitamos esta iteración de las iteraciones que se están ejecutando
      iterationsExecuting = JSON.parse(properties.getProperty(ENUMPROPERTIES.ITERATIONS_EXECUTING));
      var index = iterationsExecuting.indexOf(currentIteration);
      if (index !== -1)
        iterationsExecuting.splice(index, 1);
  
      Logger.log(40);
      properties.setProperty(ENUMPROPERTIES.ITERATIONS_EXECUTING, JSON.stringify(iterationsExecuting));  
      lock.releaseLock();
      
    }catch (e){
      Logger.log("Error: " + e.message);
      break;
    }
    currTime = (new Date()).getTime();
  }

  removeTrigger_(e.triggerUid);
 
  return;
}
