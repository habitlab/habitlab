{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{
  get_progress_on_enabled_goals_today
  get_progress_on_goal_today
} = require 'libs_backend/goal_progress'

{  
  getGoalInfo
} = require 'libs_backend/goal_utils'

{cfy} = require 'cfy'

require! {
  async
}

require! {
  prelude
}

polymer_ext {
  is: 'graph-daily-overview-tabs'
  properties: {
  }
  ready: cfy ->*
    self = this
    
    #MARK: Daily Overview Graph
    goalsDataToday = yield get_progress_on_enabled_goals_today()
    goalKeys = Object.keys(goalsDataToday)
    
    results = []
    for item in goalKeys
      results.push yield getGoalInfo(item)

    self.goalOverviewData = {
      labels: results.map (.description)
      datasets: [
        {
          label: "Today",
          backgroundColor: "rgba(75,192,192,0.5)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          data: [Math.round(v.progress*10)/10 for k, v of goalsDataToday]
        }
      ]
    }
    self.goalOverviewOptions = {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Units'
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
