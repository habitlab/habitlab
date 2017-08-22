require! {
  moment
}

prelude = require 'prelude-ls'

{
  getkey_dictdict
  getdict_for_key_dictdict
  getdict_for_key2_dictdict
  getCollection
  setkey_dict
  getkey_dict
} = require 'libs_common/db_utils'

{
  url_to_domain
} = require 'libs_common/domain_utils'

{
  get_days_since_epoch
} = require 'libs_common/time_utils'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

export get_seconds_spent_on_all_domains_today = ->>
  await getdict_for_key2_dictdict 'seconds_on_domain_per_day', get_days_since_epoch()

export get_seconds_spent_on_all_domains_days_before_today = (days_ago) ->>
  await getdict_for_key2_dictdict 'seconds_on_domain_per_day', (get_days_since_epoch() - days_ago)

export get_seconds_spent_on_domain_all_days = (domain) ->>
  results = await getdict_for_key_dictdict 'seconds_on_domain_per_day', domain
  today_day_num = get_days_since_epoch()
  output = {}
  for k,v of results
    output[today_day_num - k] = v
  return output

export get_seconds_spent_on_domain_days_before_today = (domain, days_ago) ->>
  current_day = get_days_since_epoch()
  result = await getkey_dictdict 'seconds_on_domain_per_day', domain, (current_day - days_ago)
  return result ? 0

export get_seconds_spent_on_domain_today = (domain) ->>
  current_day = get_days_since_epoch()
  result = await getkey_dictdict 'seconds_on_domain_per_day', domain, current_day
  return result ? 0

export get_minutes_spent_on_domain_today = (domain) ->>
  current_day = get_days_since_epoch()
  result = await getkey_dictdict 'seconds_on_domain_per_day', domain, current_day
  if result?
    return Math.floor(result/60.0)
  return 0

/**
* Return seconds spent on current domain today
* @return {integer} seconds spent
*/
export get_seconds_spent_on_current_domain_today = ->>
  current_domain = window.location.hostname
  result = await get_seconds_spent_on_domain_today current_domain
  return result ? 0

export get_visits_to_domain_today = (domain) ->>
  current_day = get_days_since_epoch()
  result = await getkey_dictdict 'visits_to_domain_per_day', domain, current_day
  return result ? 0

export get_visits_to_domain_days_before_today = (domain, days_ago) ->>
  current_day = get_days_since_epoch()
  result = await getkey_dictdict 'visits_to_domain_per_day', domain, (current_day - days_ago)
  return result ? 0

export get_visits_to_current_domain_today = ->>
  current_domain = window.location.hostname
  result = await get_visits_to_domain_today current_domain
  return result ? 0

/*
export get_new_session_id_for_domain = (domain) ->>
  collection = await getCollection('seconds_on_domain_per_session')
  all_session_ids_for_domain = await collection.where('key').equals(domain).toArray()
  all_session_ids_for_domain = all_session_ids_for_domain.map (.key2)
  if all_session_ids_for_domain.length == 0
    return 0
  return prelude.maximum(all_session_ids_for_domain) + 1 # this is the day, in epoch time, that the most recent intervention set occurred
*/

export get_new_session_id_for_domain = (domain) ->>
  result = await getkey_dict 'domain_to_last_session_id', domain
  if not result?
    await setkey_dict 'domain_to_last_session_id', domain, 0
    return 0
  await setkey_dict 'domain_to_last_session_id', domain, (result + 1)
  return result + 1

export get_seconds_spent_on_current_domain_in_session = (session_id) ->>
  current_domain = window.location.hostname
  result = await get_seconds_spent_on_domain_in_session current_domain, session_id
  return result ? 0

export get_seconds_spent_on_domain_in_session = (domain, session_id) ->>
  result = await getkey_dictdict 'seconds_on_domain_per_session', domain, session_id
  return result ? 0

gexport_module 'time_spent_utils', -> eval(it)
