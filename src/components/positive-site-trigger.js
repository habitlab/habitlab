const $ = require('jquery')
const {polymer_ext} = require('libs_frontend/polymer_utils')

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

const {
  get_random_positive_goal
} = require('libs_backend/goal_utils')

const {
  get_streak
} = require('libs_backend/goal_progress')

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
    let goal_object = await get_random_positive_goal()
    let goal_name = goal_object.name
    let goal_info = goal_object.info
    this.goal = goal_info
    console.log('set goal to ' + goal_info)
    this.streak = await get_streak(goal_name, goal_info)
  }
})


