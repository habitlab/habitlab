{
  log_action
} = require 'libs_frontend/intervention_log_utils'

{
  get_intervention
} = require 'libs_common/intervention_info'

const {
  get_random_positive_goal
} = require('libs_backend/goal_utils')

{
  msg
} = require 'libs_common/localization_utils'

Polymer {
  is: 'positive-goal-site-button'
  properties: {
    goal: Object
    buttontext: String 
    positiveSiteURL: String
  }
  button_clicked: ->
    log_action {'positive': 'positive-goal-site-button clicked'}
    this.$$('#reward_display').play()
  ready: ->>
    this.goal = await get_random_positive_goal!
    this.buttontext = msg("#{this.goal.call_to_action}")
    this.positiveSiteURL = this.goal.domain
    console.log this.positiveSiteURL
}