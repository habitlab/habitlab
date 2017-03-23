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
  get_goal_info
  get_goal_target
} = require 'libs_backend/goal_utils'

{
  get_progress_on_goal_this_week
} = require 'libs_backend/goal_progress'

{
  reverse
} = require 'prelude-ls'

require! {
  moment
}

{
  cfy
} = require 'cfy'

polymer_ext {
  is: 'goal-progress-view'
  properties: {
    goal: {
      type: String
      observer: 'goalChanged'
    }
  }
  goalChanged: cfy (goal) ->*
    goal_info = yield get_goal_info(goal)
    goal_progress = yield get_progress_on_goal_this_week(goal)
    progress_values = goal_progress.map (.progress)
    progress_values = progress_values.map (it) ->
      Math.round(it * 10)/10
    progress_labels = [0 til goal_progress.length]

    progress_labels.forEach ((element, index, array) ->
      array[index] = (moment!.subtract array[index], 'day').format 'ddd MM/D'
      return )

    target = yield get_goal_target this.goal
    goal_data = []
    for i from 0 to progress_values.length
      goal_data.push target
    if this.goal != goal
      return
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
        }, 
        {
          label: 'Daily goal'
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(0,255,0,0.4)",
          borderColor: "rgba(0,255,0,1)",
          pointBorderColor: "rgba(0,255,0,1)",
          pointBackgroundColor: '#00ff00',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(0,255,0,1)",
          pointHoverBorderColor: "rgba(0,255,0,1)",
          data: goal_data
        }
      ]
    }
    this.options = {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Day'
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
