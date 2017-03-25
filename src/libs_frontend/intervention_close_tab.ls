{
  get_tab_id
} = require 'libs_common/intervention_info'

{
  close_tab_with_id
} = require 'libs_frontend/tab_utils'

{
  cfy
} = require 'cfy'

require('enable-webcomponents-in-content-scripts')

require('components/reward-display.deps')

export close_current_tab = cfy ->*
  tab_id = get_tab_id()
  yield close_tab_with_id(tab_id)

export display_reward_and_close_current_tab = cfy ->*
  reward_display = document.createElement('reward-display')
  reward_display.autoplay = true
  reward_display.no_autoclose = false
  document.body.appendChild(reward_display)
