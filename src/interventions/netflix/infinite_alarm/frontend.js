window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

if (typeof(window.wrap) != 'function') {
  window.wrap = null;
}

require('enable-webcomponents-in-content-scripts')
require('components/netflix-alarm-screen.deps')
require('components/netflix-alarm-snooze-display.deps')
const $ = require('jquery')

const {
  is_on_same_domain_and_same_tab
} = require('libs_common/session_utils')

let alarm_time = NaN

function display_snooze_display() {
  var snooze_display = $('<netflix-alarm-snooze-display>')
  snooze_display.on('snooze_set', function(data) {
    console.log('snooze_set called')
    // TODO write snooze event and set alarm
    alarm_time = data.detail.ring_time
    snooze_display.remove()
  })
  $(document.body).append(snooze_display)
}

var display_snooze_process = setInterval(function() {
  if (window.intervention_disabled) {
    return
  }
  if (Date.now() > alarm_time && $('netflix-alarm-snooze-display').length == 0) {
    display_snooze_display()
  }
}, 1000)

const main = async function() {
  //const on_same_domain_and_same_tab = await is_on_same_domain_and_same_tab(tab_id)
  //if (on_same_domain_and_same_tab) {
  //  return
  //}

  var interst_screen = $('<netflix-alarm-screen>')
  interst_screen.on('alarm_set', function(data) {
    alarm_time = data.detail.ring_time
    console.log('got alarm_set event')
    console.log(data)
    interst_screen.remove()
  })

  $(document.body).append(interst_screen)

}

main();

window.on_intervention_disabled = () => {
  clearInterval(display_snooze_process)
  $('netflix-alarm-snooze-display').remove()
  $('netflix-alarm-screen').remove()
}

window.debugeval = x => eval(x);