{
  log_action
} = require 'libs_frontend/intervention_log_utils'

{
  get_intervention
} = require 'libs_common/intervention_info'

const {
  get_random_uncompleted_positive_goal
} = require('libs_common/goal_utils')

{
  msg
} = require 'libs_common/localization_utils'

Polymer {
  is: 'positive-goal-site-button'
  properties: {
    goal: {
      type: Object
      observer: 'goalChanged'
    }
    buttontext: String 
  }
  goalChanged: ->
    this.buttontext = msg("#{this.goal.call_to_action}")
  button_clicked: ->
    log_action {'positive': 'positive-goal-site-button clicked'}
    domain = this.goal.domain
    if domain.search("http") == -1
      domain = 'https://' + domain
    window.location.href = domain
  ready: ->>
    this.goal = await get_random_uncompleted_positive_goal!
}