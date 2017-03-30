{
  open_debug_page_for_tab_id
} = require 'libs_frontend/debug_console_utils'

{
  get_tab_id
} = require 'libs_common/intervention_info'

open_debug_page = ->>
  tab_id = get_tab_id()
  await open_debug_page_for_tab_id tab_id

module.exports.open_debug_page = open_debug_page
