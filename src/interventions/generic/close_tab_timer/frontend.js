window.Polymer = window.Polymer || {};
window.Polymer.dom = 'shadow';

if (typeof(window.wrap) != 'function')
  window.wrap = null

const $ = require('jquery')

const {
  get_seconds_spent_on_current_domain_today,
  get_seconds_spent_on_domain_today,
} = require('libs_common/time_spent_utils')

const {
  printable_time_spent,
} = require('libs_common/time_utils')

const {
  close_selected_tab
} = require('libs_common/tab_utils')

const {
  append_to_body_shadow
} = require('libs_frontend/common_libs')

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')
require('components/time-until-tab-autoclose-view.deps')

//Polymer button
require('bower_components/paper-button/paper-button.deps')

var display_timespent_div = $('<time-until-tab-autoclose-view>');
var shadow_div = $(append_to_body_shadow(display_timespent_div));

/*
var timeLeft = 6000;
var numClicked = 0;

display_timespent_div.attr('display-text', timeLeft/100 + " seconds left. Added time " + numClicked + " times."); 
var oldclicked = $('time-until-tab-autoclose-view')[0].numClicked;


var countdownTimer = setInterval(() => {
  if (timeLeft == 0) document.querySelector('#habitlab_close_tab_button').button_clicked();
  var currclicked = $('time-until-tab-autoclose-view')[0].numClicked;
  if (currclicked && currclicked > oldclicked) {
    if (timeLeft < 6000) {
      timeLeft += 6000;
      numClicked++;
    } else {
      alert('You can only add 60 seconds more if you have less than 60 seconds left.')
    }
    oldclicked = currclicked;
  }
  timeLeft = timeLeft - 100;
  display_timespent_div.attr('display-text', timeLeft/100 + " seconds left. Added time " + numClicked + " times."); 
}, 1000);
*/

document.body.addEventListener('disable_intervention', function() {
  shadow_div.remove()
})

window.debugeval = x => eval(x);