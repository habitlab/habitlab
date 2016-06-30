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
  get_enabled_goals
} = require 'libs_backend/goal_utils'

{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'options-interventions'
  properties: {
    sites_and_interventions: {
      type: Array
      value: []
      notify: true
    }
  }
  on_goal_changed: (evt) ->
    this.rerender()
  intervention_changed: (evt) ->
    checked = evt.target.checked
    intervention_name = evt.target.intervention.name
    if checked
      set_intervention_enabled intervention_name
    else
      set_intervention_disabled intervention_name
  automatically_managed_changed: (evt) ->
    checked = evt.target.checked
    intervention_name = evt.target.intervention.name
    if checked
      set_intervention_automatically_managed intervention_name
    else
      set_intervention_manually_managed intervention_name
  ready: ->
    this.rerender()
  rerender: ->
    self = this
    self.sites_and_interventions = []
    intervention_name_to_info <- get_interventions()
    sitename_to_interventions = {}
    for intervention_name,intervention_info of intervention_name_to_info
      sitename = intervention_info.sitename
      if not sitename_to_interventions[sitename]?
        sitename_to_interventions[sitename] = []
      sitename_to_interventions[sitename].push intervention_info
    list_of_sites_and_interventions = []
    list_of_sites = prelude.sort Object.keys(sitename_to_interventions)
    enabled_interventions <- get_enabled_interventions()
    enabled_goals <- get_enabled_goals()
    manually_managed_interventions <- get_manually_managed_interventions()
    for sitename in list_of_sites
      current_item = {sitename: sitename}
      current_item.interventions = prelude.sort-by (.name), sitename_to_interventions[sitename]
      for intervention in current_item.interventions
        intervention.enabled_goals = []
        if intervention.goals?
          intervention.enabled_goals = [goal for goal in intervention.goals when enabled_goals[goal.name]]
        intervention.enabled = (enabled_interventions[intervention.name] == true)
        intervention.automatic = (manually_managed_interventions[intervention.name] != true)
      list_of_sites_and_interventions.push current_item
    self.sites_and_interventions = list_of_sites_and_interventions
}
