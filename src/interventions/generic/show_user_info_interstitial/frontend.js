const $ = require('jquery')
require_component('interstitial-screen-num-visits')
const {
  get_minutes_spent_on_domain_today,
  get_visits_to_domain_today
} = require('libs_common/time_spent_utils')

const {
  get_is_new_session
} = require('libs_common/intervention_info')

const {
  append_to_body_shadow,
  once_body_available
} = require('libs_frontend/frontend_libs')

const {
  url_to_domain
} = require('libs_common/domain_utils')

const {
  get_intervention
} = require('libs_common/intervention_info');

var shadow_div;

(async function() {
  const is_new_session = get_is_new_session();
  if (!is_new_session) {
    return;
  }
  var domain = url_to_domain(window.location.href)
  var numMins = await get_minutes_spent_on_domain_today(domain)
  var numVisits = await get_visits_to_domain_today(domain)
  var sitename_printable = get_intervention().sitename_printable
  var buttonText = `Click to continue to ${sitename_printable}`
  var buttonText2 = `Close ${sitename_printable}`

  var interst_screen = $('<interstitial-screen-num-visits class="interst_screen">')
  interst_screen.attr('sitename-printable', sitename_printable)
  interst_screen.attr('intervention', intervention.name)
  interst_screen.attr('btn-txt', buttonText)
  interst_screen.attr('btn-txt2', buttonText2)
  interst_screen.attr('minutes', numMins);
  interst_screen.attr('visits', numVisits);
  interst_screen.attr('seconds', 0);

  await once_body_available();
  shadow_div = append_to_body_shadow(interst_screen);
})();

window.on_intervention_disabled = () => {
  $(shadow_div).remove();
}
