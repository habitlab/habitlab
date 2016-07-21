{
  get_enabled_interventions
  set_intervention_enabled
  set_intervention_disabled
  set_intervention_automatically_managed
  set_intervention_manually_managed
  get_intervention_parameters
  set_intervention_parameter
} = require 'libs_backend/intervention_utils'

{
  add_log_interventions
} = require 'libs_backend/log_utils'

{cfy} = require 'cfy'

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
  display_internal_names_for_interventions: ->
    return localStorage.getItem('intervention_view_display_internal_names') == 'true'
  always_shown_changed: cfy (evt) ->*
    active = evt.target.active
    if active # just got checked
      this.enabled = true
      this.automatic = false
      prev_enabled_interventions = yield get_enabled_interventions()
      yield set_intervention_enabled this.intervention.name
      yield set_intervention_manually_managed this.intervention.name
      add_log_interventions {
        type: 'always_show_enabled'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
    else
      this.automatic = true
      prev_enabled_interventions = yield get_enabled_interventions()
      yield set_intervention_automatically_managed this.intervention.name
      add_log_interventions {
        type: 'always_show_disabled'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
  never_shown_changed: cfy (evt) ->*
    active = evt.target.active
    if active # just got checked
      this.enabled = false
      this.automatic = false
      prev_enabled_interventions = yield get_enabled_interventions()
      yield set_intervention_disabled this.intervention.name
      yield set_intervention_manually_managed this.intervention.name
      add_log_interventions {
        type: 'never_show_enabled'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
    else
      this.automatic = true
      prev_enabled_interventions = yield get_enabled_interventions()
      yield set_intervention_automatically_managed this.intervention.name
      add_log_interventions {
        type: 'never_show_disabled'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
  intervention_changed: cfy (evt) ->*
    checked = evt.target.checked
    #this.enabled = !checked
    prev_enabled_interventions = yield get_enabled_interventions()
    intervention_name = this.intervention.name
    if checked
      yield set_intervention_enabled intervention_name
      add_log_interventions {
        type: 'intervention_checked'
        manual: true
        intervention_name: intervention_name
        prev_enabled_interventions: prev_enabled_interventions
      }
    else
      yield set_intervention_disabled intervention_name
      add_log_interventions {
        type: 'intervention_unchecked'
        manual: true
        intervention_name: intervention_name
        prev_enabled_interventions: prev_enabled_interventions
      }
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
