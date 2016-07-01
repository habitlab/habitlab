require! {
  prelude
}

{
  get_interventions
  get_enabled_interventions
  get_manually_managed_interventions
  set_intervention_enabled
  set_intervention_disabled
  set_intervention_automatically_managed
  set_intervention_manually_managed
} = require 'libs_backend/intervention_utils'

{
  get_and_set_new_enabled_interventions_for_today
} = require 'libs_backend/intervention_manager'

{
  get_enabled_goals
} = require 'libs_backend/goal_utils'

{
  as_array
} = require 'libs_common/collection_utils'

{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'options-interventions'
  properties: {
    goals_and_interventions: {
      type: Array
      value: []
      notify: true
    }
  }
  select_new_interventions: (evt) ->
    self = this
    <- get_and_set_new_enabled_interventions_for_today()
    self.rerender()
  on_goal_changed: (evt) ->
    this.rerender()
  ready: ->
    this.rerender()
  rerender: ->
    self = this
    self.goals_and_interventions = []
    intervention_name_to_info <- get_interventions()
    goal_to_interventions = {}
    for intervention_name,intervention_info of intervention_name_to_info
      for goal in intervention_info.goals
        goalname = goal.name
        if not goal_to_interventions[goalname]?
          goal_to_interventions[goalname] = []
        goal_to_interventions[goalname].push intervention_info
    list_of_goals_and_interventions = []
    enabled_interventions <- get_enabled_interventions()
    enabled_goals <- get_enabled_goals()
    list_of_goals = prelude.sort as_array(enabled_goals)
    all_goals <- get_goals()
    manually_managed_interventions <- get_manually_managed_interventions()
    for goalname in list_of_goals
      current_item = {goal: all_goals[goalname]}
      current_item.interventions = prelude.sort-by (.name), goal_to_interventions[goalname]
      for intervention in current_item.interventions
        intervention.enabled_goals = []
        #if intervention.goals?
        #  intervention.enabled_goals = [goal for goal in intervention.goals when enabled_goals[goal.name]]
        intervention.enabled = (enabled_interventions[intervention.name] == true)
        intervention.automatic = (manually_managed_interventions[intervention.name] != true)
      list_of_goals_and_interventions.push current_item
    self.goals_and_interventions = list_of_goals_and_interventions
}
