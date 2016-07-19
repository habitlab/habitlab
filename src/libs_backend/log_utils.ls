{
  memoize
  memoizeSingleAsync
} = require 'libs_common/memoize'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  list_all_interventions
} = require 'libs_backend/intervention_utils'

{
  get_days_since_epoch
} = require 'libs_common/time_utils'

require! {
  dexie
}

{cfy} = require 'cfy'

export get_db_major_version_interventionlogdb = -> '3'
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

export getInterventionLogDb = memoizeSingleAsync cfy ->*
  yield delete_db_if_outdated_interventionlogdb()
  interventions_list = yield list_all_interventions()
  db = new dexie('interventionlog', {autoOpen: false})
  dbver = get_current_dbver_interventionlogdb()
  prev_schema = get_current_schema_interventionlogdb()
  stores_to_create = {}
  for intervention in interventions_list
    if not prev_schema[intervention]?
      stores_to_create[intervention] = '++,[type+day],type,day,synced'
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

export addtolog = cfy (name, data) ->*
  data = JSON.parse JSON.stringify data
  data.userid = yield get_user_id()
  data.day = get_days_since_epoch()
  data.synced = 0
  data.timestamp = Date.now()
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

export log_impression = cfy (name) ->*
  # name = intervention name
  # ex: facebook/notification_hijacker
  console.log "impression logged for #{name}"
  yield addtolog name, {
    type: 'impression'
  }

export log_action = cfy (name, data) ->*
  # name = intervention name
  # ex: facebook/notification_hijacker
  # data: a dictionary containing any details necessary
  # ex: {}
  new_data = {}
  for k,v of data
    new_data[k] = v
  new_data.type = 'action'
  console.log "action logged for #{name} with data #{JSON.stringify(data)}"
  yield addtolog name, new_data

gexport_module 'log_utils_backend', -> eval(it)
