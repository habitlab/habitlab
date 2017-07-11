const $ = require('jquery')
const {polymer_ext} = require('libs_frontend/polymer_utils')

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

const {
  get_random_positive_goal
} = require('libs_backend/goal_utils')

polymer_ext({
  is: 'positive-site-trigger',
  properties: {
    goal: {
      type: Object,
      observer: 'goal_property_changed'
    },
    positiveSite: {
      type: String,
      computed: 'compute_sitename(goal)'
    },
    positiveSiteIcon: {
      type: String,
      computed: 'compute_icon(goal)'
    },
    streak: {
      type: Number,
      value: 0
    }
  },
  goClicked: function() {
    console.log('go button clicked!')
    log_action({'positive': 'Went to positive site.'})
    var domain = this.goal.domain
    if (domain.search("http") == -1) {
      domain = 'https://' + domain
    }
    window.location.href = 'https://' + this.goal.domain
  },
  compute_sitename: function(goal) {
    return goal.sitename_printable
  },
  compute_icon: function(goal) {
    return goal.icon
  },
  goal_property_changed: function(goal, old_goal) {
    this.goal = goal
  },
  ready: async function() {
    let goal = await get_random_positive_goal()
    console.log('set goal to ' + goal)
    this.goal = goal
  }
})


