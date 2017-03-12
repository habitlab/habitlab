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
  wrap_in_shadow
} = require('libs_frontend/common_libs')

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')
require('components/close-tab-button.deps')
//require('components/timespent-view.deps')

//Polymer button
require('bower_components/paper-button/paper-button.deps')

var intervalID = window.setInterval(removeComments, 200);

//Removes comments
function removeComments() {
  for (let item of $('.commentable_item')) {
    if (!$(item).prop('button_inserted')) {
      $(item).css('display','none')
      $(item).prop('button_inserted', true)

      var show_comments_button = $('<paper-button style="background-color: #415D67; color: white; width: 152 px; height: 38px; -webkit-font-smoothing: antialiased; box-shadow: 2px 2px 2px #888888;">Show Comments</paper-button>')
      show_comments_button.click(function() {
          $(item).siblings('.habitlab_button_container').remove()
          $(item).css('display','block')
      })
      var habitlab_logo = $('<habitlab-logo style="margin-left: 5px;"></habitlab-logo>')
      var close_tab_button = $('<close-tab-button style="height: 38px"</close-tab-button>')
      var button_container = $('<div style="text-align: center; display: flex; justify-content: center;"></div>')
      button_container.append([
        show_comments_button,
        close_tab_button,
        habitlab_logo
      ])
      var button_container_wrapper = $(wrap_in_shadow(button_container)).addClass('habitlab_button_container')
      $(item).parent().append(button_container_wrapper)
    }
  }
}

// showComments
function showComments() {
  clearInterval(intervalID);
  for (let item of $('.commentable_item')) {
    if ($(item).prop('button_inserted')) {
      $(item).css('display','block')
      $(this).siblings('.habitlab_button_container').remove()
    }
  }
}

window.on_intervention_disabled = () => {
  $('.habitlab_button_container').remove()
  showComments();
}

window.debugeval = x => eval(x);
