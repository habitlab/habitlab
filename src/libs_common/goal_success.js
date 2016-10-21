/* require in the necessary functions */
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

var moment = require('moment');
$ = require('jquery');
var {cfy} = require('cfy');


function sleep(miliseconds) {
  var currentTime = new Date().getTime();
  while (currentTime + miliseconds >= new Date().getTime()) {
  }
}
console.log(moment().day());

/* Function: goal_success_on_date
  ---------------------------------
  Takes in a moment.js object, returns object num_met and num_goals.
*/
var success_count = 0;
var goal_success_on_date = function(date) {

  // var test = cfy(function*() {
  //   var x = yield get_enabled_goals(); // this should work
  //   return x;
  // });
  // console.log(x);

  var enabled_goals = cfy(function*() {
    enabled_goals = yield get_enabled_goals(); // this should work
    console.log(enabled_goals);
  })();
  var all_goals = cfy(function*() {
    all_goals = yield get_goals(); // this should work
    console.log(all_goals);
    //further code
    for (var goal in enabled_goals) {
      console.log(goal);
      var time = all_goals[goal].target.default;
      console.log(time);
      //new asynch PoD level
      var weekly_progress = cfy(function*() {
        weekly_progress = yield get_progress_on_goal_this_week(goal, 0); // this should work
        console.log(weekly_progress);
        //will need to change moment to 'date'
        if (weekly_progress[moment().day()].progress > time) success_count++;
      })();
    }
  })();
  console.log("making goal object");
  var goal_object = {};
  var num_goals = all_goals.length;
  if (num_goals === undefined) num_goals = 0;
  goal_object.num_met = success_count;
  goal_object.num_goals = num_goals;
  return goal_object;
}

module.exports = {
  goal_success_on_date: goal_success_on_date
}
