(() => {

  if (window.make_user_wait) {
    return
  }
  window.make_user_wait = true

  require('enable-webcomponents-in-content-scripts')
  require('components/interstitial-screen.deps')
  const $ = require('jquery')

  const {
    log_impression,
    log_action,
  } = require('libs_common/log_utils')

  var interst_screen = $('<interstitial-screen class="interst_screen">')
  var buttonText = 'Continue to Facebook'
  interst_screen.attr('btn-txt', buttonText)

  var buttonText2 = 'Close Facebook'
  interst_screen.attr('btn-txt2', buttonText2)
  var secondsLeft = intervention.params.seconds.value
  var messageString = 'Loading...';
  secondsLeft--
  interst_screen.attr('title-text', messageString)
  interst_screen[0].hideButton();
  interst_screen[0].showProgress();
  interst_screen.attr('intervention', intervention.name)
  log_impression(intervention.name)
  var value_counter = 0;

  
  var countdown = setInterval(function() {
    interst_screen[0].incrementProgress();
    value_counter++;
    if (value_counter >= 100) {
      clearInterval(countdown)
      interst_screen.attr('title-text', 'Facebook is available, if you really want to visit.')
      interst_screen[0].showButton();
    }
  }, 50)

  $(document.body).append(interst_screen)
  
  document.body.addEventListener('disable_intervention', () => {
    $('.interst_screen').remove();
  });


})()