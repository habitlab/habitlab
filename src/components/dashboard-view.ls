{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

require! {
  async
}

{cfy} = require 'cfy'

{  
  list_site_info_for_sites_for_which_goals_are_enabled
} = require 'libs_backend/goal_utils'

polymer_ext {
  is: 'dashboard-view'
  properties: {
    site_info_list: {
      type: Array
    }
  }
  /*
  buttonAction1: ->
    this.linedata.datasets[0].label = 'a new label'
    this.$$('#linechart').chart.update()
  */

  on_goal_changed: (evt) ->
    this.rerender()
    this.$$('graph-time-spent-on-goal-sites-daily').ready()
    #this.$$('graph-time-saved-daily').ready()
    this.$$('graph-daily-overview').ready()
    this.$$('graph-num-times-interventions-deployed').ready()
    this.$$('graph-donut-top-sites').ready()

  ready: ->
    this.rerender()
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