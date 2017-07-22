const $ = require('jquery');

const {
  printable_time_spent_long
} = require('libs_common/time_utils')

const {
  get_seconds_spent_on_current_domain_today
} = require('libs_common/time_spent_utils');

Polymer({
  is: 'show-timer-banner',
  ready: function() {
    let self = this
    let is_shown = true
    let update_time = function() {
      get_seconds_spent_on_current_domain_today().then(function(seconds_spent) {
        self.duration = printable_time_spent_long(seconds_spent)
      });
    }
    update_time()
    setInterval(update_time, 1000)
    $(document).mousemove(function(evt) {
      let messagediv_offset = $(self.$.messagediv).offset()
      let min_x = messagediv_offset.left
      let min_y = messagediv_offset.top
      let max_x = min_x + $(self.$.messagediv).width()
      let max_y = min_y + $(self.$.messagediv).height()
      let x = evt.clientX
      let y = evt.clientY
      let prev_is_shown = is_shown
      if (min_x <= x && x <= max_x && min_y <= y && y <= max_y) {
        is_shown = false
      } else {
        is_shown = true
      }
      if (prev_is_shown != is_shown) {
        if (is_shown) {
          $(self.$.messagediv).css({
            opacity: 1
          })
        } else {
          $(self.$.messagediv).css({
            opacity: 0
          })
        }
      }
    })
  }
})