<- (-> it!)

if window.google_logging_example
  return
window.google_logging_example = true

{
  log_impression
  log_action
  addtolog
  getlog
  clearlog
} = require 'libs_common/log_utils'

{
  listen_for_eval
  insert_console
} = require 'libs_frontend/content_script_debug'

{
  set_intervention_enabled
  set_intervention_disabled
} = require 'libs_common/intervention_utils'

{
  get_visits_to_current_domain_today
} = require 'libs_common/time_spent_utils'

log_impression('google/logging_example')




# these insert the debugging console at the bottom-right
listen_for_eval ((x) -> eval(x))
insert_console ((x) -> eval(x)), {lang: 'livescript'}
