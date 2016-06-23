<- (-> it!)

if window.google_display_time_spent
  return
window.google_display_time_spent = true

console.log 'display time spent started'

{
  listen_for_eval
  insert_console
} = require 'libs_frontend/content_script_debug'

{
  get_seconds_spent_on_current_domain_today
} = require 'libs_frontend/time_utils'

listen_for_eval ((x) -> eval(x))
insert_console ((x) -> eval(x)), {lang: 'livescript'}

setInterval ->
  seconds_spent <- get_seconds_spent_on_current_domain_today()
  console.log "seconds_spent: #{seconds_spent}"
, 1000

