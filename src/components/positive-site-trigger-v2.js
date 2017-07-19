const {polymer_ext} = require('libs_frontend/polymer_utils')

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

const {
  get_random_positive_goal
} = require('libs_backend/goal_utils')

const {
  get_streak
} = require('libs_backend/streak_utils')

polymer_ext({
  is: 'positive-site-trigger-v2',
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
    positiveGoalDescription: {
      type: String,
      computed: 'compute_description(goal)'
    },
    streak: {
      type: Number,
      value: 0
    },
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
  compute_description: function(goal) {
    return goal.description
  },
  goal_property_changed: function(goal, old_goal) {
    this.goal = goal
  },
  ready: async function() {
    this.goal = await get_random_positive_goal()
    let goal_name = this.goal.name
    console.log('set goal to ' + goal_name)
    this.streak = await get_streak(this.goal)
  }
})


