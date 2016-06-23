require! {
  moment
}

{
  getkey_dictdict
} = require 'libs_frontend/db_utils'

{
  get_days_since_epoch
} = require 'libs_common/time_utils'

export get_seconds_spent_on_domain_today = (domain, callback) ->
  current_day = get_days_since_epoch()
  getkey_dictdict "seconds_on_domain_per_day", domain, get_days_since_epoch(), callback

export get_seconds_spent_on_current_domain_today = (callback) ->
  current_domain = window.location.hostname
  get_seconds_spent_on_domain_today current_domain, callback
