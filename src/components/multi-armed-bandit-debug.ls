{polymer_ext} = require 'libs_frontend/polymer_utils'

{cfy} = require 'cfy'

{
  train_multi_armed_bandit_for_goal
  get_next_intervention_to_test_for_goal
} = require 'libs_backend/multi_armed_bandit'

polymer_ext {
  is: 'multi-armed-bandit-debug'
  properties: {
    goal: {
      type: String
      value: 'facebook/spend_less_time'
      observer: 'goal_changed'
    }
    rewards_info: {
      type: Array
      value: []
    }
    chosen_intervention: {
      type: String
      value: ''
    }
    multi_armed_bandit: {
      type: Object
    }
  }
  goal_changed: cfy ->*
    goal_name = this.goal
    console.log "new goal is #{goal_name}"
    this.multi_armed_bandit = yield train_multi_armed_bandit_for_goal(goal_name)
    console.log this.multi_armed_bandit
    this.update_rewards_info()
  update_rewards_info: ->
    new_rewards_info = []
    for arm in this.multi_armed_bandit.arms
      intervention = arm.reward
      if arm.trials == 0
        average_score = 0
      else
        average_score = arm.wins / arm.trials
      num_trials = arm.trials
      new_rewards_info.push {
        intervention
        average_score
        num_trials
      }
    console.log new_rewards_info
    this.rewards_info = new_rewards_info
  choose_intervention: cfy ->*
    console.log 'choose intervention button clicked'
    goal_name = this.goal
    arm = this.multi_armed_bandit.predict()
    intervention = arm.reward
    this.chosen_intervention = intervention
}
