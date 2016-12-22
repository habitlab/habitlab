{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{
  get_num_enabled_goals
} = require 'libs_backend/goal_utils'

{
  get_num_goals_met_this_week
} = require 'libs_backend/goal_progress'

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
    day_num_to_success_object: {
      type: Array
    }
    day_num_to_day_name: {
      type: Object
    }
  }

  get_day_name: (day_num) ->
    return this.day_num_to_day_name[day_num]
  is_first_day: (day_num) ->
    return day_num == 0

  ready: cfy ->*
    self = this
    day = moment().startOf('date')
    day_num_to_day_name = {}
    day_num_to_num_goals_met = yield get_num_goals_met_this_week()
    num_enabled_goals = yield get_num_enabled_goals()

    for day_num from 0 to 6
      day_num_to_day_name[day_num] = day.format("dddd")
      day.subtract(1, 'days')

    this.day_num_to_success_object = [{num_met: x, num_goals: num_enabled_goals} for x in day_num_to_num_goals_met]
    this.day_num_to_day_name = day_num_to_day_name
}
