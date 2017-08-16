{cfy} = require 'cfy'
prelude = require 'prelude-ls'
$ = require 'jquery'

swal = require 'sweetalert2'


{load_css_file} = require 'libs_common/content_script_utils'

{
  get_enabled_goals
  get_goals
  set_goal_target
  get_goal_target
  remove_custom_goal_and_generated_interventions
  add_enable_custom_goal_reduce_time_on_domain
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
  get_favicon_data_for_domain
  get_favicon_data_for_domains_bulk
} = require 'libs_backend/favicon_utils'

{
  msg
} = require 'libs_common/localization_utils'

{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'initial-goal-selector'
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
    title_text: {
      type: String
      value: msg("HabitLab has come up with suggested sites that you spend the most time on, on average per day.")
    }
    title_text_bolded_portion: {
      type: String
      value: msg("Which sites would you like to spend less time on?")
    }
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
    title: {
      type: String
      value: msg("Let's set some goals.")
    }
    num_per_line: {
      type: Number
      value: 4
    }
    icon_check_url:{
      type: String,
      value: chrome.extension.getURL('icons/icon_check_bluewhite.png') 
    },
    icon_add_url: {
      type: String,
      value: chrome.extension.getURL('icons/plus.png') 
    },
    delete_url: {
      type: String,
      value: chrome.extension.getURL('icons/delete.svg') 
    }
    baseline_time_on_domains: {
      type: Object
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
      return (minutes).toPrecision(2) + 'mins'
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
      title: 'How will HabitLab help me achieve these goals?'
      text: 'HabitLab will help you achieve these goals by showing you a different nudge, like a news feed blocker or a delayed page loader, each time you visit your goal sites. (It will not block the site.)'
    }

  # more_than_zero_minutes: (goal,get_time_spent_for_domain,baseline_time_on_domains) ->    
  #   if baseline_time_on_domains[domain]?
  #     if (baseline_time_on_domains[domain] / (1000*60)) > 0 
  #       return true
  #   return false

  openBy: (evt) ->
    console.log(evt)
    console.log(evt.target)
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
    console.log 'add_website_input'
    console.log(evt)

  # paper_icon_item_clicked: (evt) ->
  #   console.log 'paper_icon_item_clicked'
  #   console.log evt
  #   console.log evt.target.domain
  #   console.log evt.target.getAttribute('domain')
  #   console.log evt.target
  #   domain = this.$$('#add_website_input').value.trim()
  #   console.log(domain)

  valueChange: (evt) ->
    console.log 'valueChange_called'
    console.log evt
    console.log evt.target.domain
    console.log evt.target.getAttribute('domain')
    console.log evt.target
    domain = this.$$('#add_website_input').value.trim()
    console.log(domain)
    this.add_custom_website_from_input()
    console.log('add_custom_website_from_input_called')
    return
  
  settings_goal_clicked: (evt) ->
    evt.preventDefault()
    evt.stopPropagation()
    newtab = evt.target.sitename
    this.fire 'need_tab_change', {newtab: newtab}
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
  image_clicked: (evt) ->>
    console.log 'clicked image:'
    console.log evt.target.goalname
    goal_name = evt.target.goalname
    
    checked = evt.target.checked
    console.log 'checked is'
    console.log checked

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
    #await this.disable_interventions_which_do_not_satisfy_any_goals(goal_name)
    #if checked
    #  await enable_interventions_because_goal_was_enabled(goal_name)
    
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
    console.log('add goal clicked')
    return
  # add_website_input_keydown: ->
  #    console.log('add_website_input_keydown called')
  #    console.log(evt)
  #    if evt.keyCode == 13
  #      # enter pressed
  #      this.add_custom_website_from_input()
  #      return

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
    console.log 'remove_clicked'
    console.log goal_name
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
    console.log(domain)
    if domain.length == 0
      return
    #this.$$('#add_website_input').value = ''
    #console.log 'checkpoint 1'
    canonical_domain = await get_canonical_domain(domain)
    #console.log 'checkpoint 2'
    if not canonical_domain?
      swal {
        title: 'Invalid Domain'
        html: $('<div>').append([
          $('<div>').text('You entered an invalid domain: ' + domain)
          $('<div>').text('Please enter a valid domain such as www.amazon.com')
        ])
        type: 'error'
      }
      return
    #console.log 'checkpoint 3'
    if domain != canonical_domain and domain.replace('www.', '') != canonical_domain and canonical_domain.replace('www.', '') != domain
      await add_enable_custom_goal_reduce_time_on_domain(domain)
    #console.log 'checkpoint 4'
    await add_enable_custom_goal_reduce_time_on_domain(canonical_domain)
    #console.log 'checkpoint 5'
    await this.set_sites_and_goals()
    #console.log 'checkpoint 6'
    this.fire 'need_rerender', {}
    #console.log 'checkpoint 7'
    return
  repaint_due_to_resize_once_in_view: ->
    console.log 'calling repaint_due_to_resize_once_in_view'
    self = this
    leftmost = null
    rightmost = null
    rightmost_without_width = null
    for icon in $('.siteicon')
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
    console.log 'resized!!'
    leftmost = null
    rightmost = null
    rightmost_without_width = null
    for icon in $('.siteicon')
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
    margin_needed = ((total_width - (rightmost - leftmost)) / 2)-15
    $('.flexcontainer').css('margin-left', margin_needed)
    current_offset = this.S('.flexcontainer').offset()
    this.S('.flexcontainer').offset({left: margin_needed, top: current_offset.top})
  attached: ->>
    self = this
    load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
    if self.is_onboarding
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
    console.log(this.baseline_time_on_domains)
    if self.is_onboarding
      self.once_available '.siteiconregular' ->
        console.log 'siteiconregular available 1'
        self.repaint_due_to_resize()
        console.log 'siteiconregular available 2'
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
      'on_resize'
      'once_available'
      'S'
    ]
  }
]