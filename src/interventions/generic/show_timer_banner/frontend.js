let {
  append_to_body_shadow,
  once_body_available
} = require('libs_frontend/frontend_libs')

let $ = require('jquery')

require_component('show-timer-banner')

let scroll_block_display = $('<show-timer-banner>');
let shadow_div;

once_body_available().then(function() {
  shadow_div = append_to_body_shadow(scroll_block_display);
})

window.on_intervention_disabled = function() {
  $(shadow_div).remove()
}
