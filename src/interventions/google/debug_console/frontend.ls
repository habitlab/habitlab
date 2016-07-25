<- (-> it!)

if window.google_debug_console
  return
window.google_debug_console = true

{
  log_impression
  log_action
  addtolog
  getlog
  clearlog
} = require 'libs_common/log_utils'

{
  set_intervention_enabled
  set_intervention_disabled
} = require 'libs_common/intervention_utils'

{
  get_visits_to_current_domain_today
} = require 'libs_common/time_spent_utils'

{
  list_libs
} = require 'libs_common/function_signatures'

{
  import_lib
} = require 'libs_frontend/import_lib'

for lib_name in list_libs()
  lib_funcs = import_lib(lib_name)
  if not window[lib_name]?
    window[lib_name] = lib_funcs
  for k,f of lib_funcs
    if not window[k]?
      window[k] = f

#log_impression('google/logging_example')

if intervention.params.debug.value
  {
    listen_for_eval
    insert_console
  } = require 'libs_frontend/content_script_debug'
  listen_for_eval ((x) -> eval(x))
  insert_console ((x) -> eval(x)), {lang: 'livescript'}
