const {polymer_ext} = require('libs_frontend/polymer_utils');
const {log_action} = require('libs_frontend/intervention_log_utils')


polymer_ext({
  is: 'call-to-action-button-v2',
  properties: {
    goal: {
      type: Object,
      // observer: 'goalChanged'
    },
    useCloseTabButton: {
      type: Boolean,
      value: true,
      // observer: 'isUseCloseTabButtonChanged'
    },
    usePositiveGoalSiteButton: {
      type: Boolean,
      value: false,
      // observer: 'isUsePositiveGoalSiteButtonChanged'
    },
    pUsePositiveGoalSiteButton: {
      type: Number,
      value: 1
    },
    closeTabText: {
      type: String,
      observer: 'closeTabTextChanged'
    }
  },
  ready: function() {
    this.randomizeButton(this.pUsePositiveGoalSiteButton)
  },
  randomizeButton: function (pUsePositiveGoalSiteButton) {
    if (Math.random() < pUsePositiveGoalSiteButton) {
      this.usePositiveGoalSiteButton = true
      this.useCloseTabButton = false
    } else {
      this.usePositiveGoalSiteButton = false
      this.useCloseTabButton = true
    }
  },
  closeTabTextChanged: function(newText) {
    console.log('Close tab text changed to: ' + newText)
  }
});