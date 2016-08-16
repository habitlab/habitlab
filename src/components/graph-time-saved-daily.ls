{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{
  get_enabled_goals  
} = require 'libs_backend/goal_utils'

{
  get_interventions
  get_effectiveness_of_all_interventions_for_goal
} = require 'libs_backend/intervention_utils'

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
  is: 'graph-time-saved-daily'
  properties: {
  }
  ready: cfy ->*
    self = this
    
    #MARK: Time saved daily due to interventions Graph  
    enabledGoals = yield get_enabled_goals()
    enabledGoalsKeys = Object.keys(enabledGoals)

    #Retrieves the number of impressions for each enabled intervention        
    time_saved_on_enabled_goals = []
    for item in enabledGoalsKeys
      enabledGoalsResults = yield get_effectiveness_of_all_interventions_for_goal(item)
      time_saved_on_enabled_goals.push(enabledGoalsResults)

    #Retrieves intervention names and values
    control = [] #for now, control is the max value 
    interventions_list = []
    intervention_progress = []
    for item in time_saved_on_enabled_goals
      for key,value of item

        #only push not-empty interventions
        if !isNaN value.progress
          intervention_progress.push value.progress
          interventions_list.push key

          if value.progress > control
            control = value.progress

    for i from 0 to intervention_progress.length - 1 by 1
      intervention_progress[i] = control - intervention_progress[i]    

    #Retrieves all intervention descriptions
    intervention_descriptions = yield get_interventions()

    #Retrieves necessary intervention descriptions
    intervention_descriptions_final = []
    for item in interventions_list
      intervention_descriptions_final.push(intervention_descriptions[item].description)

    self.timeSavedData = {
      labels: intervention_descriptions_final
      datasets: [
        {
          label: "Today",
          backgroundColor: "rgba(27,188,155,0.5)",
          borderColor: "rgba(27,188,155,1)",
          borderWidth: 1,
          data: [Math.round(v*10)/10 for k, v of intervention_progress]

        }
      ]
    }
    self.timeSavedOptions = {
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
