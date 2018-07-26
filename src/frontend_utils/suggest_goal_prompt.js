//alert('this is the suggest goal prompt')
//console.log('goal suggestion show running')


const $ = require('jquery')

function show_goal_suggestion() {
  $('habitlab-goal-suggestion').remove()
  let goal_suggestion = $('<habitlab-goal-suggestion>')
  $('body').append(goal_suggestion)
  goal_suggestion[0].show()
}

if (!window.suggest_goal_prompt_loaded) {
  window.suggest_goal_prompt_loaded = true
  if (window.Polymer == null) {
    window.Polymer = window.Polymer || {};
    window.Polymer.dom = 'shadow';
    require('enable-webcomponents-in-content-scripts')
  }
  require('components/habitlab-goal-suggestion.deps')
  show_goal_suggestion()
}
