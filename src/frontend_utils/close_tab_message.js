const $ = require('jquery')

function show_reward_display() {
  $('reward-display-toast').remove()
  let reward_display = $('<reward-display-toast>')
  reward_display[0].seconds_saved = window.reward_display_seconds_saved
  $('body').append(reward_display)
  reward_display[0].show()
  reward_display[0].play()
}

if (!window.close_tab_message_loaded) {
  window.close_tab_message_loaded = true
  window.Polymer = window.Polymer || {};
  window.Polymer.dom = 'shadow';
  require('enable-webcomponents-in-content-scripts')
  require('components/reward-display-toast.deps')
}

show_reward_display()
