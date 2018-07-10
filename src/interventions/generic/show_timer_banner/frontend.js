console.log('extension ran')

let {
  append_to_body_shadow,
  once_body_available
} = require('libs_frontend/frontend_libs')

let $ = require('jquery')

require('components/show-timer-banner.deps.js')

let scroll_block_display = $('<show-timer-banner>');
let shadow_div;

once_body_available().then(function() {
  console.log('triggered on body available')
  console.log(scroll_block_display)
  shadow_div = append_to_body_shadow(scroll_block_display);
  console.log('appended')
  console.log('intervention shadow div:')
  console.log(shadow_div)
})

window.on_intervention_disabled = function() {
  console.log('intervention disabled')
  $(shadow_div).remove()
}

console.log('end of ntervention code')