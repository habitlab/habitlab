window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

if (typeof(window.wrap) != 'function')
  window.wrap = null

require('enable-webcomponents-in-content-scripts')

const $ = require('jquery')
require('components/positive-site-trigger.deps')

const {
  append_to_body_shadow
} = require('libs_frontend/common_libs')

const {
  url_to_domain
} = require

const {
  get_intervention
} = require('libs_common/intervention_info');

var shadow_div;

(async function() {
  var domain = url_to_domain(window.location.href)
  var sitename_printable = get_intervention().sitename_printable
  var buttonText = `Click to continue to ${sitename_printable}`
  var interst_screen = $('positive-site-trigger>')
  interst_screen.attr('sitename-printable', sitename_printable)
  shadow_div = append_to_body_shadow(interst_screen)
})

window.on_intervention_disabled = () => {
  $(shadow_div).remove()
}

window.debugeval = x => eval(x);