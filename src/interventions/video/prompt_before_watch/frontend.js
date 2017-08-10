const $ = require('jquery');

const {
  once_available
} = require('libs_frontend/common_libs')

require_component('video-overlay')

function pause_video() {
  console.log('pause_video called')
  var video = document.querySelector('video')
  video.pause()
}

function resume_video() {
  console.log('resume_video called')
  var video = document.querySelector('video')
  video.play()
}

function remove_overlay_and_resume_video() {
  console.log('remove_overlay_and_resume_video called')
  $('video-overlay').remove()
  resume_video()
}

function set_overlay_position_over_video() {
  console.log('resizing overlay position over video')
  var video = $('video')
  var overlay = $('video-overlay')
  overlay.offset(video.offset())
  overlay.width(video.width())
  overlay.height(video.height())
}

function pause_video_and_add_overlay() {
  pause_video()
  console.log('adding overlay')
  var overlay = $('<video-overlay>').css({
    position: 'absolute',
    'z-index': 999999999999,
  })
  overlay.on('watch_clicked', function() {
    console.log('watch_clicked on outside')
    remove_overlay_and_resume_video()
  })
  $('body').append(overlay)
  set_overlay_position_over_video()
  check_video_size_position()
}

once_available('video', function() {
  console.log('video tag is now available')
  pause_video_and_add_overlay()
})

let prev_video_width = 0
let prev_video_height = 0
let prev_video_offset_left = 0
let prev_video_offset_top = 0
let video_checker_stoptime_set = false
let video_checker = null

function check_video_size_position() {
  if (video_checker != null) {
    return
  }
  video_checker_stoptime_set = false
  video_checker = setInterval(function() {
    let video = $('video')
    if (video.length == 0) {
      return
    }
    if (!video_checker_stoptime_set) {
      video_checker_stoptime_set = true
      setTimeout(function() {
        clearInterval(video_checker)
        video_checker = null
      }, 5000)
    }
    let video_offset = video.offset()
    let video_offset_left = video_offset.left
    let video_offset_top = video_offset.top
    let video_width = video.width()
    let video_height = video.height()
    if (prev_video_width != video_width || prev_video_height != video_height || prev_video_offset_left != video_offset_left || prev_video_offset_top != video_offset_top) {
      set_overlay_position_over_video()
      prev_video_offset_left = video_offset_left
      prev_video_offset_top = video_offset_top
      prev_video_width = video_width
      prev_video_height = video_height
    }
  }, 50)
}

window.addEventListener('resize', function(evt){
  check_video_size_position()
})
