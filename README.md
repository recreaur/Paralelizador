# Paralelizador
_Paralelizador_ es una librería de [Google App Script](https://developers.google.com/google-apps/) que permite paralelizar procesos a través de _triggers_.
Creado por la Universidad de La Rioja a través del proyecto de investigación RecREA 2022.


## Añadir la librería a tu proyecto
_Paralelizador_ para _Google App Script_ está disponible como una librería. Se debe incluir en un proyecto de la siguiente manera:
1. Solicitar el acceso a la librería
2. Dentro del editor de un proyecto, en el panel lateral izquierdo, pulsar en la sección "Bibliotecas" el botón "+"
3. Introducir el ID de secuencia de comandos `1Tqxfvt_bD-RugtOuaRxrv1AAJ9-iyWaX8kuPHsSp9mwtkJYOdb4wjgk-` en la caja de texto > Pulsar "Buscar"
4. Escoger dentro del desplegable la última versión y elegir `Paralelizador` como identificador
5. Pulsar Añadir. Ya se puede utilizar _Paralelizador_ como librería en el código.


## Copiar la librería
Una copia del proyecto _Google App Script_ está disponible [Aquí](https://script.google.com/d/1Tqxfvt_bD-RugtOuaRxrv1AAJ9-iyWaX8kuPHsSp9mwtkJYOdb4wjgk-/edit?usp=sharing).
Para copiar la la librería, pulsar en el botón "Hacer una copia" ubicado en:
![ClonarLibrería](https://user-images.githubusercontent.com/117653444/200324830-74f5a4ee-e36d-4521-9bd7-1d6426d30172.png)


## Probar la librería
Para probar la librería _Paralelizador_ Necesitamos crear 2 funciones y 1 disparador.
En el siguiente ejemplo, tenemos la función `thread` que emula una carga de trabajo de un minuto y devuelve un resultado. La queremos lanzar 100 veces, lo que en secuencial serían 100 minutos, pero vamos a distribuirlo en 10 hilos que se ejecutarán en paralelo, por lo que debería tardar en torno a 10 minutos.
1. La función principal que será el handler del disparador
```javascript
function testing(e) {
  Paralelizador.manager(
    e.triggerUid, 
    thread, //Función que realiza el trabajo
    100,    //Número de tareas que se van a lanzar
    10      //Número de hilos (triggers - máximo 19) que ejecutarán simultáneamente las tareas 
    );
}
```
2. La función autónoma que ejecutará una parte del trabajo:
```javascript
function thread(tareaId){
  Utilities.sleep(60000);
  return "Iter: " + tareaId;
}
```
3. Creamos el disparador manualmente (esto es necesario ya que de manera programática no funciona):
    1. Seleccionar en el panel lateral izquierdo "Activadores"
    2. Añadir Activador
    3. Fijar las opciones tal y como se muestra en la imagen
[Crear Disparador](https://user-images.githubusercontent.com/117653444/200328006-545302d6-6bdc-46c7-9afb-10d94040c2d5.png)

4. Una vez creado el disparador, el programa se ejecutará de manera autónoma. Se puede ver el progreso de trabajo en la sección "Ejecuciones" y las tareas corriendo en la sección "Activadores".

## Licencia
Universidad de La Rioja -¿MIT?
