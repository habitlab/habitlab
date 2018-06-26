set_default_parameters({
  seconds: 0 // Seconds that the user must wait before the page loads
})

require_component('banner-netflix-screen')
const $ = require('jquery')

const main = async function() {
  var interst_screen = $('<banner-netflix-screen>')
  interst_screen.addClass('interst_screen')
  var buttonText = 'Continue to ' + intervention.sitename_printable

  interst_screen.attr('btn-txt', buttonText)

  var buttonText2 = 'Close ' + intervention.sitename_printable
  interst_screen.attr('btn-txt2', buttonText2)
  var secondsLeft = parameters.seconds
  var messageString = 'Loading...';
  secondsLeft--
  interst_screen.attr('intervention', intervention.name)
  var value_counter = 0;

  var countdown = setInterval(function() {
    interst_screen[0].incrementProgress();
    value_counter++;
    if (value_counter >= 100) {
      clearInterval(countdown)
    }
  }, 50)

  $(document.body).append(interst_screen)
}

main();

window.on_intervention_disabled = () => {
  $('.interst_screen').remove();
}
