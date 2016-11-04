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
    day_num_to_success_object = []
    day_num_to_day_name = {}

    for day_num from 1 to 7
      day.subtract(1, 'days')
      success_object = yield goal_success_on_date(day)
      day_num_to_success_object[day_num - 1] = success_object
      day_num_to_day_name[day_num - 1] = day.format("dddd")

    this.day_num_to_success_object = day_num_to_success_object
    this.day_num_to_day_name = day_num_to_day_name
}
