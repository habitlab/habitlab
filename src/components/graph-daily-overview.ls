{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{
  get_progress_on_enabled_goals_today
  get_progress_on_goal_today
} = require 'libs_backend/goal_progress'

{  
  get_goals
} = require 'libs_backend/goal_utils'

{cfy} = require 'cfy'

require! {
  async
}

require! {
  prelude
}

polymer_ext {
  is: 'graph-daily-overview'
  properties: {
  }
  ready: cfy ->*
    self = this
    
    #MARK: Daily Overview Graph
    goalsDataToday = yield get_progress_on_enabled_goals_today()
    goalKeys = Object.keys(goalsDataToday)
    
    goal_name_to_info = yield get_goals()
    results = [goal_info for goal_name,goal_info of goal_name_to_info]

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
