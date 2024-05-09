/************* COMPLETAR POR EL USUARIO *************/

//Número de tareas que se van a lanzar:
const NUM_TAREAS = 100; 
//Número de hilos (triggers - máximo 19) que ejecutarán simultáneamente las tareas:
const NUM_HILOS = 10;   

//Función que será llamada en cada tarea:
function callBack(tareaId){   
  Utilities.sleep(60000);  //Simulamos un tiempo de trabajo de 1 minuto
  SpreadsheetApp.openById('codigoDeTuArchivo').getActiveSheet().appendRow([String(tareaId), 'Tarea terminada']);
  return;
}

/************* NO TOCAR EL SIGUIENTE CÓDIGO *************/

/**
 * Función que se ejecuta cada minuto mediante un activador creado de manera manual.
 * Esta función invoca el manager de la librería 'Paralelizador' para ejecutar tareas distribuidas.
 *
 * @param {GoogleAppsScript.Script.EventObject} e - El objeto evento proporcionado por el activador.
 */
function funcionActivador(e) {
  var newExecution = false;
  const properties = PropertiesService.getUserProperties();
  const lock = LockService.getUserLock();  
  if(properties.getProperty(e.triggerUid) != e.triggerUid){
    try{
      lock.waitLock(15000); 
      properties.setProperty(e.triggerUid, e.triggerUid);
      newExecution = true;
    }catch(e){Logger.log(e)}
  }
  
  Paralelizador.manager(e.triggerUid, callBack, newExecution, NUM_TAREAS, NUM_HILOS);
}
