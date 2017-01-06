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
//require('components/timespent-view.deps')

//Polymer button
require('bower_components/paper-button/paper-button.deps')

//Removes comments
function removeComments() {
  for (const item of $('.commentable_item')) {
    if (!$(item).prop('button_inserted')) {
      $(item).css('display','none')
      $(item).prop('button_inserted', true)

      var show_comments_button = $('<paper-button style="background-color: green; color: white; height: 40px">Show Comments</paper-button>')
      show_comments_button.click(function() {
          $(item).siblings('.habitlab_button_container').remove()
          $(item).css('display','block')
      })
      var habitlab_logo = $('<habitlab-logo style="position: relative; top: 13px"></habit-lab-logo>')
      var close_tab_button = $('<close-tab-button style="height: 40px"</close-tab-button>')
      var button_container = $('<div class="habitlab_button_container" style="text-align: center"></div>')
      button_container.append([
        show_comments_button,
        close_tab_button,
        habitlab_logo
      ])

      $(item).parent().append(button_container)
    }
  }
}

// showComments
function showComments() {
  for (const item of $('.commentable_item')) {
    if ($(item).prop('button_inserted')) {
      $(item).css('display','block')
      $(this).siblings('.habitlab_button_container').remove()
    }
  }
  clearInterval(intervalID);
}

var intervalID = window.setInterval(removeComments, 200);
window.intervalID = intervalID;

document.body.addEventListener('disable_intervention', (intervalID) => {
  $('.habitlab_button_container').remove()
  showComments();
});
