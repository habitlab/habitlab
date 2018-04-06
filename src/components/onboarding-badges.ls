{
  get_interventions
  get_intervention_info
  get_enabled_interventions
  list_generic_interventions
  set_override_enabled_interventions_once
  set_intervention_enabled
  set_intervention_disabled
  set_subinterventions_disabled_for_generic_intervention
  set_subinterventions_enabled_for_generic_intervention
  list_subinterventions_for_generic_intervention
} = require 'libs_backend/intervention_utils'

{
  list_goal_info_for_enabled_goals
} = require 'libs_backend/goal_utils'

{   
  get_enabled_goals  
  get_goal_info
  list_site_info_for_sites_for_which_goals_are_enabled  
  add_enable_custom_goal_reduce_time_on_domain
  set_goal_enabled_manual
  set_goal_disabled_manual
} = require 'libs_backend/goal_utils'

{
  add_log_interventions
} = require 'libs_backend/log_utils'

{
  localstorage_getbool
} = require 'libs_common/localstorage_utils'

{
  localstorage_getbool
} = require 'libs_common/localstorage_utils'

{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

{
  get_all_badges_earned_for_minutes_saved
} = require 'libs_common/badges_utils'

{
  get_time_saved_total
} = require 'libs_common/gamification_utils'

{swal} = require 'sweetalert2'

Bounce = require('bounce.js')
$ = require 'jquery'


polymer_ext {
  is: 'onboarding-badges'
  properties: {
    badges: {
      type: Array
    }
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
    minutes_saved: {
      type: Number
    }

    #logo_glow_url: {
    #  type: String,
    #  value: chrome.extension.getURL('icons/badges/habitlab_glow.svg')      
    #}
    #logo_glow_blend_url: {
    #  type: String,
    #  value: chrome.extension.getURL('icons/badges/glow_blend.svg')      
    #}
    #logo_glow_black_url: {
    #  type: String,
    #  value: chrome.extension.getURL('icons/badges/habitlab_glow_black.svg')     
    #}
    logo_glow_black_bubbles: {
      type: String,
      value: chrome.extension.getURL('icons/badges/habitlab_glow_black_bubbles.svg')     
    }
    #logo_offline_url: {
    #  type: String,
    #  value: chrome.extension.getURL('icons/badges/logo_offline.svg')     
    #}
    # heart_white_url: {
    #   type: String,
    #   value: chrome.extension.getURL('icons/badges/heart_white.svg')     
    # }
    heart_empty_url: {
      type: String,
      value: chrome.extension.getURL('icons/badges/heart.svg')     
    }
    generic_url: {
      type: String,
      value: chrome.extension.getURL('icons/generic_goal_icon.svg')     
    }
    unlock_icon_url:{
      type: String,
      value: chrome.extension.getURL('icons/unlock.svg')
    }
    intervention: {
      type: Object
      observer: 'intervention_property_changed'
    }
    goal_info_list: {
      type: Array
    }
    dialog_intervention: {
      type: Object
    }
    dialog_goal:{
      type: Object
    }
    interventions_info:{
      type: Array
    }
    intervention_name_to_info_map: {
      type: Object
    }
    enabled_goals_info_list: {
      type: Array
    }
    goal_intervention_info_list:{
      type: Array 
    }
    generic_interventions:{
      type:Array
    }
    enabled_interventions_for_goal:{
      type:Array
    }
    goal_name_to_intervention_info_list: {
      type: Object
    }
    pill_button_idx: {
      type: Number
      computed: 'get_pill_button_idx(enabled)'
    }
  }

  get_intervention_icon_url: (intervention) ->
    if intervention.generic_intervention?
      url_path = 'interventions/'+ intervention.generic_intervention + '/icon.svg'
    else
      if intervention.custom == true
        url_path = 'icons/custom_intervention_icon.svg'
      else
        url_path = 'interventions/'+ intervention.name + '/icon.svg'
    return (chrome.extension.getURL(url_path)).toString()

  get_enabled_interventions_for_goal_sync: (goal_name, goal_name_to_intervention_info_list) ->
    goal_name_to_intervention_info_list[goal_name]

  distinct_interventions_exist: (goal_name, goal_name_to_intervention_info_list) ->
    if not goal_name_to_intervention_info_list[goal_name]?
      return false
    if (goal_name_to_intervention_info_list[goal_name]).length < 1
      return false
    return true

  get_enabled_interventions_for_goal: (goal_name) ->>
    goal_info = await get_goal_info(goal_name)
    all_interventions = await get_interventions()
    enabled_interventions = await get_enabled_interventions()
    output = []
    for intervention_name in goal_info.interventions
      if not enabled_interventions[intervention_name]
        continue
      intervention_info = all_interventions[intervention_name]
      if intervention_info.generic_intervention?
        continue
      output.push(intervention_info)
    return output

  compute_sitename: (goal) ->
    return goal.sitename_printable

  openBy: (evt) ->>
    dialog_intervention = evt.target.intervention_info
    if evt.target.goal_info?
      dialog_goal = evt.target.goal_info
    else
      dialog_goal = 0
    this.dialog_intervention = dialog_intervention
    this.dialog_goal = dialog_goal
    enabled_interventions = await get_enabled_interventions()
    this.enabled = enabled_interventions[dialog_intervention.name]
    # console.log(this.$$('#alignedDialog').dialog_intervention)
    # this.$$('#alignedDialog').positionTarget = evt.target
    this.$$('#alignedDialog').open()
    return

  # helpOpen: (evt) ->
  #   console.log(evt)
  #   this.$.animated.open()
  #   return   

  # bounce_object: (evt) ->
  #   bounce = new Bounce()
  #   bounce.scale({
  #     from: {x:0.9,y:0.9},
  #     to: {x:1,y:1}
  #     easing: "bounce",
  #     duration: 1000,
  #     delay: 0,
  #     bounces: 5,
  #     stiffness:1
  #   });
  #   bounce.applyTo(this.SM('.badges'))
  #   return
  
  # bounce_hearts: (evt) ->
  #   bounce2 = new Bounce()
  #   bounce2.rotate({
  #     from: 0
  #     to: 360
  #   });
  #   bounce2.applyTo(this.SM('.hearts'))
  #   return

  pill_button_selected: (evt) ->>
    buttonidx = evt.detail.buttonidx
    intervention_name = this.dialog_intervention.name
    is_generic = intervention_name.startsWith 'generic/'
    if buttonidx == 1 # enabled
      this.enabled = true
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_enabled this.dialog_intervention.name
      log_intervention_info = {
        type: 'intervention_set_smartly_managed'
        page: 'onboarding-view'
        subpage: 'onboarding-badges'
        category: 'intervention_enabledisable'
        now_enabled: true
        is_permanent: true
        manual: true
        url: window.location.href
        intervention_name: this.dialog_intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
      if is_generic
        log_intervention_info.change_subinterventions = true
        log_intervention_info.subinterventions_list = await list_subinterventions_for_generic_intervention(intervention_name)
        await set_subinterventions_enabled_for_generic_intervention(intervention_name)
      await add_log_interventions log_intervention_info
    else if buttonidx == 0 # never shown
      this.enabled = false
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_disabled this.dialog_intervention.name
      log_intervention_info = {
        type: 'intervention_set_always_disabled'
        page: 'onboarding-view'
        subpage: 'onboarding-badges'
        category: 'intervention_enabledisable'
        now_enabled: false
        is_permanent: true
        manual: true
        url: window.location.href
        intervention_name: this.dialog_intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
      if is_generic
        log_intervention_info.change_subinterventions = true
        log_intervention_info.subinterventions_list = await list_subinterventions_for_generic_intervention(intervention_name)
        await set_subinterventions_disabled_for_generic_intervention(intervention_name)
      await add_log_interventions log_intervention_info
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
  preview_intervention: ->>
    intervention_name = this.dialog_intervention.name
    enabled_goal_names =  this.enabled_goals_info_list.map (.name)
    facebook_enabled = enabled_goal_names.includes('facebook/spend_less_time')
    reddit_enabled = enabled_goal_names.includes('reddit/spend_less_time')
    preview_page = this.dialog_goal.preview ? this.dialog_intervention.preview ? 'https://' + this.dialog_goal.domain
    if intervention_name.startsWith('generic/')
      if facebook_enabled and (not reddit_enabled)
        intervention_name = intervention_name.replace('generic/', 'facebook/')
      else
        intervention_name = intervention_name.replace('generic/', 'reddit/')
      intervention_info = await get_intervention_info(intervention_name)
      goal_info = await get_goal_info(intervention_info.goals[0])
      set_override_enabled_interventions_once intervention_name
      preview_page = goal_info.preview ? 'https://' + goal_info.domain
    else
      set_override_enabled_interventions_once intervention_name
    chrome.tabs.create {url: preview_page}
  rerender: ->>
    [enabled_goals_info_list, generic_interventions, all_interventions, enabled_interventions] = await Promise.all [
      list_goal_info_for_enabled_goals()
      list_generic_interventions()
      get_interventions()
      get_enabled_interventions()
    ]
    generic_interventions_info = []
    for x in generic_interventions
      info = all_interventions[x]
      generic_interventions_info.push info
    this.generic_interventions_info = generic_interventions_info
    goal_name_to_intervention_info_list = []
    for goal_info in enabled_goals_info_list
      intervention_info_list_for_goal = []
      for intervention_name in goal_info.interventions
        intervention_info = all_interventions[intervention_name]
        if intervention_info.generic_intervention?
          continue
        intervention_info_list_for_goal.push intervention_info
      goal_name_to_intervention_info_list[goal_info.name] = intervention_info_list_for_goal
    this.goal_name_to_intervention_info_list = goal_name_to_intervention_info_list
    enabled_goals_info_list.sort (a, b) ->
      intervention_info_list_a = goal_name_to_intervention_info_list[a.name]
      intervention_info_list_b = goal_name_to_intervention_info_list[b.name]
      num_interventions_a = intervention_info_list_a.length ? 0
      num_interventions_b = intervention_info_list_b.length ? 0
      return num_interventions_b - num_interventions_a
    this.enabled_goals_info_list = enabled_goals_info_list
  ready: ->>
    this.rerender()
  isdemo_changed: (isdemo) ->
    if isdemo
      this.minutes_saved = 300
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'SM'
    'S'
    'once_available'
    'first_elem'
  ]
}