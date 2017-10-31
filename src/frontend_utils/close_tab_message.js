const $ = require('jquery')

function show_reward_display() {
  $('reward-display-toast-voting').remove()
  let reward_display = $('<reward-display-toast-voting>')
  reward_display[0].intervention_info = window.reward_display_intervention_info
  reward_display[0].goal_info = window.reward_display_goal_info
  reward_display[0].seconds_saved = window.reward_display_seconds_saved
  reward_display[0].seconds_spent = window.reward_display_seconds_spent
  reward_display[0].baseline_seconds_spent = window.reward_display_baseline_seconds_spent
  $('body').append(reward_display)
  reward_display[0].show()
  reward_display[0].play()
}

if (!window.close_tab_message_loaded) {
  window.close_tab_message_loaded = true
  window.Polymer = window.Polymer || {};
  window.Polymer.dom = 'shadow';
  require('enable-webcomponents-in-content-scripts')
  require('components/reward-display-toast-voting.deps')
}

show_reward_display()
