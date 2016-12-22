{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

{
  get_goal_info
} = require 'libs_backend/goal_utils'

{
  get_interventions
  list_enabled_interventions_for_goal
  get_seconds_saved_per_session_for_each_intervention_for_goal
} = require 'libs_backend/intervention_utils'

{cfy} = require 'cfy'

require! {
  async
}

require! {
  prelude
}

polymer_ext {
  is: 'graph-intervention-effectiveness-comparison'
  properties: {
    goal_name: {
      type: String
      observer: 'goal_name_changed'
    }
    goal_info: {
      type: Object
      observer: 'goal_info_changed'
    }
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
  }
  isdemo_changed: (isdemo) ->
    if isdemo
      this.goal_name = 'facebook/spend_less_time'
  goal_name_changed: cfy ->*
    this.goal_info = yield get_goal_info(this.goal_name)
  goal_info_changed: cfy ->*
    self = this

    all_interventions = yield get_interventions()
    enabled_interventions = yield list_enabled_interventions_for_goal(self.goal_info.name)
    intervention_to_seconds_saved = yield get_seconds_saved_per_session_for_each_intervention_for_goal(self.goal_info.name)

    minutes_saved_list = []
    intervention_description_list = []

    for intervention_name in enabled_interventions
      seconds_saved = intervention_to_seconds_saved[intervention_name]
      if isNaN seconds_saved
        continue
      minutes_saved = seconds_saved / 60
      if minutes_saved < 0
        minutes_saved = 0
      intervention_info = all_interventions[intervention_name]
      intervention_description = intervention_info.description
      intervention_description_list.push intervention_description
      minutes_saved_list.push minutes_saved
      

    #displays onto the graph
    self.interventionFreqData = {
      #labels: seenInterventionsLabels
      labels: intervention_description_list
      datasets: [
        {
          label: "Minutes saved per visit",
          backgroundColor: "rgba(65,131,215,0.5)",
          borderColor: "rgba(65,131,215,1)",
          borderWidth: 1,
          data: minutes_saved_list
        }
      ]
    }

    self.interventionFreqOptions = {
      legend: {
        display: false
      }
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Minutes saved per visit'
          },
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

}