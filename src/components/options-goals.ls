{
  getGoalInfo
  get_goals
  get_enabled_goals
  set_goal_enabled
  set_goal_disabled
} = require 'libs_backend/goal_utils'


{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'options-goals'
}
