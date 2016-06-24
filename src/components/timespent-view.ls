{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

{
  get_seconds_spent_on_domain_today
} = require 'libs_common/time_spent_utils'

polymer_ext {
  is: 'timespent-view'
  ready: ->
    console.log 'timespent-view loaded'
    time_spent_on_facebook <- get_seconds_spent_on_domain_today('www.facebook.com')
    console.log "seconds spent on facebook today: #{time_spent_on_facebook}"
}
