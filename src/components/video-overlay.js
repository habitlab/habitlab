const {
  get_seconds_spent_on_domain_today
} = require('libs_common/time_spent_utils')

const {
  get_intervention
} = require('libs_common/intervention_info')

Polymer({
  is: 'video-overlay',
  properties: {
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed'
    },
    domain: {
      type: String,
      value: (function() {
        if (window.location.protocol == 'chrome-extension:')
          return 'www.iqiyi.com'
        else
          return window.location.host
      })()
    },
    sitename_printable: {
      type: String,
      value: get_intervention().sitename_printable //'Iqiyi'
    }
  },
  watch_button_clicked: function(evt) {
    this.fire('watch_clicked', {})
    console.log('watch button was clicked')
  },
  ready: async function() {
    //console.log('ready was called')
    const secondsSpent = await get_seconds_spent_on_domain_today(this.domain)
    const mins = Math.floor(secondsSpent/60)
    const secs = secondsSpent % 60
    //console.log('getting time spent')
    this.$.msg.innerHTML = "You've spent " + mins + " minutes and " + secs + " seconds on " + this.sitename_printable + " today. <br>Are you sure you want to continue watching videos?"
  },
  isdemo_changed: function(isdemo) {
    console.log('isdemo_changed called')
    console.log(isdemo)
    if (isdemo) {
      this.style.height = '410px';
      this.style.width = '680px';
    }
  }
})
