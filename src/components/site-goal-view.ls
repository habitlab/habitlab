{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

{
  list_goals_for_site
} = require 'libs_backend/goal_utils'

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
    goals <~ list_goals_for_site this.site
    this.goals = goals
}