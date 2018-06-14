const $ = require('jquery');
const {
  get_intervention
} = require('libs_common/intervention_info')

Polymer({
  is: 'purpose-banner',
  properties: {
    purpose: {
      type: String,
      value: ""
    },
    sitename_printable: {
      type: String,
      value: (function() {
        let intervention_info = get_intervention()
        if (intervention_info.sitename_printable) {
          return intervention_info.sitename_printable
        }
        return 'this site'
      })()
    }
  },
  ready: function() {
    console.log('banner ready with purpose ' + this.purpose)
    let self = this
    let is_shown = true
    $(document).mousemove(function(evt) {
      let messagediv_offset = $(self.$.purposebannermessagediv).offset()
      let min_x = messagediv_offset.left
      let min_y = 0 // messagediv_offset.top
      let max_x = min_x + $(self.$.purposebannermessagediv).width()
      let max_y = min_y + $(self.$.purposebannermessagediv).height()
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
          $(self.$.purposebannermessagediv).css({
            opacity: 1
          })
        } else {
          $(self.$.purposebannermessagediv).css({
            opacity: 0
          })
        }
      }
    })
  }
})