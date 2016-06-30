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
} = require 'libs_backend/dexie_utils'

{
  as_array
  as_dictset
} = require 'libs_common/collection_utils'

{
  get_intervention_selection_algorithm
} = require 'libs_backend/intervention_selection_algorithms'

export set_enabled_interventions_for_today_manual = (enabled_interventions, callback) ->
  <- setdict_for_key2_dictdict 'interventions_enabled_each_day', get_days_since_epoch(), enabled_interventions
  callback?!

export set_enabled_interventions_for_today_automatic = (enabled_interventions, callback) ->
  <- setdict_for_key2_dictdict 'interventions_enabled_each_day', get_days_since_epoch(), enabled_interventions
  callback?!

export get_cached_enabled_interventions_for_today = (callback) ->
  get_cached_enabled_interventions_for_days_since_today 0, callback

export get_cached_enabled_interventions_for_days_since_today = (days_since_today, callback) ->
  getdict_for_key2_dictdict 'interventions_enabled_each_day', (get_days_since_epoch() - days_since_today), callback

export get_enabled_interventions_for_today = (callback) ->
  get_enabled_interventions_for_days_since_today 0, callback

get_last_day_with_intervention_enabled_data = (callback) ->
  last_intervention_set_item <- getCollection('interventions_enabled_each_day').orderBy('key2').last()
  if not last_intervention_set_item?
    return callback()
  callback last_intervention_set_item.key2 # this is the day, in epoch time, that the most recent intervention set occurred

export get_most_recent_enabled_interventions = (callback) ->
  day_with_enabled_interventions <- get_last_day_with_intervention_enabled_data()
  if not day_with_enabled_interventions?
    return callback {}
  days_since_today = get_days_since_epoch() - day_with_enabled_interventions
  get_cached_enabled_interventions_for_days_since_today days_since_today, callback

get_new_enabled_interventions_for_today = (callback) ->
  enabled_interventions = {}
  intervention_selection_algorithm <- get_intervention_selection_algorithm()
  automatically_enabled_interventions_list <- intervention_selection_algorithm()
  automatically_enabled_interventions_set = {[k, true] for k in automatically_enabled_interventions_list}
  enabled_interventions_set <- get_most_recent_enabled_interventions()
  manually_managed_interventions_set <- get_manually_managed_interventions_localstorage()
  all_interventions <- list_all_interventions()
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
  callback enabled_interventions

export get_and_set_new_enabled_interventions_for_today = (callback) ->
  console.log 'picking new interventions for today'
  enabled_interventions <- get_new_enabled_interventions_for_today()
  <- set_enabled_interventions_for_today_automatic enabled_interventions
  callback enabled_interventions

export get_enabled_interventions_for_days_since_today = (days_since_today, callback) ->
  cached_enabled_interventions <- get_cached_enabled_interventions_for_days_since_today days_since_today
  if Object.keys(cached_enabled_interventions).length != 0
    return callback cached_enabled_interventions
  if days_since_today > 0 # no interventions were enabled in the past
    return callback {}
  enabled_interventions <- get_and_set_new_enabled_interventions_for_today()
  callback enabled_interventions

gexport_module 'intervention_manager', -> eval(it)
