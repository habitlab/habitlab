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
  if (!commentsShown) {
    for (const item of $('.commentable_item')) {
      var original_height = $(item).css('height')
      if (original_height != null && original_height != undefined && original_height != '0px') {
        if ($(item).prop('button_inserted') != true) {
          $(item).css('opacity', 0)
          $(item).css('pointer-events', 'none')
          $(item).prop('original_height', $(item).css('height'))
          $(item).css('height', '0px')
          $(item).prop('button_inserted', true)
          var show_comments_button = $('<paper-button style="background-color: green; color: white; height: 40px">Show Comments</paper-button>')
          var habitlab_logo = $('<habitlab-logo style="position: relative; top: 13px"></habit-lab-logo>')
          show_comments_button.click(function() {
            $(item).css('height', $(item).prop('original_height'))
            $(item).css('opacity', 1)
            $(item).css('pointer-events', 'all')
            $(this).siblings('habitlab-logo').remove()
            $(this).siblings('close-tab-button').remove()
            $(this).siblings('paper-button').remove()
          })
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
  }
}

function showComments() {
  if (commentsShown) {
    for (const item of $('.commentable_item')) {
      if ($(item).prop('button_inserted') == true) {
        $(item).prop('button_inserted', false)
        var curr_height = $(item).css('height')
        var stored_height = $(item).prop('original_height')
        if (curr_height != stored_height) {
          $(item).css('height', $(item).prop('original_height'))
          $(item).css('opacity', 1)
          $(item).css('pointer-events', 'all')
        }
        $(this).siblings('habitlab_logo').remove()
        $(this).siblings('close-tab-button').remove()
        $(this).siblings('paper-button').remove()
      }
    }
  }
  clearInterval(intervalID)
}

var commentsShown = false;
var intervalID = window.setInterval(removeComments, 200);
window.intervalID = intervalID;
document.body.addEventListener('disable_intervention', (intervalID) => {
  $('.habitlab_button_container').remove()
  commentsShown = true;
  showComments();
});
