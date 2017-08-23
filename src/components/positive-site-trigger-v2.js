const {polymer_ext} = require('libs_frontend/polymer_utils')

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

const {
  get_positive_goal_info
} = require('libs_common/intervention_info')

const {
  get_random_uncompleted_positive_goal
} = require('libs_common/goal_utils')

const {
  get_streak
} = require('libs_backend/streak_utils')

polymer_ext({
  is: 'positive-site-trigger-v2',
  properties: {
    goal: {
      type: Object
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
    in_facebook_news_feed: {
      type: Boolean,
      value: false
    }
  },
  goClicked: function() {
    log_action({'positive': 'Went to positive site.'})
    var domain = this.goal.domain
    if (domain.search("http") == -1) {
      domain = 'https://' + domain
    }
    window.location.href = domain
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
  ready: async function() {
    this.goal = await get_positive_goal_info()
    let goal_name = this.goal.name
    console.log('set goal to ' + goal_name)
    this.streak = await get_streak(this.goal)
  }
})


