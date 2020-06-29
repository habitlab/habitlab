{polymer_ext} = require 'libs_frontend/polymer_utils'

{load_css_file} = require 'libs_common/content_script_utils'
{add_log_feedback, add_log_interventions, add_log_habitlab_disabled, add_log_habitlab_enabled} = require 'libs_backend/log_utils'

swal_cached = null
get_swal = ->>
  if swal_cached?
    return swal_cached
  swal_cached := await SystemJS.import('sweetalert2')
  return swal_cached

screenshot_utils_cached = null
get_screenshot_utils = ->>
  if screenshot_utils_cached?
    return screenshot_utils_cached
  screenshot_utils_cached := await SystemJS.import('libs_common/screenshot_utils')
  return screenshot_utils_cached

{
  get_active_tab_url
  get_active_tab_id
  list_currently_loaded_interventions
  list_currently_loaded_interventions_for_tabid
  get_active_tab_info
  disable_interventions_in_active_tab
  open_debug_page_for_tab_id
} = require 'libs_backend/background_common'

{
  open_debug_page_for_tab_id
} = require 'libs_backend/debug_console_utils'

{
  url_to_domain
} = require 'libs_common/domain_utils'

{
  set_intervention_disabled
  list_enabled_interventions_for_location
  set_intervention_disabled_permanently
  get_enabled_interventions
  set_intervention_enabled
  get_nonpositive_goals_and_interventions
  list_available_interventions_for_location
  get_interventions
  is_it_outside_work_hours
} = require 'libs_backend/intervention_utils'

{
  get_seconds_spent_on_all_domains_today        # map for all domains
} = require 'libs_common/time_spent_utils'

{
  is_habitlab_enabled
  disable_habitlab
  enable_habitlab
} = require 'libs_common/disable_habitlab_utils'

{
  list_sites_for_which_goals_are_enabled
  list_goals_for_site
  set_goal_enabled
  set_goal_disabled
  add_enable_custom_goal_reduce_time_on_domain
} = require 'libs_backend/goal_utils'

{
  localstorage_getjson
  localstorage_setjson
  localstorage_getbool
  localstorage_setbool
} = require 'libs_common/localstorage_utils'

