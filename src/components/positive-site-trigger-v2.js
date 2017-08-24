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
} = require('libs_common/streak_utils')

const {
  get_favicon_data_for_domain
} = require ('libs_common/favicon_utils')

polymer_ext({
  is: 'positive-site-trigger-v2',
  properties: {
    goal: {
      type: Object,
      observer: 'goal_changed'
    },
    positiveSite: {
      type: String,
      computed: 'compute_sitename(goal)'
    },
    positiveSiteIcon: {
      type: String
    },
    streakIconURL:{
      type: String,
      value: chrome.extension.getURL('icons/streak.svg') 
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
  goal_changed: async function(goal) {
    this.positiveSiteIcon = await this.compute_icon(goal)
  },
  compute_icon: async function(goal) {
    if (goal.icon != null) {
      return goal.icon
    } else {
      let icon = await get_favicon_data_for_domain(goal.domain)
      return icon
    }
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


