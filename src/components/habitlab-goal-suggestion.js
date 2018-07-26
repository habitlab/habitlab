const {
  get_seconds_spent_on_current_domain_today
} = require('libs_common/time_spent_utils')

const {
  accept_domain_as_goal_and_record,
  reject_domain_as_goal_and_record,
} = require('libs_frontend/goal_utils')

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
  ready: async function() {
    this.seconds_spent = await get_seconds_spent_on_current_domain_today()
    //this.seconds_spent = 120
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
    await accept_domain_as_goal_and_record(window.location.host)
    /*
    await record_have_suggested_domain_as_goal(window.location.host)
    await log_goal_suggestion_action({'action': 'accepted', 'accepted': 'true', 'type': 'spend_less_time', 'domain': window.location.host})
    await add_enable_custom_goal_reduce_time_on_domain(window.location.host)
    */
    /*
    this.fire('intervention_suggestion_accepted', {})
    await log_intervention_suggestion_action({'action': 'accepted', 'accepted': 'true'})
    await log_impression({'suggestion': 'true'})
    await set_intervention_enabled(intervention.name)
    */
  },
  no_button_clicked: async function() {
    this.$$('#sample_toast').hide();
    await reject_domain_as_goal_and_record(window.location.host)
    /*
    await record_have_suggested_domain_as_goal(window.location.host)
    await log_goal_suggestion_action({'action': 'rejected', 'accepted': 'false', 'type': 'spend_less_time', 'domain': window.location.host})
    */
    /*
    this.fire('intervention_suggestion_rejected', {})
    await log_intervention_suggestion_action({'action': 'rejected', 'accepted': 'false'})
    */
  },
})
