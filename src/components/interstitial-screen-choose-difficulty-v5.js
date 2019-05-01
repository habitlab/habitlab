Polymer({
  is: 'interstitial-screen-choose-difficulty-v5',
  doc: 'A screen that asks users to choose the difficulty of intervention they want this visit.',
  properties: {
    seconds_remaining: {
      type: Number,
      value: 3600,
    }
  },
  ready: function() {
    let self = this
    // let radiogroup = this.$.sample_toast.difficultyradiogroup
    // radiogroup['--paper-radio-button-checked-color'] = 'white'
    // radiogroup.updateStyles()
    let radios = this.querySelectorAll('.difficultyradio')
    for (let x of radios) {
      x.customStyle['--paper-radio-button-checked-color'] = 'white'
      x.customStyle['--paper-radio-button-unchecked-color'] = 'white'
      x.updateStyles()
    }
    this.$$('#sample_toast').show()
    let interval = setInterval(function() {
      if (self.seconds_remaining <= 0) {
        return
      }
      self.seconds_remaining -= 1
      if (self.seconds_remaining == 0) {
        clearInterval(interval)
        self.choose_random()
      }
    }, 1000)
  },
  difficulty_chosen: function(evt) {
    let difficulty = evt.target.getAttribute('difficulty')
    this.fire('difficulty_chosen', {difficulty: difficulty, is_random: false})
    this.$$('#sample_toast').hide()
  },
  choose_random: function(evt) {
    let difficulty_options = ['nothing', 'easy', 'medium', 'hard']
    let difficulty = difficulty_options[Math.floor(difficulty_options.length * Math.random())]
    this.fire('difficulty_chosen', {difficulty: difficulty, is_random: true})
    this.$$('#sample_toast').hide()
  }
});

