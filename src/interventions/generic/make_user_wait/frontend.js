window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

if (typeof(window.wrap) != 'function')
  window.wrap = null

require('enable-webcomponents-in-content-scripts')
require('components/interstitial-screen.deps')
const $ = require('jquery')

const {
  append_to_body_shadow,
  once_body_available
} = require('libs_frontend/common_libs')

const {
  is_on_same_domain_and_same_tab
} = require('libs_common/session_utils')

var shadow_div;

(async function() {
  //const on_same_domain_and_same_tab = await is_on_same_domain_and_same_tab(tab_id)
  //if (on_same_domain_and_same_tab) {
  //  return
  //}

  var interst_screen = $('<interstitial-screen>')
  interst_screen.addClass('interst_screen')
  var buttonText = 'Continue to ' + intervention.sitename_printable

  interst_screen.attr('btn-txt', buttonText)

  var buttonText2 = 'Close ' + intervention.sitename_printable
  interst_screen.attr('btn-txt2', buttonText2)
  var secondsLeft = intervention.params.seconds.value
  var messageString = 'Take a deep breath.';
  secondsLeft--
  interst_screen.attr('title-text', messageString)
  interst_screen[0].hideButton();
  interst_screen[0].showProgress();
  interst_screen.attr('intervention', intervention.name)
  var value_counter = 0;
  var start_time = Date.now()

  var countdown = setInterval(function() {
    var milliseconds_elapsed = Date.now() - start_time
    var progress_value = milliseconds_elapsed / 50
    // after 5 seconds, aka 50k milliseconds, will exceed 100
    interst_screen[0].setProgress(progress_value)
    if (progress_value >= 100) {
      clearInterval(countdown)
      interst_screen.attr('title-text', intervention.sitename_printable + ' is available, if you really want to visit.')
      interst_screen[0].showButton();

    }
  }, 50)

  once_body_available().then(function() {
    shadow_div = append_to_body_shadow(interst_screen);
  })

})()

window.on_intervention_disabled = () => {
  $(shadow_div).remove();
}

window.debugeval = x => eval(x);
