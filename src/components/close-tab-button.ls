{
  close_selected_tab
} = require 'libs_common/tab_utils'

{
  log_action
} = require 'libs_frontend/intervention_log_utils'

{
  get_intervention
} = require 'libs_common/intervention_info'

{
  msg
} = require 'libs_common/localization_utils'

Polymer {
  is: 'close-tab-button'
  properties: {
    buttontext: {
      type: String
      value: msg('Close Tab')
    }
  }
  ready: ->
    if document.querySelectorAll('.habitlab_reward_display').length == 0
      reward_display = document.createElement('reward-display')
      reward_display.classList.add('habitlab_reward_display')
      document.body.appendChild(reward_display)
  button_clicked: ->
    log_action {'positive': 'close-tab-button clicked'}
    for reward_display in document.querySelectorAll('.habitlab_reward_display')
      if typeof(reward_display.play) == 'function'
        reward_display.play()
        break
    #this.$$('#reward_display').play()
  #ready: ->
  #  this.$$('#reward_display').addEventListener 'reward_done', close_selected_tab
}
