var efecto = null;
var clip = "video/demovideo1"; // nombre del vídeo, sin extensión
var aud = "audio/soundtrack.mp3";

window.onload = function() {

	var video = document.getElementById("video");
	var botonByN = document.getElementById("byn");
	botonByN.onclick = cambiarEfecto;
	var botonNormal = document.getElementById("normal");
	botonNormal.onclick = cambiarEfecto;
	var botonCieniaFiccion = document.getElementById("cienciaFiccion");
	botonCieniaFiccion.onclick = cambiarEfecto;
	var botonRotar = document.getElementById("rotar");
	botonRotar.onclick = rotarlo;
	var botonPause = document.getElementById("pausa");
	botonPause.onclick = pausarVideo;
	var botonMute = document.getElementById("mute");
	botonMute.onclick = mute;
	var botonPlayAudio = document.getElementById("pAudio");
	botonPlayAudio.onclick = playAud;

	video.addEventListener("play", procesarFrame, false);

	video.src = clip + getFormatExtension();
	video.load();
	video.muted = true,
	video.play();

}

function playAud() {
	const audio = document.getElementById(myAudio2);
	audio.load();
	audio.play();
}

function loadAudio(path) {
	var a = new Audio(path);
	a.loadAudio();
	return a;
}

function pausarVideo(){
	var video = document.getElementById("video");
	if (video.paused || video.ended) {
		video.play();
	}else{
		video.pause();
	}
}

function mute(){
	var video = document.getElementById("video");
	if(video.muted == true){
		video.muted = false;
	} else {
		video.muted = true;
	}
}

function cambiarEfecto(e){
	var id = e.target.getAttribute("id");
	if ( id == "byn" ){
		efecto = byn;
	} else if (id == "cienciaFiccion" ) {
		efecto = scifi;
	} else {
		efecto = null;
	}
}

function getFormatExtension() {
	var video = document.getElementById("video");
	if (video.canPlayType("video/mp4") != "") {
		return ".mp4";
	}
	else if (video.canPlayType("video/ogg") != "") {
		return ".ogv";
	}
	else if (video.canPlayType("video/webm") != "") {
		return ".webm";
	}
}



function procesarFrame(e) {
	var video = document.getElementById("video");

	if (video.paused || video.ended) {
		return;
	}

	var bufferCanvas = document.getElementById("buffer");
	var displayCanvas = document.getElementById("display");
	var buffer = bufferCanvas.getContext("2d");
	var display = displayCanvas.getContext("2d");

	buffer.drawImage(video, 0, 0, bufferCanvas.width, bufferCanvas.height);
	var frame = buffer.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height);
	var length = frame.data.length / 4;

	for (var i = 0; i < length; i++) {
		var r = frame.data[i * 4 + 0];
		var g = frame.data[i * 4 + 1];
		var b = frame.data[i * 4 + 2];
		if (efecto){
			efecto(i, r, g, b, frame.data);
		}
	}
	display.putImageData(frame, 0, 0);

	//setTimeout(procesarFrame, 0);
	// en los navegadores modernos, es mejor usar :
	requestAnimationFrame(procesarFrame);

}

function byn(pos, r, g, b, data) {
	var gris = (r+g+b)/3;

	data[pos * 4 + 0] = gris;
	data[pos * 4 + 1] = gris;
	data[pos * 4 + 2] = gris;
}

function scifi(pos, r, g, b, data) {
	var offset = pos * 4;
	data[offset] = Math.round(255 - r);
	data[offset+1] = Math.round(255 - g) ;
	data[offset+2] = Math.round(255 - b) ;
}

function rotate() {
	var video = document.getElementsByClassName("video");
	var bufferCanvas = document.getElementById("buffer");
	var displayCanvas = document.getElementById("display");
	var buffer = bufferCanvas.getContext("2d");
	var display = displayCanvas.getContext("2d");
	var canvasWidth = 720;
	var canvasHeight = 480;


	buffer.clearRect(0, 0, canvasWidth, canvasHeight);
	buffer.translate(canvasWidth/2, canvasWidth/2);
	buffer.rotate(Math.PI / 180);
	buffer.translate(-canvasWidth/2, -canvasWidth/2);
	display.clearRect(0, 0, canvasWidth, canvasHeight);
	display.translate(canvasWidth/2, canvasWidth/2);
	display.rotate(Math.PI / 180);
	display.translate(-canvasWidth/2, -canvasWidth/2);


	var frame = buffer.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height);
	var length = frame.data.length / 4;

	for (var i = 0; i < length; i++) {
		var r = frame.data[i * 4 + 0];
		var g = frame.data[i * 4 + 1];
		var b = frame.data[i * 4 + 2];
		if (efecto){
			efecto(i, r, g, b, frame.data);
		}
	}
}
function rotarlo(){
	setInterval(rotate,180);
}
