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
var {cfy} = require('cfy');

/* Function: goal_success_on_date
  ---------------------------------
  Takes in a moment.js object, returns object num_met and num_goals.
*/
var success_count = 0;
var goal_success_on_date = cfy(function*(date) {
  var enabled_goals = yield get_enabled_goals();
  var all_goals = yield get_goals();
  // console.log("loaded data");
  // console.log(enabled_goals);
  // console.log(all_goals);
  for (var goal in enabled_goals) {
    // console.log(goal);
    var time = all_goals[goal].target.default;
    // console.log(time);
    var weekly_progress = yield get_progress_on_goal_this_week(goal, 0); // this should work
    // console.log("progress");
    // console.log(weekly_progress);
    //will need to change moment to 'date'
    if (weekly_progress[date().day()].progress < time) {
      success_count++;
      console.log("succesfully met goal: " + goal);
    }
  }
  // console.log("making goal object");
  var goal_object = {};
  var num_goals = Object.keys(enabled_goals).length;
  if (num_goals === undefined) num_goals = 0;
  goal_object.num_met = success_count;
  goal_object.num_goals = num_goals;
  console.log(goal_object);
  return goal_object;
})


module.exports = {
  goal_success_on_date: goal_success_on_date
}
