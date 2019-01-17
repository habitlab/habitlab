const {
  get_intervention, 
} = require('libs_common/intervention_info')

Polymer({
  is: 'interstitial-screen-choose-difficulty-v2',
  doc: 'A screen that asks users to choose the difficulty of intervention they want this visit.',
  properties: {
    sitename: {
      type: String,
      value: get_intervention().sitename_printable
    }
  },
  difficulty_chosen: function(evt) {
    let difficulty = evt.target.getAttribute('difficulty')
    this.fire('difficulty_chosen', {difficulty: difficulty})
  },
});

