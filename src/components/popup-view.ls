{polymer_ext} = require 'libs_frontend/polymer_utils'

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
  set_intervention_enabled
  set_intervention_disabled
  set_intervention_automatically_managed
  set_intervention_manually_managed
  get_intervention_parameters
  set_intervention_parameter
} = require 'libs_backend/intervention_utils'

const $ = require('jquery')
{cfy} = require 'cfy'

polymer_ext {
  is: 'popup-view'
  properties: {
    enabledInterventions: {
      type: Array
    }
  }

  ready: ->
    self = this
    url <- get_active_tab_url()
    #domain = url_to_domain(url)
    enabledInterventions <- list_enabled_interventions_for_location(url)
    if enabledInterventions.length === 0
      enabledInterventions[0] = "None"

    self.enabledInterventions = enabledInterventions

    self.S('button').click(->
      chrome.tabs.create {url: 'options.html'}
    )

  temporarily_disable: cfy (evt) ->*
    this.enabled = false
    prev_enabled_interventions = yield get_enabled_interventions()
    intervention_name = this.intervention.name
    yield set_intervention_disabled intervention_name
    add_log_interventions {
      type: 'intervention_temporarily_disabled'
      manual: true
      intervention_name: intervention_name
      prev_enabled_interventions: prev_enabled_interventions
    }    

}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
