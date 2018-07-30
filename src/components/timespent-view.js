const $ = require('jquery');

const {
  polymer_ext
} = require('libs_frontend/polymer_utils');

const {
  url_to_domain,
} = require('libs_common/domain_utils');

const {
  close_selected_tab
} = require('libs_common/tab_utils')

const {
  get_seconds_spent_on_current_domain_in_current_session
} = require('libs_common/time_spent_utils')

const {
  printable_time_spent_long
} = require('libs_common/time_utils')

polymer_ext({
  is: 'timespent-view',
  properties: {
    site: {
      type: String,
      value: url_to_domain(window.location.href)
    },
    num_seconds_allowed: {
      type: Number,
      value: 30,
    },
    time_spent_on_domain_start: {
      type: Number,
      value: 0,
    },
    time_spent_on_domain_now: {
      type: Number,
      value: 0,
    },
    seconds_remaining: {
      type: Number,
      computed: 'compute_seconds_remaining(num_seconds_allowed, time_spent_on_domain_start, time_spent_on_domain_now)',
    },
    displayText: {
      type: String,
      computed: 'compute_display_text(seconds_remaining)'
    }
  },
  compute_display_text: function(seconds_remaining) {
    return printable_time_spent_long(seconds_remaining) + ' left.'
  },
  compute_seconds_remaining: function(num_seconds_allowed, time_spent_on_domain_start, time_spent_on_domain_now) {
    let time_elapsed = time_spent_on_domain_now - time_spent_on_domain_start
    let time_remaining = num_seconds_allowed - time_elapsed
    if (time_remaining < 0) {
      time_remaining = 0
    }
    return time_remaining
  },
  start: async function(seconds_spent_at_most_recent_start) {
    console.log('in timer start')
    if (this.started) {
      return
    }
    this.started = true
    let self = this
    if (seconds_spent_at_most_recent_start == null) {
      seconds_spent_at_most_recent_start = 0
    }
    self.time_spent_on_domain_start = seconds_spent_at_most_recent_start
    self.time_spent_on_domain_now = await get_seconds_spent_on_current_domain_in_current_session()
    let was_time_remaining_previously_zero = false
    setInterval(async function() {
      console.log(self.time_spent_on_domain_now)
      console.log(self.seconds_remaining)
      console.log(self.displayText)
      self.time_spent_on_domain_now = await get_seconds_spent_on_current_domain_in_current_session()
      if (self.seconds_remaining <= 0) {
        if (!was_time_remaining_previously_zero) {
          was_time_remaining_previously_zero = true
          self.fire('timer-finished', {})
        }
      } else {
        was_time_remaining_previously_zero = false
      }
    }, 1000)
  },
  startTimer: async function(seconds, seconds_spent_at_most_recent_start) {
    console.log('starting timer')
    if (seconds_spent_at_most_recent_start == null) {
      seconds_spent_at_most_recent_start = 0
    }
    this.num_seconds_allowed = seconds
    //let seconds_on_domain = await get_seconds_spent_on_current_domain_in_current_session()
    this.time_spent_on_domain_start = seconds_spent_at_most_recent_start // 0 //seconds_on_domain
    this.time_spent_on_domain_now = this.time_spent_on_domain_start
    this.start(seconds_spent_at_most_recent_start)
  },
});
