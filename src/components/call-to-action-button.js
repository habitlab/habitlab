const {polymer_ext} = require('libs_frontend/polymer_utils');
const {log_action} = require('libs_frontend/intervention_log_utils')
const {
  get_intervention, 
  get_goal_info
} = require('libs_common/intervention_info')

const {
  close_tab_with_id
} = require('libs_common/tab_utils')

const {
  get_tab_id
} = require ('libs_common/intervention_info')

const {get_intervention_info} = require('libs_common/intervention_utils')

polymer_ext({
  is: 'call-to-action-button',
  properties: {
    goal: {
      type: Object
    },
    buttonText: {
      type: String,
      computed: 'computeButtonText(goal)'
    }
  },
  ready: function() {
    this.goal = get_goal_info()
  },
  buttonClicked: function() {
    if (this.goal.is_positive) {
      log_action({'positive': 'positive-goal-site-button clicked'})
      var domain = this.goal.domain
      if (domain.search("http") == -1) {
        domain = 'https://' + domain
      }
      window.location.href = domain
    } else {
      log_action({'positive': 'close-tab-button clicked'})
      close_tab_with_id(get_tab_id()) 
    }
  },
  computeButtonText: function(goal) {
    if (goal.call_to_action != null) {
      // Should be max 21 characters
      return goal.call_to_action
    } else if (!goal.is_positive) {
      var sitename_printable = get_intervention().sitename_printable
      return "Close " + sitename_printable
    } else {
      // Positive goal with no call to action text set -> just use its description for now
      return goal.description
    }
  }
});