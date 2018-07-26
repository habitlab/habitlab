//alert('this is the suggest goal prompt')
//console.log('goal suggestion show running')


const $ = require('jquery')

function show_goal_suggestion() {
  $('habitlab-goal-suggestion').remove()
  let goal_suggestion = $('<habitlab-goal-suggestion>')
  $('body').append(goal_suggestion)
  goal_suggestion[0].show()
  //console.log('goal suggestion show working')
  /*
  reward_display[0].intervention_info = window.reward_display_intervention_info
  reward_display[0].goal_info = window.reward_display_goal_info
  reward_display[0].seconds_saved = window.reward_display_seconds_saved
  reward_display[0].seconds_spent = window.reward_display_seconds_spent
  reward_display[0].baseline_seconds_spent = window.reward_display_baseline_seconds_spent
  $('body').append(reward_display)
  reward_display[0].show()
  reward_display[0].play()
  */
}


if (!window.suggest_goal_prompt_loaded) {
  //if (window.Polymer == null) {
  window.suggest_goal_prompt_loaded = true
  window.Polymer = window.Polymer || {};
  window.Polymer.dom = 'shadow';
  require('enable-webcomponents-in-content-scripts')
  //require('components/reward-display-toast.deps')
  require('components/habitlab-goal-suggestion.deps')
  show_goal_suggestion()
}

