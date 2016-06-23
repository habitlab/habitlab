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
  get_seconds_spent_on_domain_today
} = require 'libs_frontend/time_spent_utils'

{
  printable_time_spent
} = require 'libs_common/time_utils'

require! {
  moment
}

$ = require 'jquery'

listen_for_eval ((x) -> eval(x))
insert_console ((x) -> eval(x)), {lang: 'livescript'}


display_timespent_div = $('<div>').attr('id', 'seconds_spent_display').css({
  position: 'fixed' # absolute?
  'background-color': 'red'
  color: 'white'
  width: '100px'
  height: '50px'
  top: '0px'
  right: '0px'
  'z-index': Number.MAX_SAFE_INTEGER
})

$('body').append(display_timespent_div)

setInterval ->
  seconds_spent <- get_seconds_spent_on_current_domain_today()
  $('#seconds_spent_display').html("seconds on www.google.com today: #{printable_time_spent(seconds_spent)}")
  console.log "seconds_spent: #{seconds_spent}"
, 1000

