
const {
  get_goal_info,
  get_positive_enabled_goals
} = require('libs_common/goal_utils')

Polymer({
  is: 'action-dropdown',
  properties: {
    callstoaction: Array,
    label: {
      type: String,
      observer: 'label_changed'
    }
  },
  label_changed: function(newLabel, oldLabel) {
    if (newLabel != null && newLabel.length > 0) {
      // TODO: add or remove no-label-float from the paper dropdown menu.
      // eg something like this.$.paper_dropdown_menu.attr(no-label-float)
    }
  },
  ready: async function() {
    var callstoaction = ['Close Tab']
    let goals = await get_positive_enabled_goals()
    for (var goal of Object.values(goals)) {
      let call_to_action = goal.call_to_action
      if (call_to_action == null) {
        call_to_action = "Go to " + goal.sitename_printable
      }
      callstoaction.push(call_to_action)
    }
    this.callstoaction = callstoaction
  }
})