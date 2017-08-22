{
  get_enabled_interventions
  set_intervention_enabled
  set_intervention_disabled
  set_intervention_automatically_managed
  set_intervention_manually_managed
  get_intervention_parameters
  set_intervention_parameter
  set_override_enabled_interventions_once
} = require 'libs_backend/intervention_utils'

{
  add_log_interventions
} = require 'libs_backend/log_utils'

{
  localstorage_getbool
} = require 'libs_common/localstorage_utils'

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
    #automatic: {
    #  type: Boolean
    #  observer: 'automatic_changed'
    #}
    enabled: {
      type: Boolean
      observer: 'enabled_changed'
    }
    compact: {
      type: Boolean
      value: false
    }
    #always_shown: {
    #  type: Boolean
    #  computed: 'intervention_always_shown(enabled, automatic)'
    #}
    #never_shown: {
    #  type: Boolean
    #  computed: 'intervention_never_shown(enabled, automatic)'
    #}
    #manually_managed: {
    #  type: Boolean
    #  computed: 'intervention_manually_managed(automatic)'
    #}
    pill_button_idx: {
      type: Number
      computed: 'get_pill_button_idx(enabled)'
    }
    goal: {
      type: Object
    }
    sitename: {
      type: String
      computed: 'compute_sitename(goal)'
    }
  }
  /*
  get_pill_button_tooltip: (pill_button_idx) ->
    if pill_button_idx == 0
      return "Each time you visit Facebook,<br>HabitLab will show one of the<br>'Sometimes Shown' interventions."
    else if pill_button_idx == 1
      return "A 'Never Shown' intervention<br>is disabled and will not be shown."
  */
  compute_sitename: (goal) ->
    return goal.sitename_printable
  intervention_property_changed: (intervention, old_intervention) ->
    #this.automatic = this.intervention.automatic
    this.enabled = this.intervention.enabled
  /*
  automatic_and_enabled: (automatic, enabled) ->
    return automatic and enabled
  automatic_and_disabled: (automatic, enabled) ->
    return automatic and !enabled
  automatic_changed: (automatic, old_automatic) ->
    this.intervention.automatic = automatic
  */
  enabled_changed: (enabled, old_enabled) ->
    this.intervention.enabled = enabled
  #intervention_manually_managed: (automatic) ->
  #  return !automatic
  #intervention_always_shown: (enabled, automatic) ->
  #  return enabled and !automatic
  #intervention_never_shown: (enabled, automatic) ->
  #  return !enabled and !automatic
  display_internal_names_for_interventions: ->
    return localstorage_getbool('intervention_view_show_internal_names')
  /*
  pill_button_selected: (evt) ->>
    buttonidx = evt.detail.buttonidx
    if buttonidx == 1 # smartly managed
      this.automatic = true
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_enabled this.intervention.name
      await set_intervention_automatically_managed this.intervention.name
      add_log_interventions {
        type: 'intervention_set_smartly_managed'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
    else if buttonidx == 0 # never shown
      this.enabled = false
      this.automatic = false
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_disabled this.intervention.name
      await set_intervention_manually_managed this.intervention.name
      add_log_interventions {
        type: 'intervention_set_always_disabled'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
  */
  pill_button_selected: (evt) ->>
    buttonidx = evt.detail.buttonidx
    if buttonidx == 1 # enabled
      this.enabled = true
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_enabled this.intervention.name
      add_log_interventions {
        type: 'intervention_set_smartly_managed'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
    else if buttonidx == 0 # never shown
      this.enabled = false
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_disabled this.intervention.name
      add_log_interventions {
        type: 'intervention_set_always_disabled'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
  get_pill_button_idx: (enabled) ->
    if enabled
      return 1
    else
      return 0
  /*
  get_dropdown_idx: (automatic, enabled) ->
    if !automatic
      if enabled
        return 1
      else
        return 2
    return 0
  */
  preview_intervention: ->
    intervention_name = this.intervention.name
    set_override_enabled_interventions_once intervention_name
    preview_page = this.intervention.preview ? this.goal.preview ? this.goal.homepage
    chrome.tabs.create {url: preview_page}
  parameters_shown: ->
    return localstorage_getbool('intervention_view_show_parameters')
  /*
  dropdown_menu_changed: (evt) ->>
    selected = this.$$('#enabled_selector').selected
    if selected == 0 and this.automatic
      return
    if selected == 1 and !this.automatic and this.enabled
      return
    if selected == 2 and !this.automatic and !this.enabled
      return
    if selected == 0
      this.automatic = true
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_automatically_managed this.intervention.name
      add_log_interventions {
        type: 'intervention_set_smartly_managed'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
    if selected == 1
      this.enabled = true
      this.automatic = false
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_enabled this.intervention.name
      await set_intervention_manually_managed this.intervention.name
      add_log_interventions {
        type: 'intervention_set_always_enabled'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
    if selected == 2
      this.enabled = false
      this.automatic = false
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_disabled this.intervention.name
      await set_intervention_manually_managed this.intervention.name
      add_log_interventions {
        type: 'intervention_set_always_disabled'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
  temporarily_enable: (evt) ->>
    this.enabled = true
    prev_enabled_interventions = await get_enabled_interventions()
    intervention_name = this.intervention.name
    await set_intervention_enabled intervention_name
    add_log_interventions {
      type: 'intervention_temporarily_enabled'
      manual: true
      intervention_name: intervention_name
      prev_enabled_interventions: prev_enabled_interventions
    }
  temporarily_disable: (evt) ->>
    this.enabled = false
    prev_enabled_interventions = await get_enabled_interventions()
    intervention_name = this.intervention.name
    await set_intervention_disabled intervention_name
    add_log_interventions {
      type: 'intervention_temporarily_disabled'
      manual: true
      intervention_name: intervention_name
      prev_enabled_interventions: prev_enabled_interventions
    }
  */
  /*
  intervention_changed: (evt) ->>
    checked = evt.target.checked
    #this.enabled = !checked
    prev_enabled_interventions = await get_enabled_interventions()
    intervention_name = this.intervention.name
    if checked
      await set_intervention_enabled intervention_name
      add_log_interventions {
        type: 'intervention_checked'
        manual: true
        intervention_name: intervention_name
        prev_enabled_interventions: prev_enabled_interventions
      }
    else
      await set_intervention_disabled intervention_name
      add_log_interventions {
        type: 'intervention_unchecked'
        manual: true
        intervention_name: intervention_name
        prev_enabled_interventions: prev_enabled_interventions
      }
  */
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
