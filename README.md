# Paralelizador
_Paralelizador_ es una librería diseñada para facilitar la computación distribuida en [Google App Script](https://developers.google.com/google-apps/), permitiendo ejecutar múltiples tareas en paralelo. Esto que puede reducir significativamente el tiempo de ejecución total comparado con el procesamiento secuencial.<br />

> **Nota**: Esta librería ha sido creada por la Universidad de La Rioja como parte del proyecto de investigación RecREA 2022.

## Funcionamiento

1. **Inicio**: El usuario configura y activa un disparador que se ejecuta cada minuto.
2. **Invocación del disparador**: Cuando se activa el disparador, este llama a la función principal que utiliza la librería.
3. **Inicialización de la librería**: La función principal inicia la librería, especificando:
    - El número de hilos (con un máximo de 19).
    - El total de tareas a realizar.
    - La función callback que se ejecutará en cada hilo.
5. **Distribución de tareas**: La librería asigna tareas a cada hilo:
    - Cada hilo ejecuta la función callback recibiendo como parámetro de entrada el número de tarea específico.
    - Se controla el tiempo de ejecución para no superar el límite de Google.
6. **Monitoreo de tareas**: La librería verifica si todas las tareas han sido completadas.
7. **Finalización**:
    - Si todas las tareas están completas, se eliminan todos los disparadores y hilos.
    - Si no, el proceso espera al próximo disparo del disparador para continuar con las tareas restantes.
7. **Cierre**: Fin del proceso una vez que todas las tareas están finalizadas y los disparadores eliminados.
<br /><br />
<div style="text-align: center;">
    <img src="https://github.com/recreaur/Paralelizador/assets/117653444/04f2cf0c-1e42-425e-99ff-932201be5fef" alt="Diagrama" style="width: 50%;">
</div>


## Copiar la librería
Una copia del proyecto _Google App Script_ está disponible [Aquí](https://script.google.com/d/1Tqxfvt_bD-RugtOuaRxrv1AAJ9-iyWaX8kuPHsSp9mwtkJYOdb4wjgk-/edit?usp=sharing).
Para copiar la la librería, pulsar en el botón "Hacer una copia" ubicado en:
![ClonarLibrería](https://user-images.githubusercontent.com/117653444/200324830-74f5a4ee-e36d-4521-9bd7-1d6426d30172.png)


## Añadir la librería a tu proyecto
_Paralelizador_ para _Google App Script_ está disponible como una librería. Se debe incluir en un proyecto de la siguiente manera:
1. Dentro del editor de un proyecto, en el panel lateral izquierdo, pulsar en la sección "Bibliotecas" el botón "+"
2. Introducir el ID de secuencia de comandos `1Tqxfvt_bD-RugtOuaRxrv1AAJ9-iyWaX8kuPHsSp9mwtkJYOdb4wjgk-` en la caja de texto > Pulsar "Buscar"
3. Escoger dentro del desplegable la última versión y elegir `Paralelizador` como identificador
4. Pulsar Añadir. Ya se puede utilizar _Paralelizador_ como librería en el código.


## Probar la librería
Para probar la librería, sigue estos pasos:

1. **Crea un nuevo proyecto en Google Apps Script.**
2. **Copia y pega el código base en el editor de script.**
```javascript
/************* COMPLETAR POR EL USUARIO *************/

//Número de tareas que se van a lanzar:
const NUM_TAREAS = 100; 
//Número de hilos (triggers - máximo 19) que ejecutarán simultáneamente las tareas:
const NUM_HILOS = 10;   

//Función que será llamada en cada tarea:
function callBack(tareaId){   
  Utilities.sleep(60000);
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

```
3. **Ajusta los parámetros de configuración según tus necesidades:**
   - `NUM_TAREAS`: Número total de tareas a ejecutar.
   - `NUM_HILOS`: Número de hilos de ejecución paralela, con un máximo de 19.
   - `callBack`: Implementa la función según tus necesidades. En el ejemplo, la función _callBack_ emula una carga de trabajo de un minuto y registra el resultado en un _Spreadsheet_ de _Google_. La queremos lanzar 100 veces, lo que en secuencial serían 100 minutos, pero vamos a distribuirlo en 10 hilos que se ejecutarán en paralelo, por lo que debería tardar en torno a 10 minutos.

4. **Crea manualmente un disparador que ejecute la función _funcionActivador_ cada minuto.**
    a. Seleccionar en el panel lateral izquierdo "Activadores"
    b. Añadir Activador
    c. Fijar las opciones tal y como se muestra en la imagen:
   
![Crear Disparador](https://user-images.githubusercontent.com/117653444/200328006-545302d6-6bdc-46c7-9afb-10d94040c2d5.png)

4. Una vez creado el disparador, el programa se ejecutará de manera autónoma. Se puede ver el progreso de trabajo en la sección "Ejecuciones" y las tareas corriendo en la sección "Activadores".

## Licencia
Universidad de La Rioja
