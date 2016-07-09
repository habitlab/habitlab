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
  var titleString = 'You are trying to go to Facebook.'
  interst_screen.attr('title-text', titleString)
  var secondsLeft = 10
  var messageString = 'Facebook will be available in...' + secondsLeft;
  interst_screen.attr('message-text', messageString)
  //log_impression(window.intervention.name, () =>{})

  $(document.body).append(interst_screen)



})()