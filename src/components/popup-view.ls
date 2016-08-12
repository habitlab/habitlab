{polymer_ext} = require 'libs_frontend/polymer_utils'

{cfy} = require 'cfy'
{load_css_file} = require 'libs_common/content_script_utils'
{add_log_feedback} = require 'libs_common/log_utils'

const swal = require 'sweetalert2'

{
  get_enabled_interventions
  list_enabled_interventions_for_location
} = require 'libs_backend/intervention_utils'

{
  get_active_tab_url
} = require 'libs_backend/background_common'

{
  url_to_domain
} = require 'libs_common/domain_utils'

{
  get_enabled_interventions
  get_interventions
  set_intervention_automatically_managed
  set_intervention_manually_managed
  get_intervention_parameters
  set_intervention_parameter 
  set_intervention_disabled               #for disable functions
  set_intervention_disabled_permanently
  set_intervention_enabled  
  get_effectiveness_of_intervention_for_goal  
  get_effectiveness_of_all_interventions_for_goal  
} = require 'libs_backend/intervention_utils'

{
  get_seconds_spent_on_all_domains_today        # map for all domains
} = require 'libs_common/time_spent_utils'

{  
  get_enabled_goals
} = require 'libs_backend/goal_utils'

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

    self.S('#feedbackButton').click(->
      self.$$('.feedbackform').style.display = "block"
    )

    #MARK: Time saved daily due to interventions Graph  
    enabledGoals = yield get_enabled_goals()
    enabledGoalsKeys = Object.keys(enabledGoals)

    #Retrieves the number of impressions for each enabled intervention        
    time_saved_on_enabled_goals = []
    for item in enabledGoalsKeys
      enabledGoalsResults = yield get_effectiveness_of_all_interventions_for_goal(item)
      time_saved_on_enabled_goals.push(enabledGoalsResults)

    #Retrieves intervention names and values
    control = [] #for now, control is the max value 
    interventions_list = []
    intervention_progress = []
    for item in time_saved_on_enabled_goals
      for key,value of item

        #only push not-empty interventions
        if !isNaN value.progress
          intervention_progress.push value.progress
          interventions_list.push key

          if value.progress > control
            control = value.progress

    for i from 0 to intervention_progress.length - 1 by 1
      intervention_progress[i] = control - intervention_progress[i]    

    #Retrieves all intervention descriptions
    intervention_descriptions = yield get_interventions()

    #Retrieves necessary intervention descriptions
    intervention_descriptions_final = []
    for item in interventions_list
      intervention_descriptions_final.push(intervention_descriptions[item].description)

    self.timeSavedData = {
      labels: intervention_descriptions_final
      datasets: [
        {
          label: "Today",
          backgroundColor: "rgba(27,188,155,0.5)",
          borderColor: "rgba(27,188,155,1)",
          borderWidth: 1,
          data: [Math.round(v*10)/10 for k, v of intervention_progress]

        }
      ]
    }
    self.timeSavedOptions = {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Minutes'
          },                            
          ticks: {
            beginAtZero: true
          }
        }]
      }
    } 
    

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
