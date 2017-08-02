window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'
if (typeof(window.wrap) != 'function') {
  window.wrap = null
}

let {
  append_to_body_shadow
} = require('libs_frontend/common_libs')

let $ = require('jquery')

require('enable-webcomponents-in-content-scripts')

require('components/show-timer-banner.deps')

let scroll_block_display = $('<show-timer-banner>');
let shadow_div = append_to_body_shadow(scroll_block_display);

window.on_intervention_disabled = function() {
  $(shadow_div).remove()
}

window.debugeval = x => eval(x)
