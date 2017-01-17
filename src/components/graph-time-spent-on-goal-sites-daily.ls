{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{
  get_enabled_goals  
  get_goals
} = require 'libs_backend/goal_utils'

{
  as_array
} = require 'libs_common/collection_utils'

{
  get_progress_on_enabled_goals_today
} = require 'libs_backend/goal_progress'

{cfy} = require 'cfy'

polymer_ext {
  is: 'graph-time-spent-on-goal-sites-daily'
  properties: {
  }
  ready: cfy ->*
    self = this
    
    goals = yield get_goals()
    enabled_goals = yield get_enabled_goals()

    goal_to_progress = yield get_progress_on_enabled_goals_today()
    labels = []
    time_spent = []
    for goal_name in as_array(enabled_goals)
      minutes_spent = goal_to_progress[goal_name].progress
      if isNaN minutes_spent
        continue
      goal_domain = goals[goal_name].sitename_printable
      labels.push goal_domain
      time_spent.push minutes_spent

    self.chromeHistoryData = {
      labels: labels
      datasets: [
        {
          label: "Today",
          backgroundColor: "rgba(27,188,155,0.5)",
          borderColor: "rgba(27,188,155,1)",
          borderWidth: 1,
          data: time_spent

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
