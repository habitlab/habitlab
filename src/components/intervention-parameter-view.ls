{
  get_intervention_parameters
  get_intervention_parameter
  set_intervention_parameter
} = require 'libs_backend/intervention_utils'

debounce = require('async-debounce-jt')

{polymer_ext} = require 'libs_frontend/polymer_utils'

set_intervention_parameter_debounced = debounce (args, callback) ->
  [intervention_name, parameter_name, parameter_value] = args
  set_intervention_parameter(intervention_name, parameter_name, parameter_value, callback)

parameters_changed_debounced = debounce (args, callback) ->
  [self] = args
  if not self.intervention? or not self.parameter?
    return callback?!
  parameter_value <- get_intervention_parameter self.intervention.name, self.parameter.name
  self.$$('#parameter_input').value = parameter_value
  console.log 'parameters_changed_debounced called'
  return callback?!

polymer_ext {
  is: 'intervention-parameter-view'
  properties: {
    parameter: {
      type: Object
      notify: true
      observer: 'parameter_changed'
    }
    intervention: {
      type: Object
      notify: true
      observer: 'parameter_changed'
    }
  }
  parameter_changed: ->
    self = this
    <- parameters_changed_debounced(self)
  parameter_value_changed: (evt) ->
    self = this
    console.log "parameter_value_changed to"
    console.log evt
    console.log evt.target
    {value} = evt.target
    console.log value
    <- set_intervention_parameter_debounced self.intervention.name, self.parameter.name, value
  ready: ->
    self = this
    <- parameters_changed_debounced(self)
}
