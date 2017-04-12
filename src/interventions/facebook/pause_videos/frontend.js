window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

const $ = require('jquery')

var video_pauser = null;

function pauseAll() {
  video_pauser = setInterval(function() {
    for (let x of $('video')) {
      x.pause();
    }
  }, 1000)
}

function stopPauseAll() {
  clearInterval(video_pauser);
}

pauseAll();

window.on_intervention_disabled = () => {
  stopPauseAll();
}

window.debugeval = x => eval(x);
