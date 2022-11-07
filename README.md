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
Para copiar la la librería, pulsar en botón "Hacer una copia" ubicado en:
![ClonarLibrería](https://user-images.githubusercontent.com/117653444/200324830-74f5a4ee-e36d-4521-9bd7-1d6426d30172.png)

## Probar la librería
Para probar la librería _Paralelizador_ Necesitamos crear 2 funciones y 1 disparador.
1. La función principal que será el handler del disparador
```javascript
function testing(e) {
  Paralelizador.manager(
    e.triggerUid, 
    thread, //Función que realiza el trabajo
    100,    //Número de tareas que se van a lanzar
    16      //Número de hilos (disparadores) que ejecutarán simultáneamente las tareas
    );
}
```
2. La función autónoma que ejecutará una parte del trabajo.
```javascript
function thread(iteration){
  Utilities.sleep(60000);
  return "fLX" + iteration;
}
```
