{
  close_selected_tab
} = require 'libs_common/tab_utils'

{
  log_action
} = require 'libs_common/log_utils'

{
  get_intervention
} = require 'libs_common/intervention_info'

Polymer {
  is: 'close-tab-button'
  properties: {
    text: {
      type: String
      value: 'Close Tab'
    }
  }
  button_clicked: ->
    log_action get_intervention().name, {'positive': 'close-tab-button clicked'}
    this.$$('#reward_display').play()
  #ready: ->
  #  this.$$('#reward_display').addEventListener 'reward_done', close_selected_tab
}
