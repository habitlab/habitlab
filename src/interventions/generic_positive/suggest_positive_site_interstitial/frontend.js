window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

if (typeof(window.wrap) != 'function')
  window.wrap = null

const $ = require('jquery')
require_component('interstitial-screen-positive-trigger')

const {
  append_to_body_shadow,
  once_body_available  
} = require('libs_frontend/frontend_libs')

const {
  get_intervention
} = require('libs_common/intervention_info');

const {
  url_to_domain
} = require('libs_common/domain_utils')

var shadow_div;

var domain = url_to_domain(window.location.href)
var sitename_printable = get_intervention().sitename_printable
var buttonText = `Click to continue to ${sitename_printable}`
var interst_screen = $('<interstitial-screen-positive-trigger>')
interst_screen.attr('sitename-printable', sitename_printable)
interst_screen.attr('continue-button-text', buttonText)
once_body_available().then(function() {
  shadow_div = append_to_body_shadow(interst_screen);
})

window.on_intervention_disabled = () => {
  $(shadow_div).remove()
}

window.debugeval = x => eval(x);