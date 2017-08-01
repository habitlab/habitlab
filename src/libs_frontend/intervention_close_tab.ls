{
  get_tab_id
} = require 'libs_common/intervention_info'

{
  close_tab_with_id
} = require 'libs_frontend/tab_utils'

close_current_tab = ->>
  tab_id = get_tab_id()
  await close_tab_with_id(tab_id)

module.exports = {
  close_current_tab
}