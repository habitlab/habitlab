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

//Removes comments
function removeComments() {
  if (!commentsShown) {
      $('.UFIContainer').css('opacity', 0);
  } else {
    $('.UFIContainer').css('opacity', 1);
  }
}

//Shows comments
function showComments() {
  $('#habitlab_show_comments_div').remove()
  commentsShown = true;
}

//Attaches habitlab button and show comments button
function attachButtons() {
  log_impression(intervention.name)
  var habitlab_logo = $('<habitlab-logo intervention="facebook/remove_comments" style="text-align: center; margin: 0 auto; position: relative"></habitlab-logo>')
  var centerDiv = $('<center id=centerdiv></center>')
  var cheatButton = $('<paper-button style="text-align: center; margin: 0 auto; position: relative; background-color: red; color: white" raised>Show Comments</paper-button>')
  cheatButton.click(function(evt) {
    log_action(intervention.name, {'negative': 'Remained on Facebook.'})
    showComments(intervalID);
  })
  var closeButton = $('<close-tab-button text="Close Facebook">')
  centerDiv.insertAfter($('#pagelet_composer'))

  var habitlab_show_comments_div = $('<div>')
  .attr('id', 'habitlab_show_comments_div')
  .append([
    closeButton,
    '<br><br>',
    cheatButton,
    '<br><br>',
    habitlab_logo
  ])
  centerDiv.append(habitlab_show_comments_div)
}

attachButtons();
var commentsShown = false;
setInterval(() => {
  removeComments();
}, 100)
var intervalID = window.setInterval(removeComments, 200);
window.intervalID = intervalID;
document.body.addEventListener('disable_intervention', (intervalID) => {
  showComments(intervalID);
  $('.timespent-view').remove();
});
