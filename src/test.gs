function testing(e) {
  manager(
    e.triggerUid, 
    thread, //Función que realiza el trabajo
    100,    //Número de tareas que se van a lanzar
    10      //Número de hilos (triggers - máximo 19) que ejecutarán simultáneamente las tareas 
    );
}


function thread(iteration){
  Utilities.sleep(6000);
  return "i: " + iteration;
}
