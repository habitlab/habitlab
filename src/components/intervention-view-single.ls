{
  set_intervention_enabled
  set_intervention_disabled
  set_intervention_automatically_managed
  set_intervention_manually_managed
  set_intervention_options
  get_intervention_options
} = require 'libs_backend/intervention_utils'

debounce = require('async-debounce-jt')

{polymer_ext} = require 'libs_frontend/polymer_utils'

set_intervention_options_debounced = debounce (args, callback) ->
  [intervention_name, options_text] = args
  set_intervention_options(intervention_name, options_text, callback)

polymer_ext {
  is: 'intervention-view-single'
  properties: {
    intervention: {
      type: Object
      notify: true
      observer: 'intervention_property_changed'
    }
  }
  intervention_changed: (evt) ->
    checked = evt.target.checked
    intervention_name = this.intervention.name
    if checked
      set_intervention_enabled intervention_name
    else
      set_intervention_disabled intervention_name
  automatically_managed_changed: (evt) ->
    checked = evt.target.checked
    intervention_name = this.intervention.name
    if checked
      set_intervention_automatically_managed intervention_name
    else
      set_intervention_manually_managed intervention_name
  options_changed: (evt) ->
    value = evt.target.value
    intervention_name = this.intervention.name
    set_intervention_options_debounced(intervention_name, value)
  intervention_property_changed: ->
    self = this
    if not self.intervention? or not self.intervention.name?
      return
    get_intervention_options self.intervention.name, (options_text) ->
      self.$$('#options_input').value = options_text
  ready: ->
    this.intervention_property_changed()
}
