const {
  get_seconds_spent_on_current_domain_today,
  get_seconds_spent_on_domain_today,
} = require('libs_common/time_spent_utils')

const {
  printable_time_spent,
} = require('libs_common/time_utils')

const {
  display_reward_and_close_current_tab
} = require('libs_frontend/intervention_close_tab')

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

function shouldInsert(secondsSpent, timeInterval) {
  const newestInterval = Math.floor(Math.floor(secondsSpent/60) / timeInterval)

  if (!localStorage.hasOwnProperty("currInterval")) {
    localStorage.currInterval = newestInterval
    return true
  } else { //property already exists in storage
    //A new day
    if (newestInterval < parseInt(localStorage.currInterval, 10)) {  
      localStorage.currInterval = newestInterval
      return true
    } else if (newestInterval === parseInt(localStorage.currInterval, 10)) {
      return false
    } else { //newestInterval > localStorage.currInterval
      localStorage.currInterval = newestInterval;
      return true
    }
  }
}

function insertRichNotification() {  
  get_seconds_spent_on_current_domain_today(function(secondsSpent) {
    var timeSpent = printable_time_spent(secondsSpent)
    var notification = new Notification('HabitLab', {
      icon: chrome.extension.getURL('icons/icon_128.png'),
      body: "You've spent " + timeSpent + " on Facebook today."
    })
    var close_notification = notification.close.bind(notification);
    notification.onclick = function() {
      log_action({'positive': 'User closed Facebook.'})
      close_notification();
      display_reward_and_close_current_tab();
    }
    //console.log(secondsSpent);
    //if (shouldInsert(secondsSpent, intervention.params.minutes.value)) {
    //  chrome.runtime.sendMessage({type: "chrome-notification-facebook-timespent", timeSpent: printable_time_spent(secondsSpent)}, (response) => {});
    //}
  })
}

function main() {
  insertRichNotification();
}

main()

window.debugeval = x => eval(x);
