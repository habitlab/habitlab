require! {
  moment
}

{
  getkey_dictdict
  getdict_for_key_dictdict
  getdict_for_key2_dictdict
} = require 'libs_common/db_utils'

{
  get_days_since_epoch
} = require 'libs_common/time_utils'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

export get_seconds_spent_on_all_domains_today = (callback) ->
  getdict_for_key2_dictdict 'seconds_on_domain_per_day', get_days_since_epoch(), callback

export get_seconds_spent_on_domain_today = (domain, callback) ->
  current_day = get_days_since_epoch()
  getkey_dictdict 'seconds_on_domain_per_day', domain, get_days_since_epoch(), (result) ->
    if result?
      callback result
    else
      callback 0

export get_seconds_spent_on_current_domain_today = (callback) ->
  current_domain = window.location.hostname
  get_seconds_spent_on_domain_today current_domain, (result) ->
    if result?
      callback result
    else
      callback 0

gexport_module 'time_spent_utils', -> eval(it)
