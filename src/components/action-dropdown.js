
const {
  get_positive_enabled_goals
} = require('libs_common/goal_utils')

const {
  get_goal_info,
  get_positive_goal_info
} = require('libs_common/intervention_info')

const {
  log_action
} = require('libs_frontend/intervention_log_utils')

Polymer({
  is: 'action-dropdown',
  properties: {
    goals: Array,
    label: {
      type: String,
      observer: 'label_changed'
    },
    defaultCallToAction: String
  },
  label_changed: function(newLabel, oldLabel) {
    if (newLabel != null && newLabel.length > 0) {
      // TODO: add or remove no-label-float from the paper dropdown menu.
      // eg something like this.$.paper_dropdown_menu.attr(no-label-float)
    }
  },
  ready: async function() {
    // Populate goals array
    let goals = await get_positive_enabled_goals()
    var goalsList = Object.values(goals)
    goalsList.push(await get_goal_info())
    this.goals = goalsList

    // Pick default option
    var goal = await get_positive_goal_info()
    if (goal == null) {
      goal = await get_goal_info()
    }
    if (goal == null) {
      this.defaultCallToAction = "Close Tab"
    } else {
      this.defaultCallToAction = goal.call_to_action
    }

    // Set up reward display
    if (document.querySelectorAll('.habitlab_reward_display').length == 0) {
      let reward_display = document.createElement('reward-display')
      reward_display.classList.add('habitlab_reward_display')
      document.body.appendChild(reward_display)
    }
  },
  call_to_action_clicked: function(evt) {
    // Pass needed parts of the goal info to the rewards display
    console.log('call_to_action_clicked called')
    let goal = evt.target.goal
    if (goal.is_positive) {
      log_action({'positive': 'positive goal site call-to-action clicked'})
    } else {
      log_action({'positive': 'close tab clicked'})
    }
    for (var reward_display in document.querySelectorAll('.habitlab_reward_display')) {
      reward_display.no_autoclose = goal.is_positive
      if (goal.is_positive) {
        reward_display.url_of_next_page = goal.domain
      }
      if (typeof(reward_display.play) == 'function') {
        console.log('playin')
        reward_display.play()
      } else {
        console.log('not playin')
      }
      break
    }
  }
})