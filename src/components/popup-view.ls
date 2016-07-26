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

  snooze_button_clicked: (evt) ->
    self = this
    intervention = evt.target.intervention
    <- set_intervention_disabled intervention
    #console.log 'done disabling intervention'
    url <- get_active_tab_url()
    #domain = url_to_domain(url)
    enabledInterventions <- list_enabled_interventions_for_location(url)
    self.enabledInterventions = enabledInterventions

  ready: ->
    self = this
    url <- get_active_tab_url()
    #domain = url_to_domain(url)
    enabledInterventions <- list_enabled_interventions_for_location(url)

    self.enabledInterventions = enabledInterventions

    self.S('button').click(->
      chrome.tabs.create {url: 'options.html'}
    )

}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
