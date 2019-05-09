Polymer({
  is: 'interstitial-screen-choose-difficulty-v5',
  doc: 'A screen that asks users to choose the difficulty of intervention they want this visit.',
  properties: {
    seconds_remaining: {
      type: Boolean,
      value: 10,
    },
    have_counter: {
      type: Boolean,
      value: false,
      observer: 'have_counter_changed',
    },
    asknext_strategy: {
      type: String,
      value: '',
    },
    counter_started: {
      type: Boolean,
      value: false,
    },
    difficulty_chosen_before_asknext: {
      type: String,
      value: '',
    },
    difficulty_already_chosen: {
      type: Boolean,
      value: false,
    },
  },
  ready: function() {
    let self = this
    this.$$('#sample_toast').show()
    /*
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
    */
  },
  have_counter_changed: function(have_counter) {
    let self = this
    if (have_counter && this.counter_started == false) {
      this.counter_started = true
      let interval = setInterval(function() {
        if (self.difficulty_already_chosen) {
          clearInterval(interval)
          return
        }
        if (self.seconds_remaining <= 0) {
          return
        }
        self.seconds_remaining -= 1
        if (self.seconds_remaining == 0) {
          clearInterval(interval)
          if (!self.difficulty_already_chosen) {
            self.choose_random()
          }
        }
      }, 1000)
    }
  },
  difficulty_chosen: function(evt) {
    /*
    let difficulty = evt.target.getAttribute('difficulty')
    this.fire('difficulty_chosen', {difficulty: difficulty, is_random: false})
    this.$$('#sample_toast').hide()
    */
    this.difficulty_already_chosen = true
    let difficulty = evt.target.getAttribute('difficulty')
    let have_counter = this.have_counter
    let asknext_strategy = this.asknext_strategy
    if (asknext_strategy == 'survey') {
      this.$$('#block_container').style.display = 'none'
      this.$$('#secondpart').style.display = 'block'
      this.difficulty_chosen_before_asknext = difficulty
    } else {
      this.$$('#sample_toast').hide()
      if (asknext_strategy == 'day') {
        this.fire('asknext_auto', {
          difficulty: difficulty,
          is_random: false,
          have_counter: have_counter,
          asknext: 'day',
          asknext_strategy: asknext_strategy,
          asknext_time: Date.now() + 24*3600*1000,
        })
      } else if (asknext_strategy == 'nextvisit') {
        this.fire('asknext_auto', {
          difficulty: difficulty,
          is_random: false,
          have_counter: have_counter,
          asknext: 'nextvisit',
          asknext_strategy: asknext_strategy,
          asknext_time: Date.now(),
        })
      }
    }
    this.fire('difficulty_chosen', {
      difficulty: difficulty,
      is_random: false,
      have_counter: have_counter,
      asknext_strategy: asknext_strategy,
    })
  },
  asknext_chosen: function(evt) {
    let difficulty = this.difficulty_chosen_before_asknext
    let have_counter = this.have_counter
    let asknext = evt.target.getAttribute('asknext')
    let asknext_strategy = this.asknext_strategy
    let curtime = Date.now()
    let asknext_time = curtime
    if (asknext_time == 'nextvisit') {
      asknext_time = curtime
    }
    if (asknext == 'hour') {
      asknext_time = curtime + 3600*1000
    } else if (asknext == 'day') {
      asknext_time = curtime + 24*3600*1000
    } else if (asknext == 'week') {
      asknext_time = curtime + 7*24*3600*1000
    }
    this.fire('asknext_chosen', {
      difficulty: difficulty,
      is_random: false,
      have_counter: have_counter,
      asknext: asknext,
      asknext_strategy: asknext_strategy,
      asknext_time: asknext_time,
    })
    this.$$('#sample_toast').hide()
  },
  choose_random: function(evt) {
    if (this.difficulty_already_chosen) {
      return
    }
    this.difficulty_already_chosen = true
    let difficulty_options = ['nothing', 'easy', 'medium', 'hard']
    let difficulty = difficulty_options[Math.floor(difficulty_options.length * Math.random())]
    let have_counter = this.have_counter
    let asknext_strategy = this.asknext_strategy
    this.fire('difficulty_chosen', {
      difficulty: difficulty,
      is_random: true,
      have_counter: have_counter,
      asknext_strategy: asknext_strategy,
    })
    this.$$('#sample_toast').hide()
  }
});

