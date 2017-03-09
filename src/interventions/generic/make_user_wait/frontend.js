window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

if (typeof(window.wrap) != 'function')
  window.wrap = null

require('enable-webcomponents-in-content-scripts')
require('components/interstitial-screen.deps')
const $ = require('jquery')

const {
  log_impression,
  log_action,
} = require('libs_common/log_utils')

const {
  append_to_body_shadow
} = require('libs_frontend/common_libs')

const {
  is_on_same_domain_and_same_tab
} = require('libs_common/session_utils')

const co = require('co')

co(function*() {
  //const on_same_domain_and_same_tab = yield is_on_same_domain_and_same_tab(tab_id)
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
      interst_screen.attr('title-text', intervention.sitename_printable + ' is available, if you really want to visit.')
      interst_screen[0].showButton();
    }
  }, 50)

  var shadow_div = $(append_to_body_shadow(interst_screen))

  document.body.addEventListener('disable_intervention', () => {
    shadow_div.remove();
  });

})

window.debugeval = x => eval(x);
