{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'options-view'
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
