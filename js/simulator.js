var btn_on_off = document.getElementById("btnOnOff");
var btn_energy_up = document.getElementById("btnEnergyUp");
var btn_energy_down = document.getElementById("btnEnergyDown");
var btn_charge = document.getElementById("btnCharge");
var btn_discharge = document.getElementById("btnShock");
var audio = new Audio();

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
btn_discharge.addEventListener("click", function(){performAction("prompt")})