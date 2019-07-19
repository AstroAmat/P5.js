/*****************************************************************************\
********************************** V I D A ************************************
*******************************************************************************

  p5.vida 0.2.28a by Paweł Janicki, 2017-2019
    https://tetoki.eu/vida | https://paweljanicki.jp

*******************************************************************************

  VIDA by Paweł Janicki is licensed under a Creative Commons
  Attribution-ShareAlike 4.0 International License
  (http://creativecommons.org/licenses/by-sa/4.0/). Based on a work at:
  https://tetoki.eu.

*******************************************************************************

/ ************************************************** **************************** \
********************************** VIDA *************** *********************
*************************************************** *****************************

  p5.vida 0.2.28a por Paweł Janicki, 2017-2019
    https://tetoki.eu/vida | https://paweljanicki.jp

*************************************************** *****************************

  VIDA by Paweł Janicki tiene licencia de Creative Commons
  Atribución-Compartir Igual 4.0 Licencia Internacional
  (http://creativecommons.org/licenses/by-sa/4.0/). Basado en un trabajo en:
  https://tetoki.eu.

*************************************************** *****************************

  VIDA es una biblioteca simple que agrega detección de movimiento basada en cámara (o video)
  y funcionalidad de seguimiento de blob a p5js.

  La biblioteca permite la detección de movimiento basada en una estática o progresiva.
  fondo; definiendo zonas rectangulares en la imagen monitorizada, dentro de las cuales
  la aparición de movimiento desencadena la reacción del programa; detección de
  Objetos en movimiento ("manchas") con índice único, posición, masa, rectángulo,
  Polígono aproximado.

  Las principales pautas de la biblioteca son mantener el código en un formato compacto.
  Forma, fácil de modificar, piratear y retrabajar.

  ¡VIDA es parte de los Tetoki! proyecto (https://tetoki.eu) y está desarrollado
  Gracias a la ayuda sustancial y la cooperación con el Centro de Arte WRO
  (https://wrocenter.pl) y el Centro de Investigación HAT
  (http://artandsciencestudies.com).

  Notas:

    [1] Limitaciones: por supuesto, el uso de la cámara desde el navegador web
    está sujeto a diversas restricciones relacionadas principalmente con la configuración de seguridad (en
    En particular, los navegadores difieren significativamente en términos de permitir el acceso a
    la cámara de video para páginas web (por ejemplo, bocetos p5js) cargados desde medios locales o
    desde la red: en el último caso, también es importante si la conexión
    utiliza el protocolo HTTPS [o HTTP]). Por lo tanto, si hay problemas con
    acceso a la cámara de video desde un navegador web, vale la pena probar un
    uno diferente. Durante el desarrollo, para los controles sobre la marcha, VIDA es principalmente
    Probado con Firefox, que de forma predeterminada le permite acceder a la cámara de video
    desde archivos cargados desde medios locales. La propia VIDA no impone ninguna.
    restricciones específicas adicionales relacionadas con el tipo y los parámetros de la
    Cámara: cualquier cámara de video que trabaje con p5js debería funcionar con la biblioteca.
    Puede encontrar información valiosa sobre este tema en https://webrtc.org y
    En la documentación del navegador web que utilice.
    
    [2] También vale la pena recordar que la detección de manchas es bastante costosa
    computacionalmente, así que vale la pena quedarse con el video más bajo posible
    resoluciones si planea ejecutar sus programas en el hardware, el
    El rendimiento no está seguro. La eficiencia en el procesamiento de video desde un
    Cámara de video y archivos de video deben ser similares.

    [3] VIDA está utilizando (con algunas excepciones) coords normalizados en lugar de
    basado en píxeles Así, las coordenadas de las zonas activas, la ubicación de
    Los objetos en movimiento detectados (y algunos de sus otros parámetros) son
    representado por números de punto flotante dentro del rango de 0.0 a 1.0. los
    El uso de coordenadas y parámetros normalizados permite manipular el
    resolución de la imagen que se está procesando (por ejemplo, desde una cámara de video) sin
    Tener que cambiar, por ejemplo, la posición de las zonas activas. análogamente, datos
    describir objetos en movimiento es más fácil de usar, si sus valores no están relacionados
    a cualquier resolución específica expresada en píxeles. Nombres de todos normalizados.
    los parámetros van precedidos por el prefijo "norma". La esquina superior izquierda de la
    La imagen tiene las coordenadas [0.0, 0.0]. La esquina inferior derecha de la imagen.
    tiene las coordenadas [1.0, 1.0].

                      [0.0, 0.0]
                      + ------------------------------ |
                      |                     [0.5, 0.2] |
                      |                              + |
                      |                                |
                      |                    [0.25, 0.5] |
                      |                              + |
                      |                                |
                      |                     [0.7, 0.8] |
                      |                              + |
                      |                                |
                      | ------------------------------ +
                                                     [1.0, 1.0]
EN- Translate de Documentation: AstroAmat www.astroamat.com
ES- Traducción de la documentación: AstroAmat. wwww.astroamat.com

\*****************************************************************************/

