{
  set_intervention_enabled
  set_intervention_disabled
  set_intervention_automatically_managed
  set_intervention_manually_managed
  get_intervention_parameters
  set_intervention_parameter
} = require 'libs_backend/intervention_utils'

#debounce = require('async-debounce-jt')

{polymer_ext} = require 'libs_frontend/polymer_utils'

#set_intervention_options_debounced = debounce (args, callback) ->
#  [intervention_name, options_text] = args
#  set_intervention_options(intervention_name, options_text, callback)

polymer_ext {
  is: 'intervention-view-single'
  properties: {
    intervention: {
      type: Object
      observer: 'intervention_property_changed'
    }
    automatic: {
      type: Boolean
      observer: 'automatic_changed'
    }
    enabled: {
      type: Boolean
      observer: 'enabled_changed'
    }
    always_shown: {
      type: Boolean
      computed: 'intervention_always_shown(enabled, automatic)'
    }
    never_shown: {
      type: Boolean
      computed: 'intervention_never_shown(enabled, automatic)'
    }
    manually_managed: {
      type: Boolean
      computed: 'intervention_manually_managed(automatic)'
    }
  }
  intervention_property_changed: (intervention, old_intervention) ->
    this.automatic = this.intervention.automatic
    this.enabled = this.intervention.enabled
  automatic_changed: (automatic, old_automatic) ->
    this.intervention.automatic = automatic
  enabled_changed: (enabled, old_enabled) ->
    this.intervention.enabled = enabled
  intervention_manually_managed: (automatic) ->
    return !automatic
  intervention_always_shown: (enabled, automatic) ->
    return enabled and !automatic
  intervention_never_shown: (enabled, automatic) ->
    return !enabled and !automatic
  is_debug: ->
    debug_val = localStorage.getItem('intervention_view_debug')
    return debug_val == 'true'
  always_shown_changed: (evt) ->
    active = evt.target.active
    if active # just got checked
      this.enabled = true
      this.automatic = false
      set_intervention_enabled this.intervention.name
      set_intervention_manually_managed this.intervention.name
    else
      this.automatic = true
      set_intervention_automatically_managed this.intervention.name
  never_shown_changed: (evt) ->
    active = evt.target.active
    if active # just got checked
      this.enabled = false
      this.automatic = false
      set_intervention_disabled this.intervention.name
      set_intervention_manually_managed this.intervention.name
    else
      this.automatic = true
      set_intervention_automatically_managed this.intervention.name
  intervention_changed: (evt) ->
    checked = evt.target.checked
    #this.enabled = !checked
    intervention_name = this.intervention.name
    if checked
      set_intervention_enabled intervention_name
    else
      set_intervention_disabled intervention_name
  #automatically_managed_changed: (evt) ->
  #  checked = evt.target.checked
  #  intervention_name = this.intervention.name
  #  if checked
  #    set_intervention_automatically_managed intervention_name
  #  else
  #    set_intervention_manually_managed intervention_name
  #options_changed: (evt) ->
  #  value = evt.target.value
  #  intervention_name = this.intervention.name
  #  #set_intervention_options_debounced(intervention_name, value)
  #intervention_property_changed: ->
  #  self = this
  #  if not self.intervention? or not self.intervention.name?
  #    return
  #  get_intervention_parameters self.intervention.name, (parameters) ->
  #    self.$$('#options_input').value = JSON.stringify(parameters)
  #ready: ->
  #  this.intervention_property_changed()
}
