//functionality exit fullscreen
//loop audio adequately and have it stop

var btn_on_off = document.getElementById("btnOnOff");
var btn_energy_up = document.getElementById("btnEnergyUp");
var btn_energy_down = document.getElementById("btnEnergyDown");
var btn_charge = document.getElementById("btnCharge");
var btn_discharge = document.getElementById("btnShock");
var btn_fullscreen = document.getElementById("btnFullscreen");
var btn_dumpCharge = document.getElementById("btnDumpCharge");
var doc = document.documentElement;
var consecutiveSounds = false;
var charging = false;

const promptUrl = 'audio/prompt.mp3';
const onOffUrl = 'audio/turnon.mp3';
const clickUrl = 'audio/tick.mp3';
const charge20JUrl = 'audio/charge20J.mp3';
const charge200JUrl = 'audio/charge200J.mp3';
const charge300JUrl = 'audio/charge300J.mp3';

const context = new AudioContext();
var source;
let promptBuffer, onOffBuffer, clickBuffer, charge20JBuffer, charge200JBuffer, charge300JBuffer;

window.onload = function(){
  createBuffers();
}

async function file2Buffer(filepath){
  //fetches audio file and loads content and returns buffer
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await context.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

async function createBuffers(){
  //create buffers for all sounds
  promptBuffer = await await file2Buffer(promptUrl);
  onOffBuffer = await file2Buffer(onOffUrl);
  clickBuffer = await file2Buffer(clickUrl);
  charge20JBuffer = await file2Buffer(charge20JUrl);
  charge200JBuffer = await file2Buffer(charge200JUrl);
  charge300JBuffer = await file2Buffer(charge300JUrl);
  console.log('Audio loaded');
}

function fullscreen() {
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

function playSound(buffer){
  if(source){
    source.stop();
  }
  source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start();
}

function playPromptLoop(){
  if(consecutiveSounds){
    source = context.createBufferSource();
    source.buffer = promptBuffer;
    source.connect(context.destination);
    source.loop = true;
    source.loopStart = 0.3;
    source.loopEnd = 0.8;
    source.start();
  }
}

function performAction(buffer){
    if(buffer === charge20JBuffer | buffer === charge200JBuffer | buffer === charge300JBuffer){
      consecutiveSounds = true; //signal that a sound will follow another
      if(!charging){
        charging = true; //to prevent that if the charging button is pressed twice, it will start sounding twice. This will result in the charging prompt sounding without it being mutable
        playSound(buffer);
        source.onended = function(){
            playPromptLoop();
        }
      }
    }else{
      charging = false;
      consecutiveSounds = false;
      playSound(buffer);
    }
}

btn_on_off.addEventListener("click", function(){performAction(onOffBuffer)});
btn_energy_up.addEventListener("click", function(){performAction(clickBuffer)});
btn_energy_down.addEventListener("click", function(){performAction(clickBuffer)});
btn_charge.addEventListener("click", function(){performAction(charge200JBuffer)});
btn_discharge.addEventListener("click", function(){performAction(clickBuffer)});
btn_dumpCharge.addEventListener("click", function(){performAction(clickBuffer)})
btn_fullscreen.addEventListener("click", function(){fullscreen()});