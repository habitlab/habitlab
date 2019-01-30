const {
  get_intervention,
  get_goal_info,
} = require('libs_common/intervention_info')

console.log('in interstitital-screen-choose-difficulty-v2')
console.log(get_intervention())

console.log('in interstitital-screen-choose-difficulty-v2')
console.log(get_goal_info())


Polymer({
  is: 'interstitial-screen-choose-difficulty-v2',
  doc: 'A screen that asks users to choose the difficulty of intervention they want this visit.',
  properties: {
    sitename: {
      type: String,
      value: get_goal_info().sitename_printable
    }
  },
  difficulty_chosen: function(evt) {
    let difficulty = evt.target.getAttribute('difficulty')
    this.fire('difficulty_chosen', {difficulty: difficulty})
  },
});

