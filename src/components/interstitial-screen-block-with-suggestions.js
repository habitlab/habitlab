const $ = require('jquery')

const {polymer_ext} = require('libs_frontend/polymer_utils')
const {close_selected_tab} = require('libs_frontend/tab_utils')

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

const {
  get_positive_enabled_goals
} = require('libs_common/goal_utils')

Polymer({
  is: 'interstitial-screen-block-with-suggestions',
  doc: 'A screen that either shows work sites visited today or suggested links to New York Times articles.',
  properties: {
    positive_goals: {
      type: Array,
      value: []
    }
  },
  ready: async function() {
    let positive_enabled_goals = await get_positive_enabled_goals()
    let positive_goals = []
    for (let goal_name of Object.keys(positive_enabled_goals)) {
      let goal_info = positive_enabled_goals[goal_name]
      positive_goals.push(goal_info)
    }
    this.positive_goals = positive_goals
  }
});

