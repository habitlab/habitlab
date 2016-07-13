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

const $ = require('jquery')

polymer_ext {
  is: 'popup-view'
  ready: ->
    self = this
    url <- get_active_tab_url()
    domain = url_to_domain(url)
    enabledInterventions <- list_enabled_interventions_for_location(domain)

    self.S('#enabledInterventions').text(enabledInterventions[0])

    self.S('button').click(->
      chrome.tabs.create {url: 'options.html'}
    )

    if enabledInterventions.length > 1
      for i from 1 to enabledInterventions.length - 1 by 1
        $messageClone = $('#enabledInterventions').clone();
        self.S('#enabledInterventions').text(enabledInterventions[i])
        $('#enabledInterventions').parent().append($messageClone);


}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
