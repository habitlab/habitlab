window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

const $ = require('jquery')

const {
  get_seconds_spent_on_current_domain_today,
  get_seconds_spent_on_domain_today,
} = require('libs_common/time_spent_utils')

const {
  printable_time_spent,
} = require('libs_common/time_utils')

const {
  log_impression,
  log_action,
} = require('libs_common/log_utils')

const {
  wrap_in_shadow
} = require('libs_frontend/common_libs')

require('enable-webcomponents-in-content-scripts')
require('components/removed-clickbait-message.deps')

function addNotification() {
  var removed_clickbait_message = $('<removed-clickbait-message></removed-clickbait-message>')
  var removed_clickbait_message_wrapper = $(wrap_in_shadow(removed_clickbait_message)).attr('id', 'removed_clickbait_message')
  $('#pagelet_composer').parent().prepend(removed_clickbait_message_wrapper)
}

function removeClickBait() {
  if (removeCB) {
    for (let item of $('._5g-l')) {
      var suggestedPost = $(item).closest('div[class^="_5jmm _5pat _3lb4 w_dqmgvr46j _x72"]')
      suggestedPost.remove()
    }
    for (let item of $('.uiStreamSponsoredLink')) {
      var sponsored = $(item).closest('div[class^="_5jmm _5pat _3lb4 w_dqmgvr46j _x72"]')
      sponsored.remove()
    }
  }
}

var removeCB = true;
window.onload = () => {
  removeCB = true;
  addNotification();
}
var intervalID = window.setInterval(removeClickBait, 100);
window.intervalID = intervalID;
document.body.addEventListener('disable_intervention', (intervalID) => {
  $('#removed_clickbait_message').remove()
  removeCB = false;
});

window.debugeval = x => eval(x);
