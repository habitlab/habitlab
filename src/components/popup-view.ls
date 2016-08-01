{polymer_ext} = require 'libs_frontend/polymer_utils'

{cfy} = require 'cfy'

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
  set_intervention_automatically_managed
  set_intervention_manually_managed
  get_intervention_parameters
  set_intervention_parameter 
  set_intervention_disabled               #for disable functions
  set_intervention_disabled_permanently
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

  isEmpty: ->
    url <- get_active_tab_url()
    #domain = url_to_domain(url)
    enabledInterventions <- list_enabled_interventions_for_location(url)
    if enabledInterventions.length > 0
      return false
    else
      return true

  ready: -> 
    self = this
    url <- get_active_tab_url()
    #domain = url_to_domain(url)
    enabledInterventions <- list_enabled_interventions_for_location(url)
    self.enabledInterventions = enabledInterventions

    self.S('#resultsButton').click(->
      chrome.tabs.create {url: 'options.html'}
    )

    self.S('#goalsButton').click(->
      chrome.tabs.create {url: 'options.html#goals'}
    )

    #MARK: Donut Graph
    a <~ get_seconds_spent_on_all_domains_today()
    sorted = bySortedValue(a)
    #accounts for visiting less than 5 websites
    if sorted.length < 5 
      for i from sorted.length to 4
        sorted.push(["", 0])
    length = sorted.length
    
    self.donutdata = {
      labels: [
          sorted[0][0],
          sorted[1][0],
          sorted[2][0],
          sorted[3][0],
          sorted[4][0]  
      ],
      datasets: [
      {
          data: [Math.round(10*(sorted[0][1]/60))/10, 
                Math.round(10*(sorted[1][1]/60))/10,
                Math.round(10*(sorted[2][1]/60))/10, 
                Math.round(10*(sorted[3][1]/60))/10, 
                Math.round(10*(sorted[4][1]/60))/10
          ],
          backgroundColor: [
              "rgba(65,131,215,0.7)", "rgba(27,188,155,0.7)",
              "rgba(244,208,63,0.7)", "rgba(230,126,34,0.7)",
              "rgba(239,72,54,0.7)"
          ],
          hoverBackgroundColor: [
              "rgba(65,131,215,1)", "rgba(27,188,155,1)",
              "rgba(244,208,63,1)", "rgba(230,126,34,1)",
              "rgba(239,72,54,1)"          
          ]
      }]
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
