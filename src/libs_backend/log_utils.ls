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

export getInterventionLogDb = memoizeSingleAsync (callback) ->
  interventions_list <- list_all_interventions()
  db = new dexie('interventionlog')
  verno = db.verno
  for intervention in interventions_list
    if not db[intervention]?
      verno += 1
      new_store = {}
      new_store[intervention] = '++,type'
      db.version(verno).stores(new_store)
  callback db

export deleteInterventionLogDb = (callback) ->
  db <- getInterventionLogDb()
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
