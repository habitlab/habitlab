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

require! {
  dexie
}

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

export getInterventionLogDb = memoizeSingleAsync (callback) ->
  interventions_list <- list_all_interventions()
  db = new dexie('interventionlog', {autoOpen: false})
  dbver = get_current_dbver_interventionlogdb()
  prev_schema = get_current_schema_interventionlogdb()
  stores_to_create = {}
  for intervention in interventions_list
    if not prev_schema[intervention]?
      stores_to_create[intervention] = '++,type'
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
  realdb <- db.open().then
  callback realdb

export deleteInterventionLogDb = (callback) ->
  localStorage.removeItem('current_schema_interventionlogdb')
  localStorage.removeItem('current_dbver_interventionlogdb')
  db = new dexie('interventionlog')
  db.delete().then ->
    callback?

export getInterventionLogCollection = (name, callback) ->
  db <- getInterventionLogDb()
  callback db[name]

export addtolog = (name, data, callback) ->
  collection <- getInterventionLogCollection(name)
  result <- collection.add(data).then
  if callback?
    callback data

export getlog = (name, callback) ->
  collection <- getInterventionLogCollection(name)
  result <- collection.toArray().then
  callback result

export clearlog = (name, callback) ->
  collection <- getInterventionLogCollection(name)
  num_deleted <- collection.delete().then
  callback?!

export get_num_impressions = (name, callback) ->
  collection <- getInterventionLogCollection(name)
  num_impressions <- collection.where('type').equals('impression').count
  callback num_impressions

export get_num_actions = (name, callback) ->
  collection <- getInterventionLogCollection(name)
  num_actions <- collection.where('type').equals('action').count
  callback num_actions

gexport_module 'log_utils_backend', -> eval(it)
