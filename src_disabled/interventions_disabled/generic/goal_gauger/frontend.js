let {
  append_to_body_shadow,
  once_body_available
} = require('libs_frontend/frontend_libs')

let $ = require('jquery')

require_component('goal-gauger')

let goal_gauger_display = $('<goal-gauger>');
let shadow_div;

once_body_available().then(function() {
  shadow_div = append_to_body_shadow(goal_gauger_display);
})

window.on_intervention_disabled = function() {
  $(shadow_div).remove()
}