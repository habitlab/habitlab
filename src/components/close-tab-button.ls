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
  button_clicked: ->
    log_action {'positive': 'close-tab-button clicked'}
    this.$$('#reward_display').play()
  #ready: ->
  #  this.$$('#reward_display').addEventListener 'reward_done', close_selected_tab
}