polymer_ext {
  is: 'popup-view'
  properties: {
    enabledInterventions: {
      type: Array
    },
    feedbackText: {
      type: String,
      notify: true
    },
    graphOptions: {
      type: Array
    },
    shownGraphs: {
      type: Array
    },
    graphNamesToOptions: {
      type: Object
    },
    blacklist: {
      type: Object
    },
    sites: {
      type: Array
    },
    html_for_shown_graphs: {
      type: String
      computed: 'compute_html_for_shown_graphs(shownGraphs, blacklist, sites)'
    },
    selected_tab_idx: {
      type: Number
      value: 0
    },
    selected_graph_tab: {
      type: Number,
      value: 0
    }
    goals_and_interventions: {
      type: Array
      value: []
    }
    intervention_name_to_info: {
      type: Object
      value: {}
    }
    #url_override: {
    #  type: String
    #}
    is_habitlab_disabled: {
      type: Boolean
    }
    visited_instagram: {
      type: Boolean
    }
    intervention: {
      type: Boolean
    }
    post_intervention: {
      type: Boolean
    }
  }

  get_intervention_description: (intervention_name, intervention_name_to_info) ->
    return intervention_name_to_info[intervention_name].description

  noValidInterventions: ->
    return this.goals_and_interventions.length === 0

  temp_disable_button_clicked: (evt) ->>
    self = this
    intervention = evt.target.intervention
    # <- set_intervention_disabled intervention
    prev_enabled_interventions = await get_enabled_interventions()
    tab_info = await get_active_tab_info()
    url = tab_info.url
    enabledInterventions = await list_currently_loaded_interventions_for_tabid(tab_info.id)
    enabledInterventions = [x for x in enabledInterventions when x != intervention]
    self.enabledInterventions = enabledInterventions
    await disable_interventions_in_active_tab()
    this.fire 'disable_intervention'
    add_log_interventions {
      type: 'intervention_set_temporarily_disabled'
      page: 'popup-view'
      subpage: 'popup-view-active-intervention-tab'
      category: 'intervention_enabledisable'
      now_enabled: false
      is_permanent: false
      manual: true
      url: window.location.href
      tab_url: url
      intervention_name: intervention
      prev_enabled_interventions: prev_enabled_interventions
    }
    #swal({
    #  title: 'Disabled!',
    #  text: 'This intervention will be disabled temporarily.'
    #})

  perm_disable_button_clicked: (evt) ->>
    self = this
    intervention = evt.target.intervention
    prev_enabled_interventions = await get_enabled_interventions()
    await set_intervention_disabled_permanently intervention
    tab_info = await get_active_tab_info()
    url = tab_info.url
    enabledInterventions = await list_currently_loaded_interventions_for_tabid(tab_info.id)
    enabledInterventions = [x for x in enabledInterventions when x != intervention]
    self.enabledInterventions = enabledInterventions
    await disable_interventions_in_active_tab()
    this.fire 'disable_intervention'
    add_log_interventions {
      type: 'intervention_set_permanently_disabled'
      page: 'popup-view'
      subpage: 'popup-view-active-intervention-tab'
      category: 'intervention_enabledisable'
      now_enabled: false
      is_permanent: false
      manual: true
      url: window.location.href
      tab_url: url
      intervention_name: intervention
      prev_enabled_interventions: prev_enabled_interventions
    }
    #swal({
    #  title: 'Disabled!',
    #  text: 'This intervention will be disabled permanently.'
    #})

  is_not_in_blacklist: (graph, blacklist, graphNamesToOptions) ->
    graph = graphNamesToOptions[graph]
    return blacklist[graph] == false

  checkbox_checked_handler: (evt) ->
    self = this
    graph = evt.target.graph
    self.blacklist[self.graphNamesToOptions[graph]] = !evt.target.checked
    self.blacklist = JSON.parse JSON.stringify self.blacklist
    localstorage_setjson('popup_view_graph_blacklist', self.blacklist)

  sortableupdated: (evt) ->
    self = this
    shownGraphs = this.$$('#graphlist_sortable').innerText.split('\n').map((.trim())).filter((x) -> x != '')
    this.shownGraphs = shownGraphs.map((graph_name) -> self.graphNamesToOptions[graph_name])

  compute_html_for_shown_graphs: (shownGraphs, blacklist, sites) ->
    self = this
    shownGraphs = shownGraphs.filter((x) -> !self.blacklist[x])


    html = "<div class=\"card-content\">"
    for x in shownGraphs
      if x == 'site-goal-view'
        for site in sites

          html += "<#{x} site=\"#{site}\"></#{x}><br>"
      else
        html += "<#{x}></#{x}><br>"
    html += "</div>"
    return html

  isEmpty: (enabledInterventions) ->
    return enabledInterventions? and enabledInterventions.length == 0

  outside_work_hours: ->
    return is_it_outside_work_hours!

  disable_habitlab_changed: (evt) ->>
    if evt.target.checked
      this.is_habitlab_disabled = true
      disable_habitlab()
      tab_info = await get_active_tab_info()
      loaded_interventions = await list_currently_loaded_interventions_for_tabid(tab_info.id)
      add_log_habitlab_disabled({
        page: 'popup-view',
        reason: 'disable_button_slider_toggle'
        tab_info: tab_info
        url: tab_info?url
        loaded_interventions: loaded_interventions
        loaded_intervention: loaded_interventions[0]
      })
    else
      this.is_habitlab_disabled = false
      enable_habitlab()
      tab_info = await get_active_tab_info()
      loaded_interventions = await list_currently_loaded_interventions_for_tabid(tab_info.id)
      add_log_habitlab_enabled({
        page: 'popup-view',
        reason: 'disable_button_slider_toggle'
        tab_info: tab_info
        url: tab_info?url
        loaded_interventions: loaded_interventions
      })


  post_intervention_click: ->>
    this.post_intervention = false

  enable_habitlab_button_clicked: ->>
    this.is_habitlab_disabled = false
    enable_habitlab()
    tab_info = await get_active_tab_info()
    loaded_interventions = await list_currently_loaded_interventions_for_tabid(tab_info.id)
    add_log_habitlab_enabled({
      page: 'popup-view',
      reason: 'enable_habitlab_big_button_clicked'
      tab_info: tab_info
      loaded_interventions: loaded_interventions
    })

  goal_enable_button_changed: (evt) ->>
    goal = evt.target.goal
    if evt.target.checked
      # is enabling this goal
      if goal.name?
        await set_goal_enabled goal.name
      else
        await add_enable_custom_goal_reduce_time_on_domain goal.domain
      await this.set_goals_and_interventions!
    else
      # is disabling this goal
      await set_goal_disabled goal.name
      await this.set_goals_and_interventions!

  set_goals_and_interventions: ->>
    sites_promise = list_sites_for_which_goals_are_enabled()
    enabledInterventions_promise = list_currently_loaded_interventions()
    intervention_name_to_info_promise = get_interventions()
    all_goals_and_interventions_promise = get_nonpositive_goals_and_interventions()
    url_promise = get_active_tab_url()

    [
      sites
      enabledInterventions
      intervention_name_to_info
      all_goals_and_interventions
      url
    ] = await Promise.all [
      sites_promise
      enabledInterventions_promise
      intervention_name_to_info_promise
      all_goals_and_interventions_promise
      url_promise
    ]

    this.sites = sites
    this.enabledInterventions = enabledInterventions
    this.intervention_name_to_info = intervention_name_to_info

    domain = url_to_domain url

    filtered_goals_and_interventions = all_goals_and_interventions.filter (obj) ->

      return (obj.goal.domain == domain) # and obj.enabled

    if filtered_goals_and_interventions.length == 0
      filtered_goals_and_interventions = [
        {
          enabled: false
          goal: {
            domain: domain
            description: "Spend less time on #{domain}"
          }
        }
      ]
    this.goals_and_interventions = filtered_goals_and_interventions

  get_power_icon_src: ->
    return chrome.extension.getURL('icons/power_button.svg')

  get_thumbs_icon_src:->
    return chrome.extension.getURL('icons/thumbs_i')

  debug_button_clicked: ->>
    tab_id = await get_active_tab_id()
    await open_debug_page_for_tab_id(tab_id)

  submit_feedback_clicked: ->>
    #screenshot_utils = await SystemJS.import('libs_common/screenshot_utils')
    screenshot_utils = await get_screenshot_utils()
    screenshot = await screenshot_utils.get_screenshot_as_base64()
    data = await screenshot_utils.get_data_for_feedback()
    feedback_form = document.createElement('feedback-form')
    document.body.appendChild(feedback_form)
    feedback_form.screenshot = screenshot
    feedback_form.other = data
    feedback_form.open()

  help_icon_clicked: ->>
    await load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
    swal = await get_swal()
    swal {
      title: 'How HabitLab Works'
      html: '''
      HabitLab will help you achieve your goal by showing you a different <i>nudge</i>, like a news feed blocker or a delayed page loader, each time you visit your goal site.
      <br><br>
      At first, HabitLab will show you a random nudge each visit, and over time it will learn what works most effectively for you.
      <br><br>
      Each visit, HabitLab will test a new nudge and measure how much time you spend on the site. Then it determines the efficacy of each nudge by comparing the time spent per visit when that nudge was deployed, compared to when other nudges are deployed. HabitLab uses an algorithmic technique called <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank">multi-armed-bandit</a> to learn which nudges work best and choose which nudges to deploy, to minimize your time wasted online.
      '''
      allowOutsideClick: true
      allowEscapeKey: true
      #showCancelButton: true
      #confirmButtonText: 'Visit Facebook to see an intervention in action'
      #cancelButtonText: 'Close'
    }

  get_new_intervention: ->
    this.post_intervention = false
    this.intervention = true

  postIntervention_button_clicked: ->>
    this.visited_instagram = true
    this.post_intervention = false

  stressInterventionLINK_button_clicked: ->>
    this.visited_instagram = true
    this.intervention = false
    this.post_intervention = true
    chrome.windows.create(url: 'https://www.instagram.com', top: 200px, left: 300px, width:800px, height:900px)
    /*alert("Instagram opened in new window")*/

  translate_onclick: ->>
    this.intervention = false
    this.post_intervention = true
    chrome.windows.create(url: 'https://translate.google.com', top: 200px, left: 300px, width:800px, height:900px)

  futureTrait_onclick: ->>
    this.intervention = false
    this.post_intervention = true
    chrome.windows.create(url: 'https://keep.google.com', top: 200px, left: 300px, width:800px, height:900px)

  facebook_onclick: ->>
    this.intervention = false
    this.post_intervention = true
    chrome.windows.create(url: 'https://www.facebook.com/me', top: 200px, left: 300px, width:800px, height:900px)


  stressInterventionTAB_button_clicked: ->>
    this.intervention = false
    this.post_intervention = true
    chrome.tabs.create(url: 'https://www.instagram.com', active: false)

  covidSurvey_button_clicked: ->
    chrome.tabs.create(url: 'https://qualtrics.com')
  results_button_clicked: ->
    chrome.tabs.create {url: 'options.html#overview'}
  settings_button_clicked: ->
    chrome.tabs.create {url: 'options.html#settings'}
  ready: ->>
    #chrome.browserAction.setBadgeText {text: ''}
    #chrome.browserAction.setBadgeBackgroundColor {color: '#000000'}
    self = this
    is_habitlab_enabled().then (is_enabled) -> self.is_habitlab_disabled = !is_enabled

    #FILTER THIS FOR ONLY THE CURRENT GOAL SITE#
    await this.set_goals_and_interventions!

    have_enabled_custom_interventions = self.enabledInterventions.map(-> self.intervention_name_to_info[it]).filter(-> it?custom).length > 0
    if self.enabledInterventions.length > 0 and (localstorage_getbool('enable_debug_terminal') or have_enabled_custom_interventions)
      self.S('#debugButton').show()

    if self.enabledInterventions.length == 0
      self.selected_tab_idx = 1

    localstorage_setbool('popup_view_has_been_opened', true)

    setTimeout ->>
      require('../bower_components/iron-icon/iron-icon.deps')
      require('../bower_components/iron-icons/iron-icons.deps')
      require('components/graph-donut-top-sites.deps')
      require('components/intervention-view-single-compact.deps')
      require('components/feedback-form.deps')

      await get_screenshot_utils()
      await get_swal()
    , 1

}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
  ]
}
