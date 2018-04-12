{
  get_enabled_interventions
  set_intervention_enabled
  set_intervention_disabled
  set_intervention_automatically_managed
  set_intervention_manually_managed
  get_intervention_parameters
  set_intervention_parameter
  set_override_enabled_interventions_once
  list_custom_interventions
  get_interventions
  remove_custom_intervention  
} = require 'libs_backend/intervention_utils'

{
  add_log_interventions
} = require 'libs_backend/log_utils'

{
  localstorage_getbool
} = require 'libs_common/localstorage_utils'

{polymer_ext} = require 'libs_frontend/polymer_utils'

#set_intervention_options_debounced = debounce (args, callback) ->
#  [intervention_name, options_text] = args
#  set_intervention_options(intervention_name, options_text, callback)

polymer_ext {
  is: 'intervention-view-single-v2'
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
    custom: {
      type: Boolean
      computed: 'compute_custom(intervention)'
    }
    downloaded: {
      type: Boolean
      computed: 'compute_downloaded(intervention)'
    }
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
  }
  isdemo_changed: (isdemo) ->>
    if isdemo
      this.intervention = (await get_interventions())['facebook/remove_news_feed']
  /*
  get_pill_button_tooltip: (pill_button_idx) ->
    if pill_button_idx == 0
      return "Each time you visit Facebook,<br>HabitLab will show one of the<br>'Sometimes Shown' interventions."
    else if pill_button_idx == 1
      return "A 'Never Shown' intervention<br>is disabled and will not be shown."
  */
  compute_custom: (intervention) ->
    if intervention?
      return intervention.custom == true
    return false
  compute_downloaded: (intervention) ->
    if intervention?
      if localStorage['downloaded_intervention_' + intervention.name]?
        console.log "true"
        return true
    return false
  compute_sitename: (goal) ->
    return goal.sitename_printable
  test_function: (isDownloaded, isCustom) ->
    return !isDownloaded && isCustom;
  intervention_property_changed: (intervention, old_intervention) ->
    if not intervention?
      return
    #this.automatic = this.intervention.automatic
    this.enabled = intervention.enabled

  get_intervention_icon_url: (intervention) ->
    if intervention?
      if intervention.generic_intervention?
        url_path = 'interventions/'+ intervention.generic_intervention+ '/icon.svg'
      else
        if intervention.custom == true
          url_path = 'icons/custom_intervention_icon.svg'
        else
          url_path = 'interventions/'+ intervention.name + '/icon.svg'
      return (chrome.extension.getURL(url_path)).toString()
    url_path = 'icons/custom_intervention_icon.svg'
    return (chrome.extension.getURL(url_path)).toString()



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
  
  is_generic_intervention: (intervention_name)->>
    all_interventions = await get_interventions()
    ourput = false
    intervention_info = all_interventions[intervention_name]
    if intervention_info.generic_intervention?
      output = true
    return output

  is_generic_intervention_sync:(intervention_name,is_generic_intervention) ->
    return is_generic_intervention(intervention_name)
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
    is_enabled = buttonidx == 1
    if is_enabled # enabled
      this.enabled = true
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_enabled this.intervention.name
      add_log_interventions {
        type: 'intervention_set_smartly_managed'
        page: 'site-view'
        subpage: 'intervention-view-single-compact'
        category: 'intervention_enabledisable'
        now_enabled: true
        is_permanent: true
        manual: true
        url: window.location.href
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
    else # never shown
      this.enabled = false
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_disabled this.intervention.name
      add_log_interventions {
        type: 'intervention_set_always_disabled'
        page: 'site-view'
        subpage: 'intervention-view-single-v2'
        category: 'intervention_enabledisable'
        now_enabled: false
        is_permanent: true
        manual: true
        url: window.location.href
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
    if this.intervention.generic_intervention?
      generic_intervention_changed = document.querySelector('enabledisable-intervention-all-sites')
      if not generic_intervention_changed?
        generic_intervention_changed = document.createElement('enabledisable-intervention-all-sites')
        document.body.appendChild(generic_intervention_changed)
      generic_intervention_changed.intervention = this.intervention
      generic_intervention_changed.is_enabled = is_enabled
      generic_intervention_changed.show()
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
  edit_custom_intervention: ->
    localStorage.setItem('intervention_editor_open_intervention_name',JSON.stringify(this.intervention.name))
    chrome.tabs.create url: chrome.extension.getURL('index.html?tag=intervention-editor')
  delete_custom_intervention: ->
    self = this
    remove_custom_intervention this.intervention.name
    self.fire('download-deleted', {

    })
  #ready: ->>
  #  custom_interventions=await list_custom_interventions()
  #  if custom_interventions.includes this.intervention.name
  #    this.custom=true
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
  ready: ->
    if this.intervention?
      console.log "hello!!!"
}
