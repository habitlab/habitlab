{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{
  get_seconds_spent_on_current_domain_today     # current domain
  get_seconds_spent_on_all_domains_today        # map for all domains
  get_seconds_spent_on_domain_today             # specific domain
  get_seconds_spent_on_all_domains_days_since_today
  get_seconds_spent_on_domain_all_days
} = require 'libs_common/time_spent_utils'

{
  printable_time_spent
} = require 'libs_common/time_utils'

{
  getGoalInfo
} = require 'libs_backend/goal_utils'

{
  get_progress_on_goal_this_week
} = require 'libs_backend/goal_progress'

{
  reverse
} = require 'prelude'

polymer_ext {
  is: 'goal-progress-view'
  properties: {
    goal: {
      type: String
      #value: 'facebook/spend_less_time'
      observer: 'goalChanged'
    }
  }
  goalChanged: ->
    goal_info <~ getGoalInfo(this.goal)
    goal_progress <~ get_progress_on_goal_this_week(this.goal)
    progress_values = goal_progress.map (.progress)
    progress_labels = [0 til goal_progress.length]
    this.data = {
      labels: reverse progress_labels
      datasets: [
        {
          label: goal_info.progress_description
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          data: reverse progress_values
        }
      ]
    }
    this.options = {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Days Before Current Day'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Minutes'
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
