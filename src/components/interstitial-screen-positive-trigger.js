const $ = require('jquery')
const {polymer_ext} = require('libs_frontend/polymer_utils')
const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

polymer_ext({
  is: 'interstitial-screen-positive-trigger',
  properties: {
    positive_goal: {
      type: Object
    },
    continue_button_text: {
      type: String,
      value: "Continue to Facebook"
    }
  },
  continueclicked: function() {
    log_action({'negative': 'Continued to site.'})
    $(this).hide()
  }
})