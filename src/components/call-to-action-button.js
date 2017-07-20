const {polymer_ext} = require('libs_frontend/polymer_utils');

polymer_ext({
  is: 'call-to-action-button',
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
      value: 0.5
    }
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
  ready: function() {
    this.randomizeButton(this.pUsePositiveGoalSiteButton)
  }
});