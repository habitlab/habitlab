{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  get_enabled_goals
  get_goals
} = require 'libs_backend/goal_utils'

{
  get_days_since_epoch
} = require 'libs_common/time_utils'

{
  getdict_for_key2_dictdict
  setdict_for_key2_dictdict
  getdict_for_key_dictdict
  getCollection
} = require 'libs_backend/db_utils'

{
  as_array
  as_dictset
} = require 'libs_common/collection_utils'

{
  get_intervention_selection_algorithm
} = require 'libs_backend/intervention_selection_algorithms'

{
  add_log_interventions
} = require 'libs_backend/log_utils'

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

export get_days_since_today_on_which_intervention_was_deployed = cfy (intervention_name) ->*
  # output is days since today (0 = today, 1 = yesterday)
  days_deployed = yield get_days_on_which_intervention_was_deployed intervention_name
  today = get_days_since_epoch()
  return [today - x for x in days_deployed]

export get_days_on_which_intervention_was_deployed = cfy (intervention_name) ->*
  # output is epoch days
  day_to_enabled = yield getdict_for_key_dictdict 'interventions_enabled_each_day', intervention_name
  output = []
  for day,enabled of day_to_enabled
    if enabled
      output.push day
  return output

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
  manually_managed_interventions_set = yield intervention_utils.get_manually_managed_interventions_localstorage()
  all_interventions = yield intervention_utils.list_all_interventions()
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
  prev_enabled_interventions = yield get_most_recent_enabled_interventions()
  enabled_interventions = yield get_new_enabled_interventions_for_today()
  yield set_enabled_interventions_for_today_automatic enabled_interventions
  add_log_interventions {
    type: 'new_interventions_for_new_day'
    manual: false
    prev_enabled_interventions: prev_enabled_interventions
    enabled_interventions: enabled_interventions
  }
  return enabled_interventions

export get_enabled_interventions_for_days_since_today = cfy (days_since_today) ->*
  cached_enabled_interventions = yield get_cached_enabled_interventions_for_days_since_today days_since_today
  if Object.keys(cached_enabled_interventions).length != 0
    return cached_enabled_interventions
  if days_since_today > 0 # no interventions were enabled in the past
    return {}
  enabled_interventions = yield get_and_set_new_enabled_interventions_for_today()
  return enabled_interventions

export enable_interventions_because_goal_was_enabled = cfy (goal_name) ->*
  intervention_selection_algorithm = yield get_intervention_selection_algorithm()
  enabled_goals_for_selection_algorithm = {}
  enabled_goals_for_selection_algorithm[goal_name] = true
  automatically_enabled_interventions_list = yield intervention_selection_algorithm(enabled_goals_for_selection_algorithm)
  console.log 'automatically_enabled_interventions_list is'
  console.log automatically_enabled_interventions_list
  enabled_interventions = yield intervention_utils.get_enabled_interventions()
  prev_enabled_interventions = {} <<< enabled_interventions
  newly_enabled_interventions = []
  for intervention_name in automatically_enabled_interventions_list
    if enabled_interventions[intervention_name]
      continue
    newly_enabled_interventions.push intervention_name
    enabled_interventions[intervention_name] = true
  yield set_enabled_interventions_for_today_automatic enabled_interventions
  add_log_interventions {
    type: 'enable_interventions_because_goal_was_enabled'
    manual: false
    goal_enabled: goal_name
    prev_enabled_interventions: prev_enabled_interventions
    enabled_interventions: enabled_interventions
  }
  return newly_enabled_interventions

intervention_utils = require 'libs_backend/intervention_utils'

gexport_module 'intervention_manager', -> eval(it)
