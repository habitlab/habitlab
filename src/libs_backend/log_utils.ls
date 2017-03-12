{
  memoize
  memoizeSingleAsync
} = require 'libs_common/memoize'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  get_days_since_epoch
} = require 'libs_common/time_utils'

{
  get_user_id
} = require 'libs_backend/background_common'

require! {
  dexie
}

{generate_random_id} = require 'libs_common/generate_random_id'

$ = require 'jquery'

{cfy} = require 'cfy'

export get_db_major_version_interventionlogdb = -> '8'
export get_db_minor_version_interventionlogdb = -> '1'

export delete_db_if_outdated_interventionlogdb = cfy ->*
  if localStorage.getItem('db_minor_version_interventionlogdb') != get_db_minor_version_interventionlogdb()
    localStorage.setItem('db_minor_version_interventionlogdb', get_db_minor_version_interventionlogdb())
  if localStorage.getItem('db_major_version_interventionlogdb') != get_db_major_version_interventionlogdb()
    yield deleteInterventionLogDb()
    localStorage.removeItem('current_schema_interventionlogdb')
    localStorage.setItem('db_major_version_interventionlogdb', get_db_major_version_interventionlogdb())
  return

export get_current_schema_interventionlogdb = ->
  result = localStorage.getItem('current_schema_interventionlogdb')
  if not result?
    return {}
  return JSON.parse result

export get_current_dbver_interventionlogdb = ->
  result = localStorage.getItem('current_dbver_interventionlogdb')
  if not result?
    return 0
  return parseInt result

export get_interventions_seen_today = cfy ->*
  interventions = yield intervention_utils.list_all_interventions()
  enabled = yield intervention_utils.get_enabled_interventions()
  invns = []
  for intervention in interventions #get interventions seen today
    result = yield get_num_impressions_today(intervention)
    if result > 0
      invns.push intervention
  for key in Object.keys(enabled) #filter for enabled interventions
    if enabled[key] == false
      delete enabled[key]
  combined = Array.from(new Set(invns.concat(enabled))) #remove duplicates
  combined.pop()
  return combined

  

export get_log_names = cfy ->*
  interventions_list = yield intervention_utils.list_all_interventions()
  logs_list = ['goals', 'interventions', 'feedback'].map -> 'logs/'+it
  return interventions_list.concat(logs_list)

intervention_logdb_cache = null

export clear_intervention_logdb_cache = ->
  intervention_logdb_cache := null

export getInterventionLogDb = cfy ->*
  if intervention_logdb_cache?
    return intervention_logdb_cache
  output = yield getInterventionLogDb_uncached()
  intervention_logdb_cache := output
  return intervention_logdb_cache

getInterventionLogDb_uncached = cfy ->*
  yield delete_db_if_outdated_interventionlogdb()
  log_names = yield get_log_names()
  db = new dexie('interventionlog', {autoOpen: false})
  dbver = get_current_dbver_interventionlogdb()
  prev_schema = get_current_schema_interventionlogdb()
  stores_to_create = {}
  for logname in log_names
    if not prev_schema[logname]?
      stores_to_create[logname] = '++id,[type+day],type,day,itemid,synced'
  new_schema = {[k,v] for k,v of prev_schema}
  if Object.keys(stores_to_create).length > 0
    db.version(dbver).stores(prev_schema)
    dbver += 1
    for k,v of stores_to_create
      new_schema[k] = v
    db.on 'ready', ->
      localStorage.setItem 'current_schema_interventionlogdb', JSON.stringify(new_schema)
      localStorage.setItem 'current_dbver_interventionlogdb', dbver
  db.version(dbver).stores(new_schema)
  realdb = yield db.open()
  return realdb

export deleteInterventionLogDb = cfy ->*
  console.log 'deleteInterventionLogDb called'
  localStorage.removeItem('current_schema_interventionlogdb')
  localStorage.removeItem('current_dbver_interventionlogdb')
  db = new dexie('interventionlog')
  yield db.delete()
  return

export getInterventionLogCollection = cfy (name) ->*
  db = yield getInterventionLogDb()
  return db[name]

export add_log_goals = cfy (data) ->*
  data = {} <<< data
  if not data.enabled_interventions?
    data.enabled_interventions = yield intervention_utils.get_enabled_interventions()
  if not data.enabled_goals?
    data.enabled_goals = yield goal_utils.get_enabled_goals()
  yield addtolog 'logs/goals', data

export add_log_interventions = cfy (data) ->*
  data = {} <<< data
  if not data.enabled_interventions?
    data.enabled_interventions = yield intervention_utils.get_enabled_interventions()
  if not data.enabled_goals?
    data.enabled_goals = yield goal_utils.get_enabled_goals()
  yield addtolog 'logs/interventions', data

export add_log_feedback = cfy (data) ->*
  data = {} <<< data
  if not data.enabled_interventions?
    data.enabled_interventions = yield intervention_utils.get_enabled_interventions()
  if not data.enabled_goals?
    data.enabled_goals = yield goal_utils.get_enabled_goals()
  yield addtolog 'logs/feedback', data

export addtolog = cfy (name, data) ->*
  data = {} <<< data
  if not data.type?
    data.type = 'general'
  data.userid = yield get_user_id()
  data.day = get_days_since_epoch()
  data.synced = 0
  data.timestamp = Date.now()
  data.itemid = generate_random_id()
  data.log_major_ver = get_db_major_version_interventionlogdb()
  data.log_minor_ver = get_db_minor_version_interventionlogdb()
  collection = yield getInterventionLogCollection(name)
  result = yield collection.add(data)
  return data

export getlog = cfy (name) ->*
  collection = yield getInterventionLogCollection(name)
  result = yield collection.toArray()
  return result

export clearlog = cfy (name) ->*
  collection = yield getInterventionLogCollection(name)
  num_deleted = yield collection.delete()
  return

export get_num_impressions = cfy (name) ->*
  collection = yield getInterventionLogCollection(name)
  num_impressions = yield collection.where('type').equals('impression').count()
  return num_impressions

export get_num_impressions_for_days_since_today = cfy (name, days_since_today) ->*
  collection = yield getInterventionLogCollection(name)
  day = get_days_since_epoch() - days_since_today
  num_impressions = yield collection.where('[type+day]').equals(['impression', day]).count()
  return num_impressions

export get_num_impressions_today = cfy (name) ->*
  yield get_num_impressions_for_days_since_today name, 0

export get_num_actions = cfy (name) ->*
  collection = yield getInterventionLogCollection(name)
  num_actions = yield collection.where('type').equals('action').count()
  return num_actions

export get_num_actions_for_days_since_today = cfy (name, days_since_today) ->*
  collection = yield getInterventionLogCollection(name)
  day = get_days_since_epoch() - days_since_today
  num_actions = yield collection.where('[type+day]').equals(['action', day]).count()
  return num_actions

export get_num_actions_today = cfy (name) ->*
  yield get_num_actions_for_days_since_today name, 0

export get_num_actions = cfy (name) ->*
  collection = yield getInterventionLogCollection(name)
  day = get_days_since_epoch()
  num_actions = yield collection.where('[type+day]').equals(['action', day]).count()
  return num_actions

export log_impression_internal = cfy (name) ->*
  # name = intervention name
  # ex: facebook/notification_hijacker
  console.log "impression logged for #{name}"
  yield addtolog name, {
    type: 'impression'
    intervention: name
  }

export log_action_internal = cfy (name, data) ->*
  # name = intervention name
  # ex: facebook/notification_hijacker
  # data: a dictionary containing any details necessary
  # ex: {}
  data = {} <<< data
  data.type = 'action'
  data.intervention = name
  console.log "action logged for #{name} with data #{JSON.stringify(data)}"
  yield addtolog name, data

upload_log_item_to_server = cfy (name, data) ->*
  logging_server_url = localStorage.getItem('logging_server_url') ? 'https://habitlab.herokuapp.com/'
  collection = yield getInterventionLogCollection(name)
  data = {} <<< data
  data.logname = name
  upload_successful = true
  try
    response = yield $.ajax({
      type: 'POST'
      url: logging_server_url + 'addtolog'
      dataType: 'json'
      contentType: 'application/json'
      data: JSON.stringify(data)
    })
    if response.success
      yield collection.where('id').equals(data.id).modify({synced: 1})
    else
      upload_successful = false
      console.log 'response from server was not successful in upload_log_item_to_server'
      console.log response
      console.log data
  catch
    upload_successful = false
    console.log 'error thrown in upload_log_item_to_server'
    console.log e
    console.log data
    console.log name
  return upload_successful

export sync_unsynced_logs = cfy (name) ->*
  collection = yield getInterventionLogCollection(name)
  num_unsynced = yield collection.where('synced').equals(0).count()
  if num_unsynced == 0
    return true
  #console.log 'num unsynced ' + num_unsynced
  unsynced_items = yield collection.where('synced').equals(0).toArray()
  #console.log 'unsynced_items are'
  #console.log unsynced_items
  all_successful = true
  for x in unsynced_items
    item_upload_success = yield upload_log_item_to_server(name, x)
    if not item_upload_success
      all_successful = false
  return all_successful

log_syncers_active = {}

export start_syncing_all_logs = cfy ->*
  log_names = yield get_log_names()
  for logname in log_names
    start_syncing_logs logname

export start_syncing_logs = cfy (name) ->*
  if log_syncers_active[name]
    console.log 'log_syncing already active for ' + name
    return
  console.log 'start syncing logs for ' + name
  log_syncers_active[name] = true
  while log_syncers_active[name] == true
    all_successful = yield sync_unsynced_logs(name)
    timeout_duration = 1000
    if not all_successful
      console.log 'setting long timeout duration for start_syncing_logs ' + name
      timeout_duration = 100000
    yield -> setTimeout it, timeout_duration

export stop_syncing_logs = cfy (name) ->*
  console.log 'stop syncing logs called for ' + name
  log_syncers_active[name] = false

export stop_syncing_all_logs = cfy ->*
  for k in Object.keys(log_syncers_active)
    log_syncers_active[k] = false

intervention_utils = require 'libs_backend/intervention_utils'
goal_utils = require 'libs_backend/goal_utils'

gexport_module 'log_utils_backend', -> eval(it)
