{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{cfy} = require 'cfy'

{  
  list_site_info_for_sites_for_which_goals_are_enabled
  list_goals_for_site
} = require 'libs_backend/goal_utils'

{
  get_interventions
  get_enabled_interventions
} = require 'libs_backend/intervention_utils'

{
  as_array
} = require 'libs_common/collection_utils'


polymer_ext {
  is: 'site-view'
  properties: {
    #site_info_list: {
    #  type: Array
    #}
    site: {
      type: String
      observer: 'site_changed'
    }
    goal_info: {
      type: Object
    }
    intervention_name_to_info_map: {
      type: Object
    }
  }
  /*
  buttonAction1: ->
    this.linedata.datasets[0].label = 'a new label'
    this.$$('#linechart').chart.update()
  */
  intervention_name_to_info: (intervention_name, intervention_name_to_info_map) ->
    return intervention_name_to_info_map[intervention_name]
  site_changed: cfy (site) ->*
    goal_info_list = yield list_goals_for_site(this.site)
    intervention_name_to_info_map = yield get_interventions()
    enabled_interventions = as_array(yield get_enabled_interventions())
    for intervention_name in enabled_interventions
      intervention_name_to_info_map[intervention_name].enabled = true
    if this.site != site
      return
    this.intervention_name_to_info_map = intervention_name_to_info_map
    this.goal_info = goal_info_list[0]
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
    'first_elem'
  ]
}