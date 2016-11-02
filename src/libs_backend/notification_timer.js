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


// MM/DD/YYYY

var moment = require('moment');
console.log(moment()._d);
moment().subtract(1, 'days');
console.log(moment()._d);

/*

Write function for Brahm:

  Give date/moment object
  Return object with

*/

//var given_date_return_goal_completion() {
//}



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
      body: "You met " + num_met + " out of " + num_goals + "goals"
    });
    notification.onclick = function () {
      window.open("http://habitlab.stanford.edu/");
    };
  }
}

/*
  TODO:
  -----
  - Function that is called once every day at midnight/when chrome is opened for the first time_utils
  - Have a marker that resets to true
  - Check if midnight
  - if past midnight, check if notif has been sent today already
*/

var sent_notif_today = false;
var prev_mom = require('moment');
setInterval(function() {
  console.log('hello')
  // console.log(url_to_domain('http://facebook.com'))
  var cur_mom = require('moment');
  if (cur_mom.format('dddd') != prev_mom.format('dddd')) {
    //new day
    var obj = goal_success_on_date(moment());
    make_notification(obj.num_met, obj.num_goals);
  }
  prev_mom = cur_mom;
}, 60000)


var {
  goal_success_on_date
} = require('libs_common/goal_success')

console.log("hello");
console.log(goal_success_on_date(moment()));
