window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

const $ = require('jquery')

var video_pauser = null;

let video_locations = [];

$(document).click((evt) => {
  const {offsetX, offsetY} = evt;
  for (let {left, top, width, height, video} of video_locations) {
    if (left <= offsetX <= left+width && top <= offsetY <= top+height) {
      $(video).attr('pauser_disabled', 'true')
    }
  }
})

function pauseAll() {
  video_pauser = setInterval(function() {
    video_locations = [];
    for (let x of $('video')) {
      const $x = $(x)
      const {top, left} = $x.offset()
      const width = $x.width()
      const height = $x.height()
      video_locations.push({
        left,
        top,
        width,
        height,
        video: x,
      })
      if (!$x.attr('pauser_disabled')) {
        x.pause();
      }
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
