const {
  wrap_in_shadow
} = require('libs_frontend/common_libs')

var $ = require('jquery');

require('bower_components/paper-button/paper-button.deps');
require('components/habitlab-logo.deps')

var video = null;
var is_video_resumed = false;

setInterval(() => {
  var tmp_video = $('video')[0]
  if (tmp_video != null) {
    video = tmp_video;
  }
  if ((video != null) && (video.duration - video.currentTime<=5)) {
    if (!is_video_resumed) {
      video.pause();
      attachButtons();
    }
  } else {
    is_video_resumed = false;
  }
}, 1000);

function resume_play() {
  is_video_resumed = true;
  video.play()
}

function attachButtons() {
  var habitlab_resume_play_div = $('<div>').css({
    'display': 'flex',
    'z-index': Number.MAX_SAFE_INTEGER,
    'position': 'fixed',
    'top': '0px',
    'left': '0px'
  })
  var resume_play_button = $('<paper-button style="background-color: #415D67; color: white; width: 152 px; height: 38px; -webkit-font-smoothing: antialiased; box-shadow: 2px 2px 2px #888888; font-size: 12px;">Resume play</paper-button>')
  var habitlab_logo = $('<habitlab-logo style="font-size: 12px; margin-left: 5px"></habitlab-logo>')
   habitlab_resume_play_div.append([
    resume_play_button,
    habitlab_logo
  ])
  $('body').append($(wrap_in_shadow(habitlab_resume_play_div, {position: 'fixed'})).attr('id', 'habitlab_resume_play_div'))
  resume_play_button.on('click', function() {   
    resume_play();
  });
}

window.on_intervention_disabled = () => {
  resume_play();
}

