{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{
  get_num_impressions_today
  get_num_actions_today
  get_interventions_seen_today
} = require 'libs_backend/log_utils'

{
  get_interventions
} = require 'libs_backend/intervention_utils'

{cfy} = require 'cfy'

polymer_ext {
  is: 'graph-intervention-effectiveness-comparison-fake'
  properties: {
  }
  ready: ->>
    self = this
    
    #MARK: Num Times Nudges Deployed Graph
    #Retrieves all interventions    
    seenInterventions = await get_interventions_seen_today()

    results = []
    for intv in seenInterventions
      results.push await get_num_impressions_today(intv)

    #Retrieves all intervention descriptions
    interv_descriptions = await get_interventions()

    #Retrieves necessary intervention descriptions
    seenInterventionsLabels = []
    for item in seenInterventions
      seenInterventionsLabels.push(interv_descriptions[item].description)      

    #displays onto the graph
    self.interventionFreqData = {
      #labels: seenInterventionsLabels
      labels: [
        'Hide news feed'
        'Hide comments'
        'Slow down scrolling'
        'Insert timer into feed'
        'Wait before visiting site'
        'Show time spent each visit'
        'Send fake messages to user'
      ]
      datasets: [
        {
          label: "Minutes saved per visit",
          backgroundColor: "rgba(65,131,215,0.5)",
          borderColor: "rgba(65,131,215,1)",
          borderWidth: 1,
          data: [
            0.8
            0.57
            0.54
            0.34
            0.25
            0.18
            0.13
          ]
          #data: results
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

}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
