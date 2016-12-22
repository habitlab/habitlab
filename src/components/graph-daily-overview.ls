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
    goal_name_to_info = yield get_goals()
    goal_descriptions = []
    minutes_spent_on_sites = []
    for goal_name,progress_info of goalsDataToday
      minutes_spent = progress_info.progress
      if isNaN minutes_spent
        continue
      goal_info = goal_name_to_info[goal_name]
      goal_descriptions.push goal_info.description
      minutes_spent_on_sites.push minutes_spent

    self.goalOverviewData = {
      labels: goal_descriptions
      datasets: [
        {
          label: "Today",
          backgroundColor: "rgba(75,192,192,0.5)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          data: minutes_spent_on_sites
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
