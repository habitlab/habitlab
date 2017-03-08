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
  close_selected_tab
} = require('libs_common/tab_utils')

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')
require('components/time-until-tab-autoclose-view.deps')

//Polymer button
require('bower_components/paper-button/paper-button.deps')

var display_timespent_div = $('<time-until-tab-autoclose-view>');
$('body').append(display_timespent_div);

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

document.body.addEventListener('time_has_run_out', function() {
  document.querySelector('#habitlab_close_tab_button').button_clicked();
})

document.body.addEventListener('disable_intervention', function() {
  display_timespent_div.remove()
})

window.debugeval = x => eval(x);