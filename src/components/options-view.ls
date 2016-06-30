{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'options-view'
  listeners: {
    goal_changed: 'on_goal_changed'
  }
  on_goal_changed: (evt) ->
    this.$$('#options-interventions').on_goal_changed(evt.detail)
  ready: ->
    self = this
    self.once_available '#optionstab', ->
      self.S('#optionstab').prop('selected', 1)
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