var myCapture, // camera
    myVida;    // VIDA

/*
ES- Aquí estamos tratando de acceder a la cámara.

EN- Here we are trying to get access to the camera.
*/
function initCaptureDevice() {
  try {
    myCapture = createCapture(VIDEO);
    myCapture.size(320, 240);
    myCapture.elt.setAttribute('playsinline', '');
    myCapture.hide();
    console.log(
      '[initCaptureDevice] capture ready. Resolution: ' +
      myCapture.width + ' ' + myCapture.height
    );
  } catch(_err) {
    console.log('[initCaptureDevice] capture error: ' + _err);
  }
}

function setup() {
  createCanvas(640, 480); // EN- we need some space... // ES- Necesitamos algo de espacio
  initCaptureDevice(); // EN- and access to the camera // ES- y Necesitamos la camara

  /*
    VIDA stuff
  */
  myVida = new Vida(); // create the object // ES- creamos el proyecto
  /*
    EN-Turn on the progressive background mode. // ES- Activamos el modo de fondo progresivo
  */
  myVida.progressiveBackgroundFlag = true;
  /*
  EN-  You may need a horizontal image flip when working with the video camera.
    If you need a different kind of mirror, here are the possibilities:
      [your vida object].MIRROR_NONE
      [your vida object].MIRROR_VERTICAL
      [your vida object].MIRROR_HORIZONTAL
      [your vida object].MIRROR_BOTH
    The default value is MIRROR_NONE.
  */
  /*
  ES- Es posible que necesite un giro de imagen horizontal cuando trabaje con la cámara de video.
     Si necesitas un espejo diferente, aquí están las posibilidades:
       [tu objeto vida] .MIRROR_NONE
       [tu objeto vida] .MIRROR_VERTICAL
       [tu objeto vida] .MIRROR_HORIZONTAL
       [tu objeto vida] .MIRROR_BOTH
     El valor predeterminado es MIRROR_NONE.
   Activa el modo de fondo progresivo.

  */
  //myVida.mirror = myVida.MIRROR_HORIZONTAL; // EN- uncomment if needed  // ES- Descomentar esto si es necesario
  /*
  EN-
    The value of the feedback for the procedure that calculates the background
    image in progressive mode. The value should be in the range from 0.0 to 1.0
    (float). Typical values of this variable are in the range between ~0.9 and
    ~0.98.
  */
  /*
  ES-
  Imagen en modo progresivo. El valor debe estar en el rango de 0.0 a 1.0
     (flotador). Los valores típicos de esta variable están en el rango entre ~ 0.9 y
     ~ 0.98.
  */


  myVida.imageFilterFeedback = 0.92;
  /*
  EN-
    The value of the threshold for the procedure that calculates the threshold
    image. The value should be in the range from 0.0 to 1.0 (float).
  */
  /*
  ES-
  El valor del umbral para el procedimiento que calcula el umbral.
  imagen. El valor debe estar en el rango de 0.0 a 1.0 (flotador).
  */

  myVida.imageFilterThreshold = 0.15;

  frameRate(30); // EN- set framerate // ES- Aqui estableces el marco
}

function draw() {
  if(myCapture !== null && myCapture !== undefined) { // EN- safety first // ES- seguridad primero jaja
     background(0, 0, 255);
    /*
    EN-
      Call VIDA update function, to which we pass the current video frame as a
      parameter. Usually this function is called in the draw loop (once per
      repetition).
    */
    /*
    ES-
      Llame a la función de actualización de VIDA, a la que pasamos el cuadro de video actual como
      parámetro. Por lo general, esta función se llama  draw loop (una vez por
      repetición).
     */
    myVida.update(myCapture);
    /*
    EN-
      Now we can display images: source video and subsequent stages of image
      transformations made by VIDA.
    */
    /*
    ES-
      Ahora podemos mostrar imágenes: fuente de video y etapas posteriores de la imagen.
      Transformaciones realizadas por VIDA.
     */
    image(myCapture, 0, 0);
    image(myVida.backgroundImage, 320, 0);
    image(myVida.differenceImage, 0, 240);
    image(myVida.thresholdImage, 320, 240);
    // EN- let's also describe the displayed images // ES- Describimos tambien las imagenes mostradas
    noStroke(); fill(255, 255, 255);
    text('camera', 20, 20);
    text('vida: progressive background image', 340, 20);
    text('vida: difference image', 20, 260);
    text('vida: threshold image', 340, 260);
  }
  else {
    /*
    EN-
      If there are problems with the capture device (it's a simple mechanism so
      not every problem with the camera will be detected, but it's better than
      nothing) we will change the background color to alarmistically red.
    */
    /*
    ES-
     Si hay problemas con el dispositivo de captura (es un mecanismo simple, por lo que
     No todos los problemas con la cámara serán detectados, pero es mejor que
     nada) cambiaremos el color de fondo a rojo alarmista.
     */
    background(255, 0, 0);
  }
}
