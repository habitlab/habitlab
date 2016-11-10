var {
  url_to_domain
} = require('libs_common/domain_utils')
var {
  get_goals
} = require ('libs_backend/goal_utils')
var {
  get_enabled_goals
} = require ('libs_backend/goal_utils')
var {
  get_goal_target
} = require ('libs_backend/goal_utils')
var {
  get_progress_on_goal_this_week
} = require ('libs_backend/goal_progress')
var {cfy} = require('cfy');

var moment = require('moment');
console.log(moment()._d);
moment().subtract(1, 'days');
console.log(moment()._d);

document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function make_notification(num_met, num_goals) {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('Notification title', {
      icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
      body: "You met " + num_met + " out of " + num_goals + " goal(s)."
    });
    notification.onclick = function () {
      window.open(chrome.extension.getURL('index.html?tag=goals-met-over-time'));
    };
  }
}

var sent_notif_today = false;
var prev_date = new Date();

/*
  Function: Recurring Goal Completion Check
  -----------------------------------------
  Function that repeatedly checks every minute if the time now signifies that the date has changed. If it has, make a notification on how many goals the user met the previous day.
*/
setInterval(cfy(function*() {
  console.log('checking goal completion');
  var cur_date = new Date();
  if (cur_date.getDate() != prev_date.getDate()) {
    //new day
    console.log("new day: will send notification!");
    var obj = yield goal_success_on_date(moment());
    make_notification(obj.num_met, obj.num_goals);
  }
  prev_date = cur_date;
}), 60000)


var {
  goal_success_on_date
} = require('libs_common/goal_success')

// console.log(goal_success_on_date(moment()));
