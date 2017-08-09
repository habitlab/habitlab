var $ = require('jquery');

var {
  once_available
} = require('libs_frontend/common_libs')

require('components/habitlab-logo.deps')
require('components/close-tab-button.deps')
require('components/video-overlay.deps')
require('bower_components/paper-button/paper-button.deps')

function pause_video() {
  console.log('pause_video called')
  var video = document.querySelector('video')
  if (!video.paused) {
    document.querySelector('.btn-pause').click()
  }
}

function resume_video() {
  console.log('resume_video called')
  var video = document.querySelector('video')
  if (video.paused) {
    document.querySelector('.btn-play').click()
  }
}

function remove_overlay_and_resume_video() {
  $('video-overlay').remove()
  resume_video()
}

function set_overlay_position_over_video() {
  console.log('resizing overlay position over video')
  var video = $('video')
  var overlay = $('video-overlay')
  overlay.css({
    position: 'absolute',
    width: video.width()+'px',
    height:video.height()+'px',
    top: video.offset().top+'px',
    left:video.offset().left+'px'
  })
}

function pause_video_and_add_overlay() {
  pause_video()
  console.log('adding overlay')
  var overlay = $('<video-overlay>')
  overlay.on('watch_clicked', function() {
    console.log('watch_clicked on outside')
    remove_overlay_and_resume_video()
  })
  $('body').append(overlay)
  set_overlay_position_over_video()
}

once_available('video', function() {
  console.log('video tag is now available')
  once_available('.btn-pause', function() {
    console.log('pause button is now available')
    pause_video_and_add_overlay()
  })
})

let prev_video_width = 0
let prev_video_height = 0

function once_video_has_different_height(callback) {
  let video = $('video')
  let video_width = video.width()
  let video_height = video.height()
  if (prev_video_height === video_height && prev_video_width === video_width) {
    setTimeout(function() {
      once_video_has_different_height(callback)
    }, 100)
  } else {
    prev_video_width = video_width
    prev_video_height = video_height
    callback()
  }
}

window.addEventListener('resize', function(evt){
  once_video_has_different_height(function() {
   set_overlay_position_over_video()
  })
})

