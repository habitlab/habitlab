{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{
  get_seconds_spent_on_current_domain_today     # current domain
  get_seconds_spent_on_all_domains_today        # map for all domains
  get_seconds_spent_on_domain_today             # specific domain
  get_seconds_spent_on_all_domains_days_since_today
  get_seconds_spent_on_domain_all_days
} = require 'libs_common/time_spent_utils'

{
  printable_time_spent
} = require 'libs_common/time_utils'

{
  getGoalInfo
  list_goals_for_site
} = require 'libs_backend/goal_utils'

{
  get_progress_on_goal_this_week
} = require 'libs_backend/goal_progress'

reversed = (arr) ->
  arr = [x for x in arr]
  arr.reverse()
  return arr

polymer_ext {
  is: 'site-goal-view'
  properties: {
    site: {
      type: String
      value: 'facebook'
      observer: 'siteChanged'
    }
    goals: {
      type: Array
    }
  }
  siteChanged: ->
    console.log 'site is'
    console.log this.site
    goals <~ list_goals_for_site this.site
    this.goals = goals
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
