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

const promptUrl = 'audio/prompt.mp3';
const onOffUrl = 'audio/turnon.mp3';
const clickUrl = 'audio/tick.mp3';
const charge20JUrl = 'audio/charge20J.mp3';
const charge200JUrl = 'audio/charge200J.mp3';
const charge300JUrl = 'audio/charge300J.mp3';

const context = new AudioContext();
var source;
let promptBuffer, onOffBuffer, clickBuffer, charge20JBuffer, charge200JBuffer, charge300JBuffer;

function createBuffers(){
  window.fetch(promptUrl)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      promptBuffer = audioBuffer;
  });
  
  window.fetch(onOffUrl)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      onOffBuffer = audioBuffer;
  });
  
  window.fetch(clickUrl)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      clickBuffer = audioBuffer;
  });
  
  window.fetch(charge20JUrl)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      charge20JBuffer = audioBuffer;
  });
  
  window.fetch(charge200JUrl)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      charge200JBuffer = audioBuffer;
  });
  
  window.fetch(charge300JUrl)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      charge300JBuffer = audioBuffer;
  });

  console.log('Audio loaded');
}

function fullscreen() {
  if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      console.log('Entered fullscreen');
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen(); 
    }
  }
}

function initialize(){
  createBuffers();
  fullscreen();
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
      consecutiveSounds = true;
      playSound(buffer);
      source.onended = function(){
          playPromptLoop();
      }
    }else{
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
btn_fullscreen.addEventListener("click", function(){initialize()});