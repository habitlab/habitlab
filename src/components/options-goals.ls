prelude = require 'prelude-ls'

{
  getGoalInfo
  get_goals
  get_enabled_goals
  set_goal_enabled_manual
  set_goal_disabled_manual
} = require 'libs_backend/goal_utils'

{cfy} = require 'cfy'

{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'options-goals'
  properties: {
    sites_and_goals: {
      type: Array
      value: []
    }
  }
  goal_changed: cfy (evt) ->*
    checked = evt.target.checked
    goal_name = evt.target.goal.name
    self = this
    if checked
      yield set_goal_enabled_manual goal_name
    else
      yield set_goal_disabled_manual goal_name
    console.log 'goal changed'
    self.fire 'goal_changed', {goal_name: goal_name}
  ready: ->
    self = this
    goal_name_to_info <- get_goals()
    sitename_to_goals = {}
    for goal_name,goal_info of goal_name_to_info
      sitename = goal_info.sitename
      if not sitename_to_goals[sitename]?
        sitename_to_goals[sitename] = []
      sitename_to_goals[sitename].push goal_info
    list_of_sites_and_goals = []
    list_of_sites = prelude.sort Object.keys(sitename_to_goals)
    enabled_goals <- get_enabled_goals()
    for sitename in list_of_sites
      current_item = {sitename: sitename}
      current_item.goals = prelude.sort-by (.name), sitename_to_goals[sitename]
      for goal in current_item.goals
        goal.enabled = (enabled_goals[goal.name] == true)
      list_of_sites_and_goals.push current_item
    self.sites_and_goals = list_of_sites_and_goals
}
