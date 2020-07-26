//functionality exit fullscreen
//loop audio adequately and have it stop
//charging screen

var btn_on_off = document.getElementById("btnOnOff");
var btn_energy_up = document.getElementById("btnEnergyUp");
var btn_energy_down = document.getElementById("btnEnergyDown");
var btn_charge = document.getElementById("btnCharge");
var btn_discharge = document.getElementById("btnShock");
var btn_fullscreen = document.getElementById("btnFullscreen");
var doc = document.documentElement;
var audio = new Audio();

locOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation || screen.orientation.lock;
locOrientation('landscape');

function fullscreen(){
    if (doc.requestFullscreen) {
        doc.requestFullscreen();
      } else if (doc.mozRequestFullScreen) { /* Firefox */
        doc.mozRequestFullScreen();
      } else if (doc.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        doc.webkitRequestFullscreen();
      } else if (doc.msRequestFullscreen) { /* IE/Edge */
        doc.msRequestFullscreen();
      }
}

function playSound(filename){
    audio.currentSrc = "";
    audio.src = `audio/${filename}.mp3`;
    audio.pause();
    audio.loop = false;
    audio.play();
}

function performAction(action){
    if(action === "charge20J" | action === "charge200J" | action === "charge300J"){
        playSound(action);
        audio.onended = function() {
            audio.src = "audio/prompt.mp3";
            audio.loop = true;
            audio.play();
        }
    }else{
        playSound(action);
    }
}

btn_on_off.addEventListener("click", function(){performAction("turnon")});
btn_energy_up.addEventListener("click", function(){performAction("tick")});
btn_energy_down.addEventListener("click", function(){performAction("tick")});
btn_charge.addEventListener("click", function(){performAction("charge300J")});
btn_discharge.addEventListener("click", function(){performAction("prompt")});
btn_fullscreen.addEventListener("click", function(){fullscreen()});