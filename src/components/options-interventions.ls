require! {
  prelude
}

{
  get_interventions
  get_enabled_interventions
  set_intervention_enabled
  set_intervention_disabled
} = require 'libs_backend/intervention_utils'

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
  intervention_changed: (evt) ->
    checked = evt.target.checked
    intervention_name = evt.target.intervention.name
    if checked
      set_intervention_enabled intervention_name
    else
      set_intervention_disabled intervention_name
  ready: ->
    self = this
    intervention_name_to_info <- get_interventions()
    sitename_to_interventions = {}
    for intervention_name,intervention_info of intervention_name_to_info
      sitename = intervention_name.split('/')[0]
      if not sitename_to_interventions[sitename]?
        sitename_to_interventions[sitename] = []
      sitename_to_interventions[sitename].push intervention_info
    list_of_sites_and_interventions = []
    list_of_sites = prelude.sort Object.keys(sitename_to_interventions)
    enabled_interventions = get_enabled_interventions()
    for sitename in list_of_sites
      current_item = {sitename: sitename}
      current_item.interventions = prelude.sort-by (.name), sitename_to_interventions[sitename]
      for intervention in current_item.interventions
        intervention.enabled = enabled_interventions[intervention.name]?
      list_of_sites_and_interventions.push current_item
    self.sites_and_interventions = list_of_sites_and_interventions
}
