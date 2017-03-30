{polymer_ext} = require 'libs_frontend/polymer_utils'

{cfy} = require 'cfy'
{load_css_file} = require 'libs_common/content_script_utils'
{add_log_feedback} = require 'libs_backend/log_utils'
screenshot_utils = require 'libs_common/screenshot_utils'

swal = require 'sweetalert2'

{
  get_active_tab_url
  get_active_tab_id
  list_currently_loaded_interventions
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
  get_goals_and_interventions
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

$ = require 'jquery'

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
    url_override: {
      type: String
    }
    is_habitlab_disabled: {
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
    url = await get_active_tab_url()
    enabledInterventions = await list_currently_loaded_interventions()
    enabledInterventions = [x for x in enabledInterventions when x != intervention]
    self.enabledInterventions = enabledInterventions
    await disable_interventions_in_active_tab()
    this.fire 'disable_intervention' 
    #swal({
    #  title: 'Disabled!',
    #  text: 'This intervention will be disabled temporarily.'
    #})

  perm_disable_button_clicked: (evt) ->>
    self = this
    intervention = evt.target.intervention
    await set_intervention_disabled_permanently intervention
    url = await get_active_tab_url()
    enabledInterventions = await list_currently_loaded_interventions()
    enabledInterventions = [x for x in enabledInterventions when x != intervention]
    self.enabledInterventions = enabledInterventions
    await disable_interventions_in_active_tab()
    this.fire 'disable_intervention'
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

  submitFeedback: ->>
    if this.feedbackText.length > 0
      feedbackDict = {'feedback': this.feedbackText}
      add_log_feedback feedbackDict
      this.$$('.feedbackform').style.display = "none"
      this.feedbackText = ""
      await load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
      swal "Thanks for the feedback!", "", "success"

  outside_work_hours: ->
    return is_it_outside_work_hours!

  disable_habitlab_changed: (evt) ->>
    if evt.target.checked
      this.is_habitlab_disabled = true
      disable_habitlab()
    else
      this.is_habitlab_disabled = false
      enable_habitlab()

  enable_habitlab_button_clicked: ->
    enable_habitlab()
    this.is_habitlab_disabled = false

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
    if this.url_override?
      url = this.url_override
    else
      url = await get_active_tab_url()
    
    domain = url_to_domain url

    all_goals_and_interventions = await get_goals_and_interventions!
    
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
    this.sites = await list_sites_for_which_goals_are_enabled!

  get_power_icon_src: ->
    return chrome.extension.getURL('icons/power_button.svg')

  debug_button_clicked: ->>
    tab_id = await get_active_tab_id()
    await open_debug_page_for_tab_id(tab_id)

  submit_feedback_clicked: ->>
    #screenshot_utils = await SystemJS.import('libs_common/screenshot_utils')
    screenshot = await screenshot_utils.get_screenshot_as_base64()
    data = await screenshot_utils.get_data_for_feedback()
    feedback_form = document.createElement('feedback-form')
    document.body.appendChild(feedback_form)
    feedback_form.screenshot = screenshot
    feedback_form.other = data
    feedback_form.open()

  help_icon_clicked: ->>
    await load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
    swal {
      title: 'How HabitLab Works'
      html: '''
      HabitLab will help you achieve your goal by showing you a different <i>intervention</i>, like a news feed blocker or a delayed page loader, each time you visit your goal site.
      <br><br>
      At first, HabitLab will show you a random intervention each visit, and over time it will learn what works most effectively for you.
      <br><br>
      Each visit, HabitLab will test a new intervention and measure how much time you spend on the site. Then it determines the efficacy of each intervention by comparing the time spent per visit when that intervention was deployed, compared to when other interventions are deployed. HabitLab uses an algorithmic technique called <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank">multi-armed-bandit</a> to learn which interventions work best and choose which interventions to deploy, to minimize your time wasted online.
      '''
      allowOutsideClick: true
      allowEscapeKey: true
      #showCancelButton: true
      #confirmButtonText: 'Visit Facebook to see an intervention in action'
      #cancelButtonText: 'Close'
    }

  ready: ->>
    #chrome.browserAction.setBadgeText {text: ''}
    #chrome.browserAction.setBadgeBackgroundColor {color: '#000000'}
    self = this
    is_habitlab_enabled().then (is_enabled) -> self.is_habitlab_disabled = !is_enabled
    self.intervention_name_to_info = await get_interventions()
   
    #FILTER THIS FOR ONLY THE CURRENT GOAL SITE#
    await this.set_goals_and_interventions!

    enabledInterventions = await list_currently_loaded_interventions()
    self.enabledInterventions = enabledInterventions
    have_enabled_custom_interventions = enabledInterventions.map(-> self.intervention_name_to_info[it]).filter(-> it?custom).length > 0
    if enabledInterventions.length > 0 and (localstorage_getbool('enable_debug_terminal') or have_enabled_custom_interventions)
      self.S('#debugButton').show()

    if self.enabledInterventions.length == 0
      self.selected_tab_idx = 1

    self.S('#resultsButton').click(->
      chrome.tabs.create {url: 'options.html#overview'}
    )

    self.S('#goalsButton').click(->
      chrome.tabs.create {url: 'options.html#settings'}
    )

    /*
    self.S('#feedbackButton').click( ->
      if self.$$('.feedbackform').style.display == "block"
        self.$$('.feedbackform').style.display = "none"
      else
        self.$$('.feedbackform').style.display = "block"
    )
    */

    #MARK: Graphs on popup view

    #Map from graph option names to graph polymer component
    graphNamesToOptions = {
      "Goal Website History Graph" : "graph-time-spent-on-goal-sites-daily",
      "Daily Overview" : "site-goal-view",
      "Donut Graph" : "graph-donut-top-sites",
      "Interventions Deployed Graph" : "graph-num-times-interventions-deployed",
      "Time Saved Due to HabitLab" : "graph-time-saved-daily"
    }
    self.graphNamesToOptions = graphNamesToOptions

    #retrieves blacklist from localstorage; else, initializes default blacklist
    blacklist = localstorage_getjson('popup_view_graph_blacklist')
    if not blacklist?
      blacklist = {
        "graph-time-spent-on-goal-sites-daily" : true, 
        "site-goal-view" : true, 
        "graph-donut-top-sites" : false, 
        "graph-num-times-interventions-deployed": true,      
        "graph-time-saved-daily": true
      }
      localstorage_setjson('popup_view_graph_blacklist', blacklist)

    self.blacklist = blacklist

    #Graph options shown to user
    graphOptions = ['Goal Website History Graph', 'Daily Overview', 
                    'Donut Graph', 'Interventions Deployed Graph', 
                    'Time Saved Due to HabitLab']
    self.graphOptions = graphOptions 

    shownGraphs = [
      'graph-time-spent-on-goal-sites-daily'
      'site-goal-view'
      'graph-donut-top-sites'
      'graph-num-times-interventions-deployed'
      'graph-time-saved-daily'
    ]
    self.shownGraphs = shownGraphs

    localstorage_setbool('popup_view_has_been_opened', true)

}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}