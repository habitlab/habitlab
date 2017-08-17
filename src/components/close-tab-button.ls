{
  close_selected_tab
} = require 'libs_common/tab_utils'

{
  log_action
} = require 'libs_frontend/intervention_log_utils'

{
  get_tab_id
} = require 'libs_common/intervention_info'

{
  close_tab_with_id
} = require 'libs_common/tab_utils'

{
  msg
} = require 'libs_common/localization_utils'

Polymer {
  is: 'close-tab-button'
  doc: 'A button that closes the current tab'
  properties: {
    buttontext: {
      type: String
      value: msg('Close Tab')
    }
  }
  button_clicked: ->>
    await log_action {'positive': 'close-tab-button clicked'}
    close_tab_with_id(get_tab_id())
}
