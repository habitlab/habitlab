Polymer({
  is: 'interstitial-screen-choose-difficulty',
  doc: 'A screen that asks users to choose the difficulty of intervention they want this visit.',
  properties: {
  },
  difficulty_chosen: function(evt) {
    let difficulty = evt.target.getAttribute('difficulty')
    this.fire('difficulty_chosen', {difficulty: difficulty})
  },
});

