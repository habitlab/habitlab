{polymer_ext} = require 'libs_frontend/polymer_utils'

$ = require 'jquery'

{
  get_work_pages_visited_today
} = require 'libs_common/history_utils'

{
  url_to_domain
} = require 'libs_common/domain_utils'

{
  cfy
} = require 'cfy'

{
  as_array
} = require 'libs_common/collection_utils'

{
  list_goal_info_for_enabled_goals
  get_all_goal_targets
} = require 'libs_common/goal_utils'

{
  get_progress_on_enabled_goals_this_week
} = require 'libs_common/goal_progress'

polymer_ext {
  is: 'goal-progress-message'
  properties: {
    links: {
      type: Array
    }
    goal_info_list: {
      type: Array
    }
    goal_name_to_target: {
      type: Object
    }
    goal_name_to_progress_this_week: {
      type: Object
    }
    goal_name_to_units: {
      type: Object
      computed: 'compute_goal_name_to_units(goal_name_to_progress_this_week)'
    }
  }
  get_goal_target: (goal_name, goal_name_to_target) ->
    return goal_name_to_target[goal_name]
  get_goal_progress_on_day: (goal_name, days_ago, goal_name_to_progress_this_week) ->
    return goal_name_to_progress_this_week[goal_name][days_ago].progress
  get_goal_units: (goal_name, goal_name_to_units) ->
    return goal_name_to_units[goal_name]
  compute_goal_name_to_units: (goal_name_to_progress_this_week) ->
    output = {}
    for goal_name,progress_this_week of goal_name_to_progress_this_week
      output[goal_name] = progress_this_week[0].units
    return output
  ready: ->>
    this.goal_info_list = await list_goal_info_for_enabled_goals()
    this.goal_name_to_target = await get_all_goal_targets()
    this.goal_name_to_progress_this_week = await get_progress_on_enabled_goals_this_week()
}
