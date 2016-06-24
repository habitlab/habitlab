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
  chrome.runtime.sendMessage({type: "chrome-notification", timeSpent: "30"}, (response) => {});
}

function main() {
  insertRichNotification();
}

$(document).ready(main);

})()