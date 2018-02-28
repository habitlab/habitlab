const {
  get_num_enabled_goals
} = require ('libs_backend/goal_utils')
const {
  get_num_goals_met_yesterday
} = require ('libs_backend/goal_progress')

document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function make_notification(num_met, num_goals) {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('HabitLab Goal Checkup', {
      icon: chrome.extension.getURL('icons/icon_128.png'),
      body: "You met " + num_met + " out of " + num_goals + " goal(s)."
    });
    notification.onclick = function () {
      chrome.tabs.create({url: chrome.extension.getURL('index.html?tag=goals-met-over-time')});
    };
  }
}

var prev_date = new Date();

/*
  Function: Recurring Goal Completion Check
  -----------------------------------------
  Function that repeatedly checks every minute if the time now signifies that the date has changed. If it has, make a notification on how many goals the user met the previous day.
*/
setInterval(async function() {
  var cur_date = new Date();
  if (cur_date.getDate() !== prev_date.getDate()) {
    //new day
    if (localStorage.getItem('allow_daily_goal_notifications') == 'false') {
      return
    }
    var num_goals_total = await get_num_enabled_goals();
    var num_goals_met = await get_num_goals_met_yesterday();
    make_notification(num_goals_met, num_goals_total);
  }
  prev_date = cur_date;
}, 60000)

