/**
 * Develve el número de triggers que tenga la función
 * handler funcName
 * 
 * @param   {string} funcName - Nombre de la función
 * @returns {integer} Número de triggers
 */
function getNumTriggers_(funcName='runParallelThread'){
  const triggers = ScriptApp.getScriptTriggers();
  return triggers.reduce((acum, curr) => 
    acum += curr.getHandlerFunction() == funcName ? 1 : 0
  , 0);
}


/**
 * Borra un trigger en base a su identificador
 * 
 * @param {string} triggerUid - The trigger UID
 */
function removeTrigger_(triggerUid){
  const triggers = ScriptApp.getScriptTriggers();
  for(i=0; i<triggers.length; i++){
    if(triggers[i].getUniqueId() == triggerUid){
      ScriptApp.deleteTrigger(triggers[i]);
      break;
    }
  }
}


/**
 * Borra todos los triggers con función handler
 * funcName
 * 
 * @param {string} triggerUid - The trigger UID
 */
function removeAllTriggers(funcName='runParallelThread'){
  const triggers = ScriptApp.getScriptTriggers();
  for(i=0; i<triggers.length; i++){
    if(triggers[i].getHandlerFunction() == funcName)
      ScriptApp.deleteTrigger(triggers[i]);
  }
}


/**
 * Borra las propiedades relacionadas con la librería
 */
function removeProperties(){
  
  PropertiesService.getScriptProperties().deleteAllProperties();

  PropertiesService.getUserProperties().deleteAllProperties();

  UserProperties.deleteAllProperties();

  const lockService = LockService.getUserLock();
  try{
    lockService.waitLock(10000);

    Object.keys(ENUMPROPERTIES).forEach(key => {
      PropertiesService
        .getDocumentProperties()
        .deleteProperty(ENUMPROPERTIES[key]);
    });

  }catch(e){
    Logger.log("No se pudo bloquear el almacén de propiedas" + e);
  }
}






