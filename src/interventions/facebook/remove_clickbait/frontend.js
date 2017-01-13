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

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')
require('components/close-tab-button.deps')

//Polymer button
require('bower_components/paper-button/paper-button.deps')

function addNotification() {
  var textNotification = $('<span style = "font-size: 20px">HabitLab has removed clickbait  </span>')
  //var textNotification = document.createTextNode("HabitLab has removed clickbait")
  var habitlab_logo = $('<habitlab-logo style="position: relative; top: 13px"></habit-lab-logo>')
  var close_tab_button = $('<close-tab-button style="height: 40px"</close-tab-button>')
  var button_container = $('<div class="habitlab_button_container" style="text-align: center"></div>')
  button_container.append([
    textNotification,
    close_tab_button,
    habitlab_logo
  ])
  $('#pagelet_composer').parent().prepend(button_container)
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
  $('.habitlab_button_container').remove()
  removeCB = false;
});

window.debugeval = x => eval(x);
