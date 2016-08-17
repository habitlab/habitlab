{polymer_ext} = require 'libs_frontend/polymer_utils'

{cfy} = require 'cfy'
{load_css_file} = require 'libs_common/content_script_utils'
{add_log_feedback} = require 'libs_common/log_utils'

const swal = require 'sweetalert2'

{
  get_active_tab_url
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
    }
  }

  temp_disable_button_clicked: (evt) ->
    self = this
    intervention = evt.target.intervention
    <- set_intervention_disabled intervention
    #console.log 'done disabling intervention'
    url <- get_active_tab_url()
    #domain = url_to_domain(url)
    enabledInterventions <- list_enabled_interventions_for_location(url)
    self.enabledInterventions = enabledInterventions

  perm_disable_button_clicked: (evt) ->
    self = this
    intervention = evt.target.intervention
    <- set_intervention_disabled_permanently intervention
    #console.log 'done disabling intervention'
    url <- get_active_tab_url()
    #domain = url_to_domain(url)
    enabledInterventions <- list_enabled_interventions_for_location(url)
    self.enabledInterventions = enabledInterventions

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
    #domain = url_to_domain(url)
    enabledInterventions = yield list_enabled_interventions_for_location(url)
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

}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}

#Sorts array in descending order 
#http://stackoverflow.com/questions/5199901/how-to-sort-an-associative-array-by-its-values-in-javascript
bySortedValue = (obj) ->
  tuples = []
  for key of obj
    tuples.push [key, obj[key]]
  tuples.sort ((a, b) -> if a.1 < b.1 then 1 else if a.1 > b.1 then -1 else 0)
  tuples
