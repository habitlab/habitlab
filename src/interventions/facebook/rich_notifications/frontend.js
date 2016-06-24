(() => {

if (window.rich_notifications) {
  return
}
window.rich_notifications = true

const $ = require('jquery')

/*
const {
  get_seconds_spent_on_current_domain_today,
  get_seconds_spent_on_domain_today,
} = require('libs_common/time_spent_utils')

const {
  printable_time_spent,
} = require('libs_common/time_utils')
*/

function insertRichNotification() {
  console.log("Inserting rich notification!");
  //code to send message to open notification. This will eventually move into my extension logic

  chrome.runtime.sendMessage({type: "chrome-notification"}, (response) => {});
  /*
  chrome.runtime.sendMessage({type: "chrome-notification", options: { 
      type: "basic", 
      title: "Stop going on facebook!",
      message: "Really.",
      iconUrl: chrome.extension.getURL("interventions/facebook/rich_notifications/rich_notif_icon.png")
  }});
  */
}

function main() {
  insertRichNotification();
}

$(document).ready(main);

})()