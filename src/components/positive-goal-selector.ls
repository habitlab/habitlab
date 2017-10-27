prelude = require 'prelude-ls'
$ = require 'jquery'

swal = require 'sweetalert2'


{load_css_file} = require 'libs_common/content_script_utils'

{
  get_enabled_goals
  get_goals
  get_spend_more_time_goals
  set_goal_target
  get_goal_target
  remove_custom_goal_and_generated_interventions
  add_enable_custom_goal_reduce_time_on_domain
  add_enable_custom_goal_increase_time_on_domain
  set_goal_enabled_manual
  set_goal_disabled_manual
} = require 'libs_backend/goal_utils'

{
  get_interventions
  get_enabled_interventions
  set_intervention_disabled
} = require 'libs_backend/intervention_utils'


{
  enable_interventions_because_goal_was_enabled

} = require 'libs_backend/intervention_manager'

{
  get_baseline_time_on_domains
  get_baseline_time_on_domain
} = require 'libs_backend/history_utils'

{
  add_log_interventions
} = require 'libs_backend/log_utils'

{
  url_to_domain
} = require 'libs_common/domain_utils'

{
  get_canonical_domain
} = require 'libs_backend/canonical_url_utils'

{
  get_favicon_data_for_domain_cached
} = require 'libs_backend/favicon_utils'

{
  promise_all_object
} = require 'libs_common/promise_utils'

{
  msg
} = require 'libs_common/localization_utils'

