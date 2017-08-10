const $ = require('jquery')

removeClickBait()
var intervalID = window.setInterval(removeClickBait, 100);

function removeClickBait() {
  if (!window.intervention_disabled) {
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

const {
  wrap_in_shadow,
  once_available
} = require('libs_frontend/common_libs')

require_component('removed-clickbait-message')

function addNotification() {
  var removed_clickbait_message = $('<removed-clickbait-message></removed-clickbait-message>')
  var removed_clickbait_message_wrapper = $(wrap_in_shadow(removed_clickbait_message)).attr('id', 'removed_clickbait_message')
  once_available('#pagelet_composer').then(function() {
    $('#pagelet_composer').parent().prepend(removed_clickbait_message_wrapper)
  })
}

addNotification();

window.on_intervention_disabled = () => {
  clearInterval(intervalID)
  $('#removed_clickbait_message').remove()
}
