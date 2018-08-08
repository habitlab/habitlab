const $ = require('jquery')

function show_reward_display() {
  //$('reward-display-toast').remove()
  //let reward_display = $('<reward-display-toast>')
  $('habitlab-intervention-feedback').remove()
  let reward_display = $('<habitlab-intervention-feedback>')
  reward_display[0].intervention_info = window.reward_display_intervention_info
  $('body').append(reward_display)
  reward_display[0].show()
}

if (!window.close_tab_message_loaded) {
  window.close_tab_message_loaded = true
  window.Polymer = window.Polymer || {};
  window.Polymer.dom = 'shadow';
  require('enable-webcomponents-in-content-scripts')
  //require('components/reward-display-toast.deps')
  require('components/habitlab-intervention-feedback.deps')
}

show_reward_display()
