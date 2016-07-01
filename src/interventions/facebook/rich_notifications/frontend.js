(() => {

if (window.rich_notifications) {
  return
}
window.rich_notifications = true

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
    console.log(secondsSpent);
    if (shouldInsert(secondsSpent, 5 /* In minutes */)) {
      log_impression('facebook/rich_notifications')
      chrome.runtime.sendMessage({type: "chrome-notification", timeSpent: printable_time_spent(secondsSpent)}, (response) => {});
    }
  })
}

function main() {
  insertRichNotification();
}

$(document).ready(main);

})()