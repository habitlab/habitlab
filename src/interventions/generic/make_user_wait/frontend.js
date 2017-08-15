set_default_parameters({
  seconds: 5 // Seconds that the user must wait before the page loads
})

require_component('interstitial-screen')
const $ = require('jquery')

const {
  append_to_body_shadow,
  once_body_available
} = require('libs_frontend/frontend_libs')

var shadow_div;

(async function() {
  var interst_screen = $('<interstitial-screen>')
  interst_screen.addClass('interst_screen')
  var buttonText = 'Continue to ' + intervention.sitename_printable

  interst_screen.attr('btn-txt', buttonText)

  var buttonText2 = 'Close ' + intervention.sitename_printable
  interst_screen.attr('btn-txt2', buttonText2)
  let messageString = 'Take a deep breath.';
  interst_screen.attr('title-text', messageString)
  interst_screen[0].hideButton();
  interst_screen[0].showProgress();
  interst_screen.attr('intervention', intervention.name)
  var value_counter = 0;
  var start_time = Date.now()

  var countdown = setInterval(function() {
    var seconds_elapsed = (Date.now() - start_time) / 1000
    var progress_value = (seconds_elapsed / parameters.seconds) * 100
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
