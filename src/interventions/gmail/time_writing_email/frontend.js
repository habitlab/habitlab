const $ = require('jquery')

const {
  get_seconds_spent_on_current_domain_today,
  get_seconds_spent_on_domain_today,
} = require('libs_common/time_spent_utils')

const {
  printable_time_spent,
} = require('libs_common/time_utils')

function shouldInsert(secondsSpent, timeInterval) {
  if (secondsSpent < timeInterval * 60) {
    return false; // only show after a minute
  }
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
    //if (shouldInsert(secondsSpent, intervention.params.minutes.value)) {
      chrome.runtime.sendMessage({type: "chrome-notification-gmail-composing", timeSpent: printable_time_spent(secondsSpent)}, (response) => {});
    //}
  })
}

function insert_composing_time_notification(secondsSpent) {
  chrome.runtime.sendMessage({type: "chrome-notification-gmail-composing", timeSpent: printable_time_spent(secondsSpent)}, (response) => {});
}

/*
var seconds_spent_composing_email = 0;
setInterval(function() {
  if (window.location.href.includes('?compose=new')) {
    ++seconds_spent_composing_email;
    console.log(seconds_spent_composing_email);
    if (shouldInsert(seconds_spent_composing_email, intervention.params.minutes.value)) {
      console.log('displaying notification');
      insert_composing_time_notification(seconds_spent_composing_email);
    }
  }
}, 1000);
*/

setInterval(function() {
  var compose_window = $('.nH.Hd');
  if (window.location.href.includes('?compose=new')) {
    var seconds_spent_composing_email = compose_window.data('time_open');
    if (seconds_spent_composing_email == null) {
      seconds_spent_composing_email = 0;
      compose_window.data('time_open', 0);
    }
    ++seconds_spent_composing_email;
    $('.nH.Hd').data('time_open', seconds_spent_composing_email);
    if (shouldInsert(seconds_spent_composing_email, intervention.params.minutes.value)) {
      console.log('displaying notification');
      insert_composing_time_notification(seconds_spent_composing_email);
    }
  }
}, 1000)

function addComposeButtonListener() {
  var compose_button=$('.T-I.J-J5-Ji.T-I-KE.L3');
  compose_button.click(function() {
    alert('foobar')
  })
}

function main() {
  insertRichNotification();
  addComposeButtonListener();
}

//$(document).ready(main);

window.debugeval = x => eval(x);
