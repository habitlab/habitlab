{
  get_interventions
  get_intervention_info
  get_enabled_interventions
  list_generic_interventions
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


{cfy} = require 'cfy'
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

    logo_glow_url: {
      type: String,
      value: chrome.extension.getURL('icons/badges/habitlab_glow.svg')      
    }
    logo_glow_blend_url: {
      type: String,
      value: chrome.extension.getURL('icons/badges/glow_blend.svg')      
    }
    logo_glow_black_url: {
      type: String,
      value: chrome.extension.getURL('icons/badges/habitlab_glow_black.svg')     
    }
    logo_glow_black_bubbles: {
      type: String,
      value: chrome.extension.getURL('icons/badges/habitlab_glow_black_bubbles.svg')     
    }
    logo_offline_url: {
      type: String,
      value: chrome.extension.getURL('icons/badges/logo_offline.svg')     
    }
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
      value: chrome.extension.getURL('icons/intervention_icons/Generic.svg')     
    }
    generic_unlock_icon_url:{
      type: String,
      value: chrome.extension.getURL('interventions/generic/unlock.svg')     
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
  
  get_goal_icon_url: (sitename) ->
    url_path = 'interventions/'+ sitename.toString() + '/siteicon.svg'
    return (chrome.extension.getURL(url_path)).toString()

  get_unlock_icon_url: (sitename) ->
    url_path = 'interventions/'+ sitename.toString() + '/unlock.svg'
    return (chrome.extension.getURL(url_path)).toString()

  get_intervention_icon_url: (intervention_name) ->
    url_path = 'interventions/'+ intervention_name.toString() + '/icon.svg'
    return (chrome.extension.getURL(url_path)).toString()

  get_enabled_interventions_for_goal_sync: (goal_name, goal_name_to_intervention_info_list) ->
    goal_name_to_intervention_info_list[goal_name]

  distinct_interventions_exist: (goal_name, goal_name_to_intervention_info_list) ->
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

  openBy: (evt) ->
    console.log(evt)
    console.log(evt.target)
    dialog_intervention = evt.target.intervention_info
    dialog_goal = evt.target.goal_info
    console.log('dialog_intervention')
    console.log(dialog_intervention)
    console.log('dialog_goal')
    console.log(dialog_goal)
    this.dialog_intervention = dialog_intervention
    this.dialog_goal = dialog_goal
    # console.log(this.$$('#alignedDialog').dialog_intervention)
    # this.$$('#alignedDialog').positionTarget = evt.target
    this.$$('#alignedDialog').open()
    return

  get_dialog_intervention: ->
    console.log("dialog_intervention_called")
    console.log(dialog_intervention)
    return dialog_intervention


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
    if buttonidx == 1 # enabled
      this.enabled = true
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_enabled this.dialog_intervention.name
      add_log_interventions {
        type: 'intervention_set_smartly_managed'
        manual: true
        intervention_name: this.dialog_intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
    else if buttonidx == 0 # never shown
      this.enabled = false
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_disabled this.dialog_intervention.name
      add_log_interventions {
        type: 'intervention_set_always_disabled'
        manual: true
        intervention_name: this.dialog_intervention.name
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
    intervention_name = this.dialog_intervention.name
    set_override_enabled_interventions_once intervention_name
    # if this.dialog_intervention.preview == null
    #   preview_page = "https://www.facebook.com/"
    # if this.dialog_goal.preview == null
    #   preview_page = "https://www.facebook.com/"
    # else
    #   preview_page = this.dialog_intervention.preview ? this.dialog_goal.preview ? this.dialog_goal.homepage
    preview_page = this.dialog_intervention.preview ? this.dialog_goal.preview ? this.dialog_goal.homepage
    chrome.tabs.create {url: preview_page}
    console.log('preview_page')
    console.log(preview_page)

  ready: ->>

    enabled_goals_info_list = await list_goal_info_for_enabled_goals()
    generic_interventions = await list_generic_interventions()
    generic_interventions_info = []
    for x in generic_interventions
      info = await get_intervention_info(x)
      generic_interventions_info.push info
    this.generic_interventions_info = generic_interventions_info
    console.log(generic_interventions_info)
    goal_name_to_intervention_info_list = []
    for goal_info in enabled_goals_info_list
      console.log(goal_info)
      goal_name_to_intervention_info_list[goal_info.name] = await this.get_enabled_interventions_for_goal(goal_info.name)
    this.goal_name_to_intervention_info_list = goal_name_to_intervention_info_list

    enabled_goals_info_list.sort (a, b) ->
      intervention_info_list_a = goal_name_to_intervention_info_list[a.name]
      intervention_info_list_b = goal_name_to_intervention_info_list[b.name]
      num_interventions_a = intervention_info_list_a.length ? 0
      num_interventions_b = intervention_info_list_b.length ? 0
      return num_interventions_b - num_interventions_a
    console.log('enabled_goals_info_list')
    console.log(enabled_goals_info_list)
    
    this.enabled_goals_info_list = enabled_goals_info_list 

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