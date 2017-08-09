require('components/netflix-stop-autoplay.deps')
const $ = require('jquery')

/*
let current_video_url = ''
let finished_watching_current_video = false
let dismissed_continue_watching_prompt = false

setInterval(function() {
  if (window.location.href != current_video_url) {
    current_video_url = window.location.href
    finished_watching_current_video = false
    dismissed_continue_watching_prompt
  }
  if (finished_watching_current_video && !dismissed_continue_watching_prompt) {
    let b=document.querySelector('video')
    b.pause()
  }
}, 1000)
*/

var end_of_show = null

var stop_autoplay_process = setInterval(function() {
  if (window.intervention_disabled) {
    return
  }
  if ($('a.nf-icon-button.nf-flat-button.no-icon').length > 0) {
    if ($('a.nf-icon-button.nf-flat-button.no-icon')[0].innerText.toLowerCase() != 'skip intro') {
      // arrived at the end of the video, small button style
      console.log('Watch credits button has appeared')
      var watch_credits_button = $('a.nf-icon-button.nf-flat-button.no-icon').first()
      for (let child of watch_credits_button.children()) {
        console.log('simulating click on child')
        console.log(child)
        $(child).click()
      }
      /*
      while (watch_credits_button.length > 0) {
        console.log('simulating click on')
        console.log(watch_credits_button)
        watch_credits_button.click()
        watch_credits_button.mousedown()
        watch_credits_button.mouseup()
        watch_credits_button = watch_credits_button.parent()
      }
      */
      $('a.nf-icon-button.nf-flat-button.no-icon').first().click()
      console.log($('a.nf-icon-button.nf-flat-button.no-icon').first())
      console.log($('a.nf-icon-button.nf-flat-button.no-icon').first().attr('aria-label'))
      console.log('Watch credits button clicked')
      let b=document.querySelector('video')
      b.pause()
      if ($('netflix-stop-autoplay').length == 0) {
        end_of_show = $('<netflix-stop-autoplay>')
        $(document.body).append(end_of_show)
      }
      //finished_watching_current_video = true
    }
  }

  if ($('.player-postplay').length > 0) {
    // we have arrived at the end of the video, 
    console.log('player-postplay div has appeared')
    let a=document.querySelector('video')
    if (a != null) {
      a.click()
      if (a.currentTime < a.duration - 4) {
        // more than 4 seconds away from the end of video
        console.log('have clicked on the video. should now be maximized')
        setTimeout(function() {
          console.log('pausing video')
          let b=document.querySelector('video')
          if (b != null) {
            b.pause()
          }
          //finished_watching_current_video = true
          console.log('video should now be paused')
          if ($('netflix-stop-autoplay').length == 0) {
            end_of_show = $('<netflix-stop-autoplay>')
            $(document.body).append(end_of_show)
          }
        }, 500) 
      }
    }
  }
}, 1000)

window.on_intervention_disabled = () => {
  clearInterval(stop_autoplay_process)
  if (end_of_show != null) {
    end_of_show.remove()
  }
  document.querySelector('video').play()
}
