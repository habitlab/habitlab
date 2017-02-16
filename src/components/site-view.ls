{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{cfy} = require 'cfy'

{  
  list_site_info_for_sites_for_which_goals_are_enabled
  list_goals_for_site
} = require 'libs_backend/goal_utils'

polymer_ext {
  is: 'site-view'
  properties: {
    site_info_list: {
      type: Array
    }
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
    return this.intervention_name_to_info_map[intervention_name]
  site_changed: cfy ->*
    goal_info_list = yield list_goals_for_site(this.site)
    this.goal_info = goal_info_list[0]
    this.intervention_name_to_info_map = yield get_interventions()
    this.rerender()
  on_goal_changed: (evt) ->
    this.rerender()
    this.$$('graph-time-spent-on-goal-sites-daily').ready()
    #this.$$('graph-time-saved-daily').ready()
    this.$$('graph-daily-overview').ready()
    this.$$('graph-num-times-interventions-deployed').ready()
    this.$$('graph-donut-top-sites').ready()

  #ready: ->
  #  this.rerender()
  rerender: cfy ->*
    #Polymer tabbing
    self = this
    self.once_available '#graphsOfGoalsTab', ->
      self.S('#graphsOfGoalsTab').prop('selected', 0)
    self.once_available '#graphsOfInterventionEffectivenessTab', ->
      self.S('#graphsOfInterventionEffectivenessTab').prop('selected', 0)

    site_info_list = yield list_site_info_for_sites_for_which_goals_are_enabled()
    self.site_info_list = site_info_list

}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
    'first_elem'
  ]
}