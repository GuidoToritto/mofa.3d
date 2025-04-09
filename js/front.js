// You can change global variables here:
var radius = 500; // how big of the radius
var autoRotate = true; // auto rotate or not
var rotateSpeed = -60; // unit: seconds/360 degrees
var imgWidth = 150; // width of images (unit: px)
var imgHeight = 200; // height of images (unit: px)

// Link of background music - set 'null' if you dont want to play background music
var bgMusicURL = 'https://api.soundcloud.com/tracks/143041228/stream?client_id=587aa2d384f7333a886010d5f52f302a';
var bgMusicControls = true; // Show UI music control

// ===================== start =======================
// Mostrar el loader al inicio
document.addEventListener('DOMContentLoaded', function() {
  // Crear el loader con la clase fh5co-loader
  const loader = document.createElement('div');
  loader.className = 'fh5co-loader';
  document.body.appendChild(loader);
  
  // Ocultar el contenido principal hasta que todo esté cargado
  const mainContent = document.getElementById('drag-container');
  if (mainContent) {
    mainContent.style.opacity = '0';
    mainContent.style.transition = 'opacity 0.5s';
  }
  
  // Iniciar la carga de imágenes
  preloadImages();
});

// Función para precargar todas las imágenes
function preloadImages() {
  var ospin = document.getElementById('spin-container');
  var aImg = ospin.getElementsByTagName('img');
  var totalImages = aImg.length;
  var loadedImages = 0;

  // Si no hay imágenes, inicializar directamente
  if (totalImages === 0) {
    hideLoaderAndInit();
    return;
  }

  // Verificar cuando cada imagen se carga
  for (var i = 0; i < totalImages; i++) {
    const img = aImg[i];

    // Si la imagen ya está cargada
    if (img.complete) {
      loadedImages++;
      if (loadedImages === totalImages) {
        hideLoaderAndInit();
      }
    } else {
      // Esperar a que la imagen se cargue
      img.addEventListener('load', function() {
        loadedImages++;
        if (loadedImages === totalImages) {
          hideLoaderAndInit();
        }
      });

      // Manejar errores de carga
      img.addEventListener('error', function() {
        loadedImages++;
        if (loadedImages === totalImages) {
          hideLoaderAndInit();
        }
      });
    }
  }

  // Llamar a la función hideLoaderAndInit() después de que se completen las imágenes
  setTimeout(function() {
    if (loadedImages === totalImages) {
      hideLoaderAndInit();
    }
  }, 1000);
}





// Ocultar el loader e inicializar el carrusel
function hideLoaderAndInit() {

  
  const loader = document.querySelector('.fh5co-loader');
  const mainContent = document.getElementById('drag-container');
  
  if (loader) {
    // Añadir clase para desvanecer el loader
    loader.style.opacity = '0';
    
    // Eliminar el loader después de la animación
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 500);
  }
  
  // Mostrar el contenido principal
  if (mainContent) {
    mainContent.style.opacity = '1';
  }
  
  // Inicializar el carrusel
  init();
}

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; // combine 2 arrays

// Size of images
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Size of ground - depend on radius
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
    
    // Agregar eventos de mouse para cada elemento
    aEle[i].addEventListener('mouseenter', function() {
      playSpin(false);
      this.style.transition = "transform 0.3s";
      this.style.transform = this.style.transform + ' scale(1.05)';
    });

    aEle[i].addEventListener('mouseleave', function() {
      playSpin(true);
      this.style.transition = "transform 0.3s";
      this.style.transform = this.style.transform.replace(' scale(1.05)', '');
      
      setTimeout(() => {
        this.style.transition = "transform 1s";
      }, 100);
    });
  }
}

function applyTranform(obj) {
  if(tY > 10) tY = 10;
  if(tY < 0) tY = 0;
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = (yes?'running':'paused');
}

var sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

// auto spin
if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

// add background music
if (bgMusicURL) {
  document.getElementById('music-container').innerHTML += `
<audio src="${bgMusicURL}" ${bgMusicControls? 'controls': ''} autoplay loop>    
<p>If you are reading this, it is because your browser does not support the audio element.</p>
</audio>
`;
}

// setup events
document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX,
      sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
        nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function (e) {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};
