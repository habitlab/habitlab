{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{
  get_enabled_goals  
  get_goals
} = require 'libs_backend/goal_utils'

{
  get_baseline_time_on_domain
} = require 'libs_backend/history_utils'

{cfy} = require 'cfy'

require! {
  async
}

require! {
  prelude
}

polymer_ext {
  is: 'graph-chrome-history'
  properties: {
  }
  ready: cfy ->*
    self = this
    
    #MARK: Chrome History Graph
    goalsHistory = yield get_goals()
    enabledGoalsHistory = yield get_enabled_goals()

    #Retrieves urls associated with each enabled intervention
    intervention_urls = []
    for key, value of enabledGoalsHistory
      goal = goalsHistory[key]
      intervention_urls.push goal.domain

    intervention_time_spent = []
    for item in intervention_urls
      temp = yield get_baseline_time_on_domain(item)
      intervention_time_spent.push(Math.round(10*temp / (60*1000))/10)

    self.chromeHistoryData = {
      labels: intervention_urls
      datasets: [
        {
          label: "Today",
          backgroundColor: "rgba(27,188,155,0.5)",
          borderColor: "rgba(27,188,155,1)",
          borderWidth: 1,
          data: intervention_time_spent

        }
      ]
    }
    self.chromeHistoryOptions = {
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
