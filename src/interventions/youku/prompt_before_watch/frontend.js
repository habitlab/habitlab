window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

var $ = require('jquery');

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')
require('components/close-tab-button.deps')
require('components/video-overlay.deps')
require('bower_components/paper-button/paper-button.deps')

var video_pauser = null;
var play_video_clicked = false;

function create_video_pauser() {
  if (video_pauser != null) {
    return
  }
  play_video_clicked = false
  video_pauser = setInterval(() => {
    if (play_video_clicked) {
      clearInterval(video_pauser);
      video_pauser = null
      return;
    }
    pauseVideo();
  }, 100);
}

function pauseVideo() {
  $('.bottom-public_play').click()
  $('.btn-video').click()
}

/*
function pauseVideo() {
  var video_index = 0;
  for (let x of $('object[type="application/x-shockwave-flash"]')) {
    var offset = $(x).offset();
    var width = $(x).width();
    var height = $(x).height();
    x.style.display = 'none';
    if (video_index == 0) {
      ++video_index;
      continue;
    } else {
      ++video_index;
    }
    if ($('.habitlab_overlay').length > 0) {
      continue;
    }
    var overlay = $('<video-overlay class="habitlab_overlay">').css({
      'background-color': 'red',
      'position': 'absolute',
      'z-index': Number.MAX_SAFE_INTEGER
    }).offset(offset).width(width).height(height)
    $('body').append(overlay);
  }
}
*/

function resumeVideo() {
  for (let x of $('object[type="application/x-shockwave-flash"]')) {
    x.style.display = '';
  }
  $('.habitlab_overlay').remove();
}

pauseVideo();
create_video_pauser();

window.on_intervention_disabled = () => {
  play_video_clicked = true;
  resumeVideo();
}

window.debugeval = x => eval(x);

