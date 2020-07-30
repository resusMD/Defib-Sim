//html elements
var btn_on_off = document.getElementById("btnOnOff");
var btn_energy_up = document.getElementById("btnEnergyUp");
var btn_energy_down = document.getElementById("btnEnergyDown");
var btn_charge = document.getElementById("btnCharge");
var btn_shock = document.getElementById("btnShock");
var btn_fullscreen = document.getElementById("btnFullscreen");
var btn_dumpCharge = document.getElementById("btnDumpCharge");
var onOffCircle = document.getElementById("onOffCircle");

//audio files
const promptUrl = 'audio/prompt.mp3';
const onOffUrl = 'audio/turnon.mp3';
const clickUrl = 'audio/tick.mp3';
const charge20JUrl = 'audio/charge20J.mp3';
const charge200JUrl = 'audio/charge200J.mp3';
const charge300JUrl = 'audio/charge300J.mp3';

//web audio api
const context = new AudioContext();
var doc = document.documentElement;

//variables to run defibrillator
var consecutiveSounds = false;
var charging = false;
var source;
var charge = 0;
var isOn = false;
let promptBuffer, onOffBuffer, clickBuffer, charge20JBuffer, charge200JBuffer, charge300JBuffer;

window.onload = function(){
  createBuffers();
}

function triggerOnOff(){
  //function that triggers on and off state of defibrillator. Also sets on and off light
  isOn = !isOn; //toggle on off state

  if(isOn){
    playSound(onOffBuffer);
    onOffCircle.style.visibility = 'hidden'; //hide it since we're switching it off
  }else{
    playSound(clickBuffer);
    onOffCircle.style.visibility = 'visible';
  }
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

function triggerFullscreen() {
  if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen(); 
    }
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

function performAction(action){
  if(action === 'onOff'){
    triggerOnOff();
  }
  if(isOn){
    if(action === 'charge'){
      consecutiveSounds = true; //signal that a sound will follow another
      if(!charging){
        charging = true; //to prevent that if the charging button is pressed twice, it will start sounding twice. This will result in the charging prompt sounding without it being mutable
        playSound(charge300JBuffer);
        source.onended = function(){
            playPromptLoop();
        }
      }
    }else if(action === 'chargeUp'){
      charging = false;
      consecutiveSounds = false;
      //add to current charge
      playSound(clickBuffer);
    }else if(action === 'chargeDown'){
      charging = false;
      consecutiveSounds = false;
      //decrease charge
      playSound(clickBuffer);
    }else if(action === 'shock'){
      charging = false;
      consecutiveSounds = false;
      charge = 0;
      playSound(clickBuffer);
    }else if(action === 'dumpCharge'){
      charging = false;
      consecutiveSounds = false;
      charge = 0;
      playSound(clickBuffer);
    }
  }
  
}

btn_on_off.addEventListener("click", function(){performAction('onOff')});
btn_energy_up.addEventListener("click", function(){performAction('chargeUp')});
btn_energy_down.addEventListener("click", function(){performAction('chargeDown')});
btn_charge.addEventListener("click", function(){performAction('charge')});
btn_shock.addEventListener("click", function(){performAction('shock')});
btn_dumpCharge.addEventListener("click", function(){performAction('dumpCharge')})
btn_fullscreen.addEventListener("click", function(){triggerFullscreen()});