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

/* main function of API */
var goal_success_on_date = function(date) {
  var enabled_goals = get_enabled_goals();
  var all_goals = get_goals();

  console.log(enabled_goals);
  console.log(all_goals);

  //needs to be async, as it depends on the succesfully fulfilled promise of get_enabled_goals, maybe pass in a callback to get_enabled_goals
  for (var goal in enabled_goals) {
    //lookup each enabled goal
    console.log('here');
    if (enabled_goals.hasOwnProperty(goal)) {
        console.log('here2');
        console.log(goal);
    }
  }


  // console.log(ret3);
  console.log("jello");
  var goal_object = {};
  goal_object.num_met = 4;
  goal_object.num_goals = 7;
  return goal_object;
}

module.exports = {
  goal_success_on_date: goal_success_on_date
}
