{
  open_debug_page_for_tab_id
} = require 'libs_frontend/open_debug_page_for_tab_id'

{
  get_tab_id
} = require 'libs_common/intervention_info'

{cfy} = require 'cfy'

export open_debug_page = cfy ->*
  tab_id = get_tab_id()
  yield open_debug_page_for_tab_id tab_id