{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'positive-goal-selector'
  properties: {
    sites_and_goals: {
      type: Array
      value: []
    }
    suggested_sites: {
      type: Array
      value: []
    }
    daily_goal_values: {
      type: Array
      value: ["5 minutes", "10 minutes", "15 minutes", "20 minutes", "25 minutes", "30 minutes", "35 minutes", "40 minutes", "45 minutes", "50 minutes", "55 minutes", "60 minutes"]
    }
    index_of_daily_goal_mins: {
      type: Object
      value: {}
    },
    # title_text: {
    #   type: String
    #   value: msg("We will only nudge when you are on sites you want to spend less time on.")
    # }
    # title_text_bolded_portion: {
    #   type: String
    #   value: msg("What sites would you like to spend more time on?")
    # }
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
    title: {
      type: String
      value: msg("How would you rather use your time?")
    }
    num_per_line: {
      type: Number
      value: 4
    }
    icon_check_url:{
      type: String,
      value: chrome.extension.getURL('icons/icon_check_bluewhite.png') 
    }
    icon_add_url: {
      type: String,
      value: chrome.extension.getURL('icons/plus.png') 
    }
    delete_url:{
      type: String,
      value: chrome.extension.getURL('icons/delete.svg') 
    }
    configure_url: {
      type: String,
      value: chrome.extension.getURL('icons/configure.svg') 
    }
    baseline_time_on_domains: {
      type: Object
    }
    goal_name_to_icon: {
      type: Object
      value: {}
    }
    is_onboarding: {
      type: Boolean
      value: false
    }
  }
  isdemo_changed: (isdemo) ->
    if isdemo
      this.set_sites_and_goals()
      document.body.style.backgroundColor = 'white'
  get_time_spent_for_domain: (domain, baseline_time_on_domains) ->
    if baseline_time_on_domains[domain]?
      minutes = baseline_time_on_domains[domain] / (1000*60)
      return (minutes).toPrecision(2) + ' mins'
    return '0 mins'
  limit_to_eight: (list) ->
    return list[0 til 8]
  delete_goal_clicked: (evt) ->>
    goal_name = evt.target.goal_name
    await remove_custom_goal_and_generated_interventions goal_name
    await this.set_sites_and_goals()
    this.fire 'need_rerender', {}
  disable_interventions_which_do_not_satisfy_any_goals: (goal_name) ->>
    enabled_goals = await get_enabled_goals()
    enabled_interventions = await get_enabled_interventions()
    all_interventions = await get_interventions()
    interventions_to_disable = []
    for intervention_name,intervention_enabled of enabled_interventions
      if not intervention_enabled
        continue
      intervention_info = all_interventions[intervention_name]
      intervention_satisfies_an_enabled_goal = false
      for goal_name in intervention_info.goals
        if enabled_goals[goal_name]
          intervention_satisfies_an_enabled_goal = true
      if not intervention_satisfies_an_enabled_goal
        interventions_to_disable.push intervention_name
    prev_enabled_interventions = {} <<< enabled_interventions
    for intervention_name in interventions_to_disable
      await set_intervention_disabled intervention_name
    if interventions_to_disable.length > 0
      add_log_interventions {
        type: 'interventions_disabled_due_to_user_disabling_goal'
        manual: false
        goal_name: goal_name
        interventions_list: interventions_to_disable
        prev_enabled_interventions: prev_enabled_interventions
      }
  time_updated: (evt, obj) ->>
    mins = Number (obj.item.innerText.trim ' ' .split ' ' .0)
    set_goal_target obj.item.class, mins
  get_daily_targets: ->>
    goals = await get_goals!
    for goal in Object.keys goals
      if goal == "debug/all_interventions" 
        continue
      mins = await get_goal_target goal
      mins = mins/5 - 1
      this.index_of_daily_goal_mins[goal] = mins
  show_internal_names_of_goals: ->
    return localStorage.getItem('intervention_view_show_internal_names') == 'true'
  daily_goal_help_clicked: ->
    swal {
      title: 'How will HabitLab help me use these more?'
      text: 'With variety of different nudges and helpers, such as putting your next Duolingo lesson in the YouTube sidebar when an ad is running, or putting a friendly reminder in the Facebook news feed to go to the site of your choice.'
    }

  openBy: (evt) ->
    this.$.alignedDialog.positionTarget = evt.target
    this.$.alignedDialog.open()
    return

  /*open_feedback_form: ->>
      feedback_form = document.createElement('feedback-form')
      feedback_form.screenshot = this.screenshot
      feedback_form.other = this.other
      this.$$('#intervention_info_dialog').close()
      document.body.appendChild(feedback_form)
      feedback_form.open()
  }*/


  add_website_input: (evt) ->

  # paper_icon_item_clicked: (evt) ->
  #   console.log 'paper_icon_item_clicked'
  #   console.log evt
  #   console.log evt.target.domain
  #   console.log evt.target.getAttribute('domain')
  #   console.log evt.target
  #   domain = this.$$('#add_website_input').value.trim()
  #   console.log(domain)

  valueChange: (evt) ->
    domain = this.$$('#add_website_input').value.trim()
    this.add_custom_website_from_input()
    return
  
  settings_goal_clicked: (evt) ->
    evt.preventDefault()
    evt.stopPropagation()
    newtab = evt.target.sitename.toLowerCase!
    this.fire 'need_tab_change', {newtab: newtab}
  get_icon_for_goal: (goal, goal_name_to_icon) ->
    if goal.icon?
      return goal.icon
    if goal_name_to_icon[goal.name]?
      return goal_name_to_icon[goal.name]
    return chrome.extension.getURL('icons/loading.gif')
  is_goal_shown: (goal) ->
    if goal.hidden and localStorage.getItem('show_hidden_goals_and_interventions') != 'true'
      return false
    if goal.beta and localStorage.getItem('show_beta_goals_and_interventions') != 'true'
      return false
    return true
  set_sites_and_goals: ->>
    self = this
    [goal_name_to_info, enabled_goals] = await Promise.all [get_goals(), get_enabled_goals()]
    sitename_to_goals = {}
    for goal_name,goal_info of goal_name_to_info
      if goal_name == 'debug/all_interventions' and localStorage.getItem('intervention_view_show_debug_all_interventions_goal') != 'true'
        continue
      if not goal_info.is_positive
        continue
      sitename = goal_info.sitename_printable
      if not sitename_to_goals[sitename]?
        sitename_to_goals[sitename] = []
      sitename_to_goals[sitename].push goal_info
    list_of_sites_and_goals = []
    list_of_sites = prelude.sort Object.keys(sitename_to_goals)
    
    for sitename in list_of_sites
      current_item = {sitename: sitename}
      current_item.goals = prelude.sort-by (.name), sitename_to_goals[sitename]
      
      for goal in current_item.goals
        goal.enabled = (enabled_goals[goal.name] == true)
      list_of_sites_and_goals.push current_item
    self.sites_and_goals = list_of_sites_and_goals
    do !->>
      goal_name_to_icon_changed = false
      goal_name_to_new_icon_promises = {}
      for sitename_and_goals in list_of_sites_and_goals
        for goal_info in sitename_and_goals.goals
          if not goal_info.icon?
            goal_name_to_new_icon_promises[goal_info.name] = get_favicon_data_for_domain_cached(goal_info.domain)
            goal_name_to_icon_changed = true
      if goal_name_to_icon_changed
        goal_name_to_new_icons = await promise_all_object goal_name_to_new_icon_promises
        for goal_name,icon of goal_name_to_new_icons
          if not icon?
            icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
          self.goal_name_to_icon[goal_name] = icon
        self.goal_name_to_icon = JSON.parse JSON.stringify self.goal_name_to_icon
    return
    
    /*await this.get_daily_targets!
    
    for sitename in list_of_sites
      current_item = {sitename: sitename}
      current_item.goals = prelude.sort-by (.name), sitename_to_goals[sitename]

      for goal in current_item.goals
        goal.enabled = (enabled_goals[goal.name] == true)
        goal.number = this.index_of_daily_goal_mins[goal.name]
        
      list_of_sites_and_goals.push current_item
    self.sites_and_goals = list_of_sites_and_goals

 
  goal_changed: (evt) ->
    
    checked = evt.target.checked    
    console.log evt.target.goalname
    goal_name = evt.target.goal.name */

  /*add_custom: (evt) ->
  console.log 'add custom site.'*/

  image_clicked: (evt) ->>
    goal_name = evt.target.goalname
    checked = evt.target.checked

    self = this
    if not checked
      await set_goal_enabled_manual goal_name
      
      check_if_first_goal = ->>       
        if !localStorage.first_goal?
          localStorage.first_goal = 'has enabled a goal before'
          #add_toolbar_notification!

          # await load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
          # try
          #   await swal {
          #     title: 'You set a goal!'
          #     text: 'HabitLab will use its algorithms to try different interventions on your webpages, and intelligently figure out what works best for you. You can manually tinker with settings if you\'d like.'
          #     type: 'success'
          #     confirmButtonText: 'See it in action'
          #   }
            
          #   set_override_enabled_interventions_once('facebook/show_user_info_interstitial')
          #   all_goals = await get_goals()
          #   goal_info = all_goals[goal_name]
          #   chrome.tabs.create {url: goal_info.homepage }
          # catch
          #   console.log 'failure'
      check_if_first_goal!
    else
      await set_goal_disabled_manual goal_name
    # await this.disable_interventions_which_do_not_satisfy_any_goals(goal_name)
    # if checked
    #   await enable_interventions_because_goal_was_enabled(goal_name)
    
    await self.set_sites_and_goals()
    self.fire 'goal_changed', {goal_name: goal_name}

  





  should_have_newline: (index, num_per_line) ->
    return (index % num_per_line) == 0 
  sort_custom_sites_after_and_limit_to_eight: (sites_and_goals) ->
    return this.sort_custom_sites_after(sites_and_goals)[0 til 8]
  sort_custom_sites_after: (sites_and_goals) ->
    [custom_sites_and_goals,normal_sites_and_goals] = prelude.partition (-> it.goals.filter((.custom)).length > 0), sites_and_goals
    return normal_sites_and_goals.concat custom_sites_and_goals
  add_goal_clicked: (evt) ->
    this.add_custom_website_from_input()
    return
  
  configure_clicked: (evt) ->
    newtab = evt.target.sitename_printable.toLowerCase()
    goal_description = evt.target.goal_description
    is_enabled = evt.target.is_enabled
    if not is_enabled
      swal {
        title: 'Enable goal to configure it'
        html: $('<div>').append([
          $('<div>').text('Please enable the goal:')
          $('<div>').text(goal_description)
        ])
      }
      return
    this.fire 'need_tab_change', {newtab: newtab}
  remove_clicked: (evt) ->>
    goal_name = evt.target.goal_name
    is_custom = evt.target.is_custom
    if is_custom
      await remove_custom_goal_and_generated_interventions goal_name
      await this.set_sites_and_goals()
      this.fire 'need_rerender', {}
      return
    goal_description = evt.target.goal_description
    swal {
      title: 'Built-in goal disabled but not removed'
      html: $('<div>').append([
        $('<div>').text('The goal you selected is built-in, so it has been disabled, but not removed:')
        $('<div>').text(goal_description)
      ])
    }
    await set_goal_disabled_manual goal_name
    await this.set_sites_and_goals()
    this.fire 'need_rerender', {}

  add_custom_website_from_input: ->>
    domain = url_to_domain(this.$$('#add_website_input').value.trim())
    if domain.length == 0
      return
    #this.$$('#add_website_input').value = ''
    #console.log 'checkpoint 1'
    canonical_domain = domain
    #canonical_domain = await get_canonical_domain(domain)
    #console.log 'checkpoint 2'
    # if not canonical_domain?
    #   swal {
    #     title: 'Invalid Domain'
    #     html: $('<div>').append([
    #       $('<div>').text('You entered an invalid domain: ' + domain)
    #       $('<div>').text('Please enter a valid domain such as www.amazon.com')
    #     ])
    #     type: 'error'
    #   }
    #   return
    #console.log 'checkpoint 3'
    #if domain != canonical_domain and domain.replace('www.', '') != canonical_domain and canonical_domain.replace('www.', '') != domain
    #  await add_enable_custom_goal_reduce_time_on_domain(domain)
    #console.log 'checkpoint 4'
    #await add_enable_custom_goal_reduce_time_on_domain(canonical_domain)
    #console.log 'checkpoint 5'
    goal_name = await add_enable_custom_goal_increase_time_on_domain(domain)
    await this.set_sites_and_goals()
    #console.log 'checkpoint 6'
    this.fire 'need_rerender', {}
    #this.goal_name_to_icon[goal_name] = await get_favicon_data_for_domain_cached(domain)
    #this.goal_name_to_icon = JSON.parse JSON.stringify this.goal_name_to_icon
    #console.log 'checkpoint 7'
    return
  repaint_due_to_resize_once_in_view: ->
    self = this
    leftmost = null
    rightmost = null
    rightmost_without_width = null
    for icon in this.SM('.siteicon')
      width = $(icon).width()
      left = $(icon).offset().left
      right = left + width
      if (leftmost == null) or left < leftmost
        leftmost = left
      if (rightmost == null) or right > rightmost
        rightmost = right
      if (rightmost_without_width == null) or left > rightmost_without_width
        rightmost_without_width = left
    if leftmost == rightmost_without_width == 0
      # is not on screen
      setTimeout ->
        self.repaint_due_to_resize_once_in_view()
      , 100
    else
      self.repaint_due_to_resize()
  repaint_due_to_resize: ->
    self = this
    leftmost = null
    rightmost = null
    rightmost_without_width = null
    for icon in this.SM('.siteicon')
      width = $(icon).width()
      left = $(icon).offset().left
      right = left + width
      if (leftmost == null) or left < leftmost
        leftmost = left
      if (rightmost == null) or right > rightmost
        rightmost = right
      if (rightmost_without_width == null) or left > rightmost_without_width
        rightmost_without_width = left
    if leftmost == rightmost_without_width == 0
      # is not on screen
      return
    total_width = $(self).width()
    margin_needed = ((total_width - (rightmost - leftmost)) / 2) - 15
    parent_offset = $(self).offset()
    orig_offset = this.S('.flexcontainer').offset()
    this.S('.flexcontainer').offset({left: margin_needed + parent_offset.left, top: orig_offset.top})
  attached: ->>
    self = this
    load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
    self.on_resize '#outer_wrapper', ->
      self.repaint_due_to_resize()
    #fetch history for suggested sites in intervention settings 
    this.baseline_time_on_domains = await get_baseline_time_on_domains()
    baseline_time_on_domains_array = []
    #console.log('started fetching favicons')
    #domain_to_favicon = await get_favicon_data_for_domains_bulk(Object.keys(this.baseline_time_on_domains))
    #for domain,time of this.baseline_time_on_domains
      #favicon_data = domain_to_favicon[domain] #await get_favicon_data_for_domain(domain)
      #baseline_time_on_domains_array.push({
      #  domain: domain
      #  #time: time
      #  #favicon: favicon_data
      #})
    #console.log('finished fetching favicons')
    #this.baseline_time_on_domains_array = baseline_time_on_domains_array
    this.baseline_time_on_domains_array = Object.keys(this.baseline_time_on_domains)
    self.once_available '.siteiconregular' ->
      self.repaint_due_to_resize()

}, [
  {
    source: require 'libs_common/localization_utils'
    methods: [
      'msg'
    ]
  }
  {
    source: require 'libs_frontend/polymer_methods'
    methods: [
      'text_if'
      'once_available'
      'S'
      'SM'
    ]
  }
  {
    source: require 'libs_frontend/polymer_methods_resize'
    methods: [
      'on_resize'
    ]
  }
]