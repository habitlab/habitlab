const {polymer_ext} = require('libs_frontend/polymer_utils');
const {log_action} = require('libs_frontend/intervention_log_utils')
const {
  get_goal_info,
  get_random_uncompleted_positive_goal
} = require('libs_common/goal_utils')
const {get_intervention} = require('libs_common/intervention_info')
const {get_intervention_info} = require('libs_common/intervention_utils')

polymer_ext({
  is: 'call-to-action-button',
  properties: {
    goal: {
      type: Object,
      observer: 'goalChanged'
    },
    buttonText: {
      type: String,
      computed: 'computeButtonText(goal)'
    }
  },
  ready: async function() {
    console.log('hi!')
    this.goal = await get_random_uncompleted_positive_goal()
    console.log(this.goal)
    if (this.goal == null) {
      let goal_name = get_intervention().goals[0]
      this.goal = await get_goal_info(goal_name)
    }

    console.log('ready called in call-to-action')
    if (this.goal == null) {
      let goal_name = get_intervention().goals[0]
      this.goal = await get_goal_info(goal_name)
    }
   
    console.log('selected goal: ' + this.goal)
    if (document.querySelectorAll('.habitlab_reward_display').length == 0) {
      let reward_display = document.createElement('reward-display')
      reward_display.classList.add('habitlab_reward_display')
      reward_display.no_autoclose = this.goal.is_positive
      reward_display.url_of_next_page = this.goal.domain
      document.body.appendChild(reward_display)
    }
  },
  buttonClicked: function() {
    console.log('buttonClicked called')
    if (this.goal.is_positive) {
      log_action({'positive': 'positive-goal-site-button clicked'})
    } else {
      log_action({'positive': 'close-tab-button clicked'})
    }
    for (var reward_display of document.querySelectorAll('.habitlab_reward_display')) {
      if (typeof(reward_display.play) == 'function') {
        reward_display.play()
        break
      }
    }
  },
  goalChanged: function(newGoal, oldGoal) {
    for (var reward_display in document.querySelectorAll('.habitlab_reward_display')) {
      reward_display.no_autoclose = newGoal.is_positive
      reward_display.url_of_next_page = newGoal.domain
      break
    }
  },
  computeButtonText: function(goal) {
    if (goal.call_to_action != null) {
      // Should be max 21 characters
      return goal.call_to_action
    } else if (!goal.is_positive) {
      var sitename_printable = get_intervention().sitename_printable
      return "Close " + sitename_printable
    } else {
      // Positive goal with no call to action text set -> just use its description for now
      return goal.description
    }
  }
});