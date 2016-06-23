require! {
  moment
}

{
  getkey_dictdict
} = require 'libs_frontend/db_utils'

# TODO this is duplicated in background.ls move to a library
get_days_since_epoch = ->
  start_of_epoch = moment().year(2016).month(0).date(1).hours(0).minutes(0).seconds(0).milliseconds(0)
  return moment().diff(start_of_epoch, 'days')

export get_seconds_spent_on_domain_today = (domain, callback) ->
  current_day = get_days_since_epoch()
  getkey_dictdict "seconds_on_domain_per_day", domain, get_days_since_epoch(), callback

export get_seconds_spent_on_current_domain_today = (callback) ->
  current_domain = window.location.hostname
  get_seconds_spent_on_domain_today current_domain, callback

