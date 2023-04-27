var tamano = 400;
const myImage = new Image();
image = myImage.src = "perro.jpg";
var otrocanvas = document.getElementById(image);
var currentStream = null;
var facingMode = "user";

var modelo = null;

(async() => {
  console.log("Cargando modelo...");
  modelo = await tf.loadLayersModel("model.json");
  console.log("Modelo cargado");
})();

predecir();
function predecir() {
  if (modelo != null) {
    //Hacer la predicción
    var ctx2 = otrocanvas.getContext("2d");
    var imgData = ctx2.getImageData(0,0, 100, 100);

    var arr = [];
    var arr100 = [];

    for (var p=0; p < imgData.data.length; p+= 4) {
      var rojo = imgData.data[p] / 255;
      var verde = imgData.data[p+1] / 255;
      var azul = imgData.data[p+2] / 255;

      var gris = (rojo+verde+azul)/3;

      arr100.push([gris]);
      if (arr100.length == 100) {
        arr.push(arr100);
        arr100 = [];
      }
    }

    arr = [arr];

    var tensor = tf.tensor4d(arr);
    var resultado = modelo.predict(tensor).dataSync();

    var respuesta;
    if (resultado <= .5) {
      respuesta = "Gato";
    } else {
      respuesta = "Perro";
    }
    console.log(respuesta);
    }
}