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
  getvar
} = require 'libs_frontend/db_utils'

listen_for_eval ((x) -> eval(x))
insert_console ((x) -> eval(x)), {lang: 'livescript'}



