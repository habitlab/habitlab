<- (-> it!)

if window.google_display_time_spent
  return
window.google_display_time_spent = true

{
  get_seconds_spent_on_current_domain_today
  get_seconds_spent_on_domain_today
} = require 'libs_common/time_spent_utils'

{
  printable_time_spent
} = require 'libs_common/time_utils'

require! {
  moment
}

$ = require 'jquery'

require('enable-webcomponents-in-content-scripts')

require('components_skate/time-spent-display')

display_timespent_div = $('<time-spent-display>')
$('body').append(display_timespent_div)
