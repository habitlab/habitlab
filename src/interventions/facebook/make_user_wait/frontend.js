(() => {

  if (window.make_user_wait) {
    return
  }
  window.make_user_wait = true

  require('enable-webcomponents-in-content-scripts')
  require('components/interstitial-screen-polymer.deps')
  const $ = require('jquery')

  var interst_screen = $('<interstitial-screen-polymer>')
  var buttonText = 'Click to continue to Facebook'
  interst_screen.attr('btn-txt', buttonText)
  interst_screen[0].hideButton();

  var secondsLeft = intervention.params.seconds.value
  var countdown = setInterval(function() {
    var messageString = 'Facebook will be available in...' + secondsLeft;
    secondsLeft--
    interst_screen.attr('title-text', messageString)
    if (secondsLeft < 0) {
      clearInterval(countdown)
      interst_screen.attr('title-text', 'Facebook is available, if you really want to visit.')
      interst_screen[0].showButton();

    }
  }, 1000)
 
  //log_impression(intervention.name, () =>{})

  $(document.body).append(interst_screen)



})()