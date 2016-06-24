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


function shouldInsert(secondsSpent, timeInterval) {
  console.log("in shouldInsert method");

  const newestInterval = Math.floor(Math.floor(secondsSpent/60) / timeInterval)
  console.log(secondsSpent)
  console.log(newestInterval)  


  if (!localStorage.hasOwnProperty("currInterval")) {
    localStorage.currInterval = newestInterval
    return true
  } else { //property already exists in storage
    //A new day
    if (newestInterval < parseInt(localStorage.currInterval, 10)) {  
      localStorage.currInterval = newestInterval
      return true
    } else if (newestInterval === parseInt(localStorage.currInterval, 10)) {
      console.log("Not inserting notification")
      return false
    } else { //newestInterval > localStorage.currInterval
      localStorage.currInterval = newestInterval;
      return true
    }
  }
}

function insertRichNotification() {
  console.log("Inserting rich notification!");
  
  get_seconds_spent_on_current_domain_today(function(secondsSpent) {
    console.log(secondsSpent);
    if (shouldInsert(secondsSpent, 10)) {
      chrome.runtime.sendMessage({type: "chrome-notification", timeSpent: printable_time_spent(secondsSpent)}, (response) => {});
    }
  })
}

function main() {
  insertRichNotification();
}

$(document).ready(main);

})()