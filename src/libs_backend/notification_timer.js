const {
  get_num_enabled_goals
} = require ('libs_backend/goal_utils')
const {
  get_num_goals_met_today
} = require ('libs_backend/goal_progress')

const {cfy} = require('cfy');

document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function make_notification(num_met, num_goals) {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('HabitLab Goal Checkup', {
      icon: chrome.extension.getURL('icons/icon_38.png'),
      body: "You met " + num_met + " out of " + num_goals + " goal(s)."
    });
    notification.onclick = function () {
      window.open(chrome.extension.getURL('index.html?tag=goals-met-over-time'));
    };
  }
}

var prev_date = new Date();

/*
  Function: Recurring Goal Completion Check
  -----------------------------------------
  Function that repeatedly checks every minute if the time now signifies that the date has changed. If it has, make a notification on how many goals the user met the previous day.
*/
setInterval(cfy(function*() {
  var cur_date = new Date();
  if (cur_date.getDate() !== prev_date.getDate()) {
    //new day
    var num_goals_met = yield get_num_goals_met_today();
    var num_goals_total = yield get_num_enabled_goals();
    make_notification(num_goals_met, num_goals_total);
  }
  prev_date = cur_date;
}), 60000)

