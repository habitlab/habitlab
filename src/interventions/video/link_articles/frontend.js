set_default_parameters({
  seconds: 10 // Seconds that the user must wait before the page loads
})

require_component('netflix-screen')
const $ = require('jquery')

const {
  is_on_same_domain_and_same_tab
} = require('libs_common/session_utils')

const main = async function() {
  //const on_same_domain_and_same_tab = await is_on_same_domain_and_same_tab(tab_id)
  //if (on_same_domain_and_same_tab) {
  //  return
  //}
  console.log("main function called")
  var interst_screen = $('<netflix-screen>')
  interst_screen.addClass('interst_screen')
  var buttonText = 'Continue to ' + intervention.sitename_printable

  interst_screen.attr('btn-txt', buttonText)

  var buttonText2 = 'Close ' + intervention.sitename_printable
  interst_screen.attr('btn-txt2', buttonText2)
  var secondsLeft = parameters.seconds
  var messageString = 'Loading...';
  secondsLeft--
  interst_screen.attr('title-text', messageString)
  interst_screen[0].hideButton();
  interst_screen[0].showProgress();
  interst_screen.attr('intervention', intervention.name)
  var value_counter = 0;

  var countdown = setInterval(function() {
    interst_screen[0].incrementProgress();
    value_counter++;
    if (value_counter >= 100) {
      clearInterval(countdown)
      interst_screen.attr('title-text', intervention.sitename_printable + ' is available, if you really want to visit.')
      interst_screen[0].showButton();
    }
  }, 50)

  $(document.body).append(interst_screen)

}
console.log("video link articles frontend")
main();

window.on_intervention_disabled = () => {
  $('.interst_screen').remove();
}
