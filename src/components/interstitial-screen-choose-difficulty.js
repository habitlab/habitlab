const $ = require('jquery')

const {polymer_ext} = require('libs_frontend/polymer_utils')
const {close_selected_tab} = require('libs_frontend/tab_utils')

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

Polymer({
  is: 'interstitial-screen-choose-difficulty',
  doc: 'A screen that asks users to choose the difficulty of intervention they want this visit.',
  properties: {
  },
  difficulty_chosen: function(evt) {
    let difficulty = evt.target.getAttribute('difficulty')
    log_action({'difficulty': difficulty})
    this.fire('difficulty_chosen', {difficulty: difficulty})
  },
});

