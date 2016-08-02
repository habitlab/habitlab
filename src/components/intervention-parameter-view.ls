{
  get_intervention_parameters
  get_intervention_parameter
  set_intervention_parameter
} = require 'libs_backend/intervention_utils'

# debounce = require('async-debounce-jt')

{polymer_ext} = require 'libs_frontend/polymer_utils'

/*
set_intervention_parameter_debounced = debounce (args, callback) ->
  [intervention_name, parameter_name, parameter_value] = args
  set_intervention_parameter(intervention_name, parameter_name, parameter_value, callback)
*/

/*
parameters_changed_debounced = debounce (args, callback) ->
  [self] = args
  console.log 'self.intervention'
  console.log self.intervention
  console.log 'self.parameter'
  console.log self.parameter
  if not self.intervention? or not self.parameter?
    return callback?!
  parameter_value <- get_intervention_parameter self.intervention.name, self.parameter.name
  self.$$('#parameter_input').value = parameter_value
  console.log 'parameters_changed_debounced called'
  console.log "parameter #{self.parameter.name} for intervention #{self.intervention.name} is #{parameter_value}"
  return callback?!
*/

polymer_ext {
  is: 'intervention-parameter-view'
  properties: {
    intervention: {
      type: Object
      #observer: 'parameter_changed'
    }
    parameter: {
      type: Object
      observer: 'parameter_changed'
    }
  }
  is_parameter_type_bool: (parameter) ->
    return parameter.type == 'bool'
  is_parameter_multiline: (parameter) ->
    return parameter.multiline == true
  get_error_message: (parameter) ->
    if not parameter? or not parameter.type?
      return ''
    if parameter.type == 'string'
      return '.*'
    if parameter.type == 'int'
      return 'Need an integer'
    if parameter.type == 'float'
      # from http://www.regular-expressions.info/floatingpoint.html
      # [-+]?[0-9]*\.?[0-9]+
      return 'Need a floating-point number'
    return ''
  get_validation_pattern: (parameter) ->
    if not parameter? or not parameter.type?
      return '.*'
    if parameter.type == 'string'
      return '.*'
    if parameter.type == 'int'
      return '[0-9]+'
    if parameter.type == 'float'
      # from http://www.regular-expressions.info/floatingpoint.html
      # [-+]?[0-9]*\.?[0-9]+
      return '[0-9]*\.?[0-9]+'
    return '.*'
  parameter_changed: ->
    self = this
    if not self.intervention? or not self.parameter?
      return
    parameter_value <- get_intervention_parameter self.intervention.name, self.parameter.name
    if self.parameter.type == 'bool'
      self.$$('#parameter_checkbox_input').checked = parameter_value
    else if self.parameter.multiline
      self.$$('#parameter_textarea_input').value = parameter_value
    else
      self.$$('#parameter_input').value = parameter_value
  parameter_checkbox_value_changed: (evt) ->
    self = this
    {checked} = evt.target
    <- set_intervention_parameter self.intervention.name, self.parameter.name, checked
  parameter_textarea_value_changed: (evt) ->
    self = this
    {value} = evt.target
    <- set_intervention_parameter self.intervention.name, self.parameter.name, value
  parameter_value_changed: (evt) ->
    self = this
    if self.$$('#parameter_input').invalid
      return
    {value} = evt.target
    <- set_intervention_parameter self.intervention.name, self.parameter.name, value
  ready: ->
    self = this
    <- self.parameter_changed(self)
}
