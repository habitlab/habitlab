let {
  append_to_body_shadow,
  once_body_available
} = require('libs_frontend/frontend_libs')

let $ = require('jquery')

require_component('plan-police')

let plan_police_display = $('<plan-police>');
let shadow_div;

once_body_available().then(function() {
  shadow_div = append_to_body_shadow(plan_police_display);
})

window.on_intervention_disabled = function() {
  $(shadow_div).remove()
}