{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  get_enabled_goals
  get_goals
} = require 'libs_backend/goal_utils'

{
  get_manually_managed_interventions
  get_manually_managed_interventions_localstorage
  list_all_interventions
} = require 'libs_backend/intervention_utils'

{
  get_days_since_epoch
} = require 'libs_common/time_utils'

{
  getdict_for_key2_dictdict
  setdict_for_key2_dictdict
  getCollection
} = require 'libs_backend/db_utils'

{
  as_array
  as_dictset
} = require 'libs_common/collection_utils'

{
  get_intervention_selection_algorithm
} = require 'libs_backend/intervention_selection_algorithms'

{cfy} = require 'cfy'

export set_enabled_interventions_for_today_manual = cfy (enabled_interventions) ->*
  yield setdict_for_key2_dictdict 'interventions_enabled_each_day', get_days_since_epoch(), enabled_interventions
  return

export set_enabled_interventions_for_today_automatic = cfy (enabled_interventions) ->*
  yield setdict_for_key2_dictdict 'interventions_enabled_each_day', get_days_since_epoch(), enabled_interventions
  return

export get_cached_enabled_interventions_for_today = cfy ->*
  yield get_cached_enabled_interventions_for_days_since_today 0

export get_cached_enabled_interventions_for_days_since_today = cfy (days_since_today) ->*
  yield getdict_for_key2_dictdict 'interventions_enabled_each_day', (get_days_since_epoch() - days_since_today)

export get_enabled_interventions_for_today = cfy ->*
  yield get_enabled_interventions_for_days_since_today 0

get_last_day_with_intervention_enabled_data = cfy ->*
  collection = yield getCollection('interventions_enabled_each_day')
  last_intervention_set_item = yield collection.orderBy('key2').last()
  if not last_intervention_set_item?
    return
  return last_intervention_set_item.key2 # this is the day, in epoch time, that the most recent intervention set occurred

export get_most_recent_enabled_interventions = cfy ->*
  day_with_enabled_interventions = yield get_last_day_with_intervention_enabled_data()
  if not day_with_enabled_interventions?
    return {}
  days_since_today = get_days_since_epoch() - day_with_enabled_interventions
  yield get_cached_enabled_interventions_for_days_since_today days_since_today

get_new_enabled_interventions_for_today = cfy ->*
  enabled_interventions = {}
  intervention_selection_algorithm = yield get_intervention_selection_algorithm()
  automatically_enabled_interventions_list = yield intervention_selection_algorithm()
  automatically_enabled_interventions_set = {[k, true] for k in automatically_enabled_interventions_list}
  enabled_interventions_set = yield get_most_recent_enabled_interventions()
  manually_managed_interventions_set = yield get_manually_managed_interventions_localstorage()
  all_interventions = yield list_all_interventions()
  for intervention in all_interventions
    manually_managed = manually_managed_interventions_set[intervention]
    manually_managed = (manually_managed == true)
    enabled = false
    if manually_managed
      enabled = enabled_interventions_set[intervention]
    else
      enabled = automatically_enabled_interventions_set[intervention]
    enabled = (enabled == true)
    enabled_interventions[intervention] = enabled
  return enabled_interventions

export get_and_set_new_enabled_interventions_for_today = cfy ->*
  console.log 'picking new interventions for today'
  enabled_interventions = yield get_new_enabled_interventions_for_today()
  yield set_enabled_interventions_for_today_automatic enabled_interventions
  return enabled_interventions

export get_enabled_interventions_for_days_since_today = cfy (days_since_today) ->*
  cached_enabled_interventions = yield get_cached_enabled_interventions_for_days_since_today days_since_today
  if Object.keys(cached_enabled_interventions).length != 0
    return cached_enabled_interventions
  if days_since_today > 0 # no interventions were enabled in the past
    return {}
  enabled_interventions = yield get_and_set_new_enabled_interventions_for_today()
  return enabled_interventions

gexport_module 'intervention_manager', -> eval(it)
