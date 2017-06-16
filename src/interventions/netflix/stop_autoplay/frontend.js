window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

if (typeof(window.wrap) != 'function')
  window.wrap = null

require('enable-webcomponents-in-content-scripts')
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

setInterval(function() {
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
      var end_of_show = $('<netflix-stop-autoplay>')
      $(document.body).append(end_of_show)
      //finished_watching_current_video = true
    }
  }
  if ($('.player-postplay').length > 0) {
    // we have arrived at the end of the video
    console.log('player-postplay div has appeared')
    let a=document.querySelector('video')
    a.click()
    console.log('have clicked on the video. should now be maximized')
    setTimeout(function() {
      console.log('pausing video')
      let b=document.querySelector('video')
      b.pause()
      //finished_watching_current_video = true
      console.log('video should now be paused')
      var end_of_show = $('<netflix-stop-autoplay>')
      $(document.body).append(end_of_show)
    }, 500) 
  }
}, 1000)

const {
  get_minutes_spent_on_domain_today,
  get_visits_to_domain_today
} = require('libs_common/time_spent_utils')

const {
  append_to_body_shadow
} = require('libs_frontend/common_libs')

const {
  url_to_domain
} = require('libs_common/domain_utils')

const {
  get_intervention
} = require('libs_common/intervention_info');

var shadow_div;

(async function() {
  var domain = url_to_domain(window.location.href)
  var numMins = await get_minutes_spent_on_domain_today(domain)
  var numVisits = await get_visits_to_domain_today(domain)
  var titleString = 'You have visited ' + url_to_domain(window.location.href) +' ' + numVisits + ' times and spent '+ numMins + ' minutes there today.'
  var sitename_printable = get_intervention().sitename_printable
  var buttonText = `Click to continue to ${sitename_printable}`
  var buttonText2 = `Close ${sitename_printable}`

  var interst_screen = $('<interstitial-screen-num-visits class="interst_screen">')
  interst_screen.attr('intervention', intervention.name)
  interst_screen.attr('btn-txt', buttonText)
  interst_screen.attr('btn-txt2', buttonText2)
  interst_screen.attr('title-text', titleString)
  interst_screen.attr('minutes', numMins);
  interst_screen.attr('visits', numVisits);
  interst_screen.attr('seconds', 0);

  shadow_div = append_to_body_shadow(interst_screen);
})()

window.on_intervention_disabled = () => {
  $(shadow_div).remove();
}

window.debugeval = x => eval(x);
