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
  Return object with '3/7' in that format, will be parsed by Brahm

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


setInterval(function() {
  // console.log('hello')
  //console.log(url_to_domain('http://facebook.com'))
}, 1000)


var {
  goal_success_on_date
} = require('libs_common/goal_success')

console.log(goal_success_on_date(moment()));
