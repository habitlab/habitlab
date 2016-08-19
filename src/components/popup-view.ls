 {polymer_ext} = require 'libs_frontend/polymer_utils'

{cfy} = require 'cfy'
{load_css_file} = require 'libs_common/content_script_utils'
{add_log_feedback} = require 'libs_common/log_utils'

const swal = require 'sweetalert2'

{
  get_active_tab_url
  list_currently_loaded_interventions
  get_active_tab_info
  disable_interventions_in_active_tab
} = require 'libs_backend/background_common'

{
  url_to_domain
} = require 'libs_common/domain_utils'

{
  set_intervention_disabled
  list_enabled_interventions_for_location
  set_intervention_disabled_permanently
  get_enabled_interventions
  set_intervention_enabled  

} = require 'libs_backend/intervention_utils'

{
  get_seconds_spent_on_all_domains_today        # map for all domains
} = require 'libs_common/time_spent_utils'

const $ = require('jquery')

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
    html_for_shown_graphs: {
      type: String
      computed: 'compute_html_for_shown_graphs(shownGraphs, blacklist)'
    }
  }

  temp_disable_button_clicked: (evt) ->
    self = this
    intervention = evt.target.intervention
    <- set_intervention_disabled intervention
    url <- get_active_tab_url()
    enabledInterventions <- list_currently_loaded_interventions()
    enabledInterventions = [x for x in enabledInterventions when x != intervention]
    self.enabledInterventions = enabledInterventions
    <- disable_interventions_in_active_tab()

  perm_disable_button_clicked: (evt) ->
    self = this
    intervention = evt.target.intervention
    <- set_intervention_disabled_permanently intervention
    url <- get_active_tab_url()
    enabledInterventions <- list_currently_loaded_interventions()
    enabledInterventions = [x for x in enabledInterventions when x != intervention]
    self.enabledInterventions = enabledInterventions
    <- disable_interventions_in_active_tab()

  is_not_in_blacklist: (graph, blacklist, graphNamesToOptions) ->
    graph = graphNamesToOptions[graph]
    return blacklist[graph] == false

  checkbox_checked_handler: (evt) ->
    self = this
    graph = evt.target.graph
    self.blacklist[self.graphNamesToOptions[graph]] = !evt.target.checked
    self.blacklist = JSON.parse JSON.stringify self.blacklist
    localStorage.blacklist = JSON.stringify self.blacklist

  sortableupdated: (evt) ->
    self = this
    shownGraphs = this.$$('#graphlist_sortable').innerText.split('\n').map((.trim())).filter((x) -> x != '')
    this.shownGraphs = shownGraphs.map((graph_name) -> self.graphNamesToOptions[graph_name])

  compute_html_for_shown_graphs: (shownGraphs, blacklist) ->
    self = this
    shownGraphs = shownGraphs.filter((x) -> !self.blacklist[x])
    return shownGraphs.map((x) -> "<#{x}></#{x}>").join('')

  isEmpty: (enabledInterventions) ->
    return enabledInterventions? and enabledInterventions.length == 0

  submitFeedback: cfy ->*
    if this.feedbackText.length > 0
      feedbackDict = {'feedback': this.feedbackText}
      add_log_feedback feedbackDict
      this.$$('.feedbackform').style.display = "none"
      this.feedbackText = ""
      yield load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
      swal "Thanks for the feedback!", "", "success"

  ready: cfy ->*
    chrome.browserAction.setBadgeText {text: ''}
    chrome.browserAction.setBadgeBackgroundColor {color: ''}
    self = this
    url = yield get_active_tab_url()
    enabledInterventions = yield list_currently_loaded_interventions()
    self.enabledInterventions = enabledInterventions

    self.S('#resultsButton').click(->
      chrome.tabs.create {url: 'options.html'}
    )

    self.S('#goalsButton').click(->
      chrome.tabs.create {url: 'options.html#goals'}
    )

    self.S('#feedbackButton').click( ->
      console.log \feedback_clicked
      if self.$$('.feedbackform').style.display == "block"
        self.$$('.feedbackform').style.display = "none"
      else
        self.$$('.feedbackform').style.display = "block"
    )

    #MARK: Graphs on popup view

    #Map from graph option names to graph polymer component
    graphNamesToOptions = {
      "Goal Website History Graph" : "graph-chrome-history",
      "Daily Overview" : "graph-daily-overview",
      "Donut Graph" : "graph-donut-top-sites",
      "Interventions Deployed Graph" : "graph-num-times-interventions-deployed",
      "Time Saved Due to HabitLab" : "graph-time-saved-daily"
    }
    self.graphNamesToOptions = graphNamesToOptions

    #retrieves blacklist from localstorage; else, initializes default blacklist
    if (localStorage.getItem 'blacklist') isnt null
      blacklist = JSON.parse localStorage.blacklist
    else
      blacklist = {
        "graph-chrome-history" : false, 
        "graph-daily-overview" : true, 
        "graph-donut-top-sites" : true, 
        "graph-num-times-interventions-deployed": true,      
        "graph-time-saved-daily": true
      }
      localStorage.blacklist = JSON.stringify(blacklist)

    self.blacklist = blacklist

    #Graph options shown to user
    graphOptions = ['Goal Website History Graph', 'Daily Overview', 
                    'Donut Graph', 'Interventions Deployed Graph', 
                    'Time Saved Due to HabitLab']
    self.graphOptions = graphOptions 

    shownGraphs = [
      'graph-chrome-history'
      'graph-daily-overview'
      'graph-donut-top-sites'
      'graph-num-times-interventions-deployed'
      'graph-time-saved-daily'
    ]
    self.shownGraphs = shownGraphs

}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}