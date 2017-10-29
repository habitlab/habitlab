const $ = require('jquery')

const {polymer_ext} = require('libs_frontend/polymer_utils')


const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

const {
  get_enabled_interventions,
  get_interventions
} = require('libs_common/intervention_utils')

const {
  get_positive_enabled_goals
} = require('libs_common/goal_utils')

Polymer({
  is: 'wellness-suggestions',
  doc: 'enabled wellness_interventions.',
  properties: {
    wellness_interventions: {
      type: Array,
      value: []
    }
  },
  show_sidebar_button_clicked: function(evt) {
    this.fire('show_sidebar_clicked', {})
    console.log('show sidebar button was clicked')
  },
  get_intervention_icon_url: function(intervention) {
    let url_path
    if (intervention.generic_intervention)
      url_path = 'interventions/'+ intervention.generic_intervention+ '/icon.svg'
    else
      if (intervention.custom == true)
        url_path = 'icons/custom_intervention_icon.svg'
      else
        url_path = 'interventions/'+ intervention.name + '/icon.svg'
    return (chrome.extension.getURL(url_path)).toString()
  },
  ready: async function() {
    let positive_enabled_goals = await get_positive_enabled_goals()
    let enabled_interventions = await get_enabled_interventions()
    let wellness_interventions = []
    let all_interventions = await get_interventions()
    let target_goal = "exercise/more_exercise"
    let interventions = [];
    if (positive_enabled_goals[target_goal]) {
      let goal_info = positive_enabled_goals[target_goal]
      interventions = goal_info.interventions
    }
    console.log('intervention is ')
    console.log(interventions)
    for (let intervention_name of interventions) {
      if (enabled_interventions[intervention_name]) {
        let intervention_info = all_interventions[intervention_name]
        wellness_interventions.push(intervention_info)
      }
    }
    this.wellness_interventions = wellness_interventions
  }
});