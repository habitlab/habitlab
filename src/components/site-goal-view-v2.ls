{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

{cfy} = require 'cfy'

{
  list_goals_for_site
} = require 'libs_backend/goal_utils'

polymer_ext {
  is: 'site-goal-view-v2'
  properties: {
    site: {
      type: String
      observer: 'siteChanged'
    }
    goals: {
      type: Array
    }
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
  }
  isdemo_changed: (isdemo) ->
    if isdemo
      this.site = 'facebook'
  siteChanged: cfy (site) ->*
    goals = yield list_goals_for_site site
    if this.site != site
      return
    this.goals = goals
}