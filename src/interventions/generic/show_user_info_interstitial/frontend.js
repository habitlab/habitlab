window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

if (typeof(window.wrap) != 'function')
  window.wrap = null

require('enable-webcomponents-in-content-scripts')

const $ = require('jquery')
require('components/interstitial-screen-num-visits.deps')
const {
  get_minutes_spent_on_domain_today,
  get_visits_to_domain_today
} = require('libs_common/time_spent_utils')

const {
  append_to_body_shadow
} = require('libs_frontend/common_libs')

const co = require('co')

const {
  log_impression,
} = require('libs_frontend/intervention_log_utils')

const {
  url_to_domain
} = require('libs_common/domain_utils')

const {
  get_intervention
} = require('libs_common/intervention_info');

var shadow_div;

co(function*() {
  var domain = url_to_domain(window.location.href)
  var numMins = yield get_minutes_spent_on_domain_today(domain)
  var numVisits = yield get_visits_to_domain_today(domain)
  var titleString = 'You have visited ' + url_to_domain(window.location.href) +' ' + numVisits + ' times and spent '+ numMins + ' minutes there today.'
  var sitename_printable = get_intervention().sitename_printable
  var buttonText = `Click to continue to ${sitename_printable}`
  var buttonText2 = `Close ${sitename_printable}`

  var interst_screen = $('<interstitial-screen-num-visits class="interst_screen">')
  interst_screen.attr('intervention', intervention.name)
  interst_screen.attr('btn-txt', buttonText)
  interst_screen.attr('btn-txt2', buttonText2)
  interst_screen.attr('title-text', titleString)
  interst_screen.attr('minutes', numMins);
  interst_screen.attr('visits', numVisits);
  interst_screen.attr('seconds', 0);
  log_impression()

  shadow_div = $(append_to_body_shadow(interst_screen));
})

document.body.addEventListener('disable_intervention', () => {
  shadow_div.remove();
});

window.debugeval = x => eval(x);
