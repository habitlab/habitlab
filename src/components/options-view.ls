{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'options-view'
  properties: {
    selected_tab_idx: {
      type: Number
      value: 0
    }
    selected_tab_name: {
      type: String
      computed: 'compute_selected_tab_name(selected_tab_idx)'
      observer: 'selected_tab_name_changed'
    }
  }
  listeners: {
    goal_changed: 'on_goal_changed'
  }
  set_selected_tab_by_name: (selected_tab_name) ->
    selected_tab_idx = ['goals', 'interventions', 'results'].indexOf(selected_tab_name)
    if selected_tab_idx != -1
      this.selected_tab_idx = selected_tab_idx
  compute_selected_tab_name: (selected_tab_idx) ->
    return ['goals', 'interventions', 'results'][selected_tab_idx]
  selected_tab_name_changed: (selected_tab_name) ->
    this.fire 'options_selected_tab_changed', {selected_tab_name}
  on_goal_changed: (evt) ->
    this.$$('#options-interventions').on_goal_changed(evt.detail)
    this.$$('#dashboard-view').on_goal_changed(evt.detail)
  #ready: ->
  #  self = this
  #  self.once_available '#optionstab', ->
  #    self.S('#optionstab').prop('selected', 0)
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
