{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{
  get_enabled_goals
  get_goals
  get_goal_target
} = require 'libs_backend/goal_utils'

{
  goal_success_on_date
} = require 'libs_common/goal_success'

{cfy} = require 'cfy'

require! {
  async
}

require! {
  prelude
  moment
}

$ = require 'jquery'

polymer_ext {
  is: 'goals-met-over-time'
  properties: {
  }
  ready: cfy ->*
    self = this
    last_week = {} /* success rates for the last week */
    today = moment().startOf('date')
    for day_num from 1 to 7
      day = today.subtract(1, 'days')
      success_object = yield goal_success_on_date(day)
      last_week[day.format("dddd")] = success_object

    # Now we add it to the visualization

    for day, success of last_week
      msg = "On <b>" + day + "</b>, you met " + success.num_met + " of your " + success.num_goals + " goals."
      liststring = "<li>" + msg + "</li>"
      $ \#goals .append liststring
}
