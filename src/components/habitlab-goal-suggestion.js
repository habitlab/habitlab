const intervention = require('libs_common/intervention_info').get_intervention();

const {
  log_intervention_suggestion_action,
  log_impression,
} = require('libs_frontend/intervention_log_utils');

const {
  set_intervention_enabled
} = require('libs_frontend/intervention_utils');

Polymer({
  is: 'habitlab-goal-suggestion',
  properties: {
    time_spent_printable: {
      type: String,
      computed: 'compute_time_spent_printable(seconds_spent)',
    },
    seconds_spent: {
      type: Number,
      value: 0,
    },
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed',
    },
  },
  compute_time_spent_printable: function(seconds_spent) {
    return Math.round(seconds_spent / 60).toString() + ' minutes'
  },
  isdemo_changed: function() {
    if (this.isdemo) {
      this.show();
    }
  },
  ready: function() {
    this.seconds_spent = 120
    /*
    let self = this
    //console.log('toast-test-widget ready')
    this.$.sample_toast.show()
    this.$.sample_toast_close_button.addEventListener('click', function() {
      self.$.sample_toast.hide()
    })
    */
    //show_toast('foobar')
  },
  show: function() {
    this.$$('#sample_toast').show()
  },
  ok_button_clicked: async function() {
    this.$$('#sample_toast').hide()
    this.fire('intervention_suggestion_accepted', {})
    await log_intervention_suggestion_action({'action': 'accepted', 'accepted': 'true'})
    await log_impression({'suggestion': 'true'})
    await set_intervention_enabled(intervention.name)
  },
  no_button_clicked: async function() {
    this.$$('#sample_toast').hide();
    this.fire('intervention_suggestion_rejected', {})
    await log_intervention_suggestion_action({'action': 'rejected', 'accepted': 'false'})
  },
})
