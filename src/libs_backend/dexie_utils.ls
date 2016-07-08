{
  memoize
  memoizeSingleAsync
} = require 'libs_common/memoize'

require! {
  dexie
}

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

export get_db_major_version_db = -> '1'
export get_db_minor_version_db = -> '1'

export get_current_schema_db = ->
  result = localStorage.getItem('current_schema_db')
  if not result?
    return {}
  return JSON.parse result

export get_current_dbver_db = ->
  result = localStorage.getItem('current_dbver_db')
  if not result?
    return 0
  return parseInt result

export delete_db_if_outdated_db = (callback) ->
  if localStorage.getItem('db_minor_version_db') != get_db_minor_version_db()
    localStorage.setItem('db_minor_version_db', get_db_minor_version_db())
  if localStorage.getItem('db_major_version_db') != get_db_major_version_db()
    deleteDb ->
      localStorage.setItem('db_major_version_db', get_db_major_version_db())
      return callback()
  else
    return callback()

export getDb = memoizeSingleAsync (callback) ->
  <- delete_db_if_outdated_db()
  db = new dexie('habitlab', {autoOpen: false})
  dbver = get_current_dbver_db()
  prev_schema = get_current_schema_db()
  stores_to_create = {}
  current_collections = {
    vars: 'key'
    #lists: '++,key,val'
    # composite index:
    # https://groups.google.com/forum/#!topic/dexiejs/G3_W5PssCGA
    #dicts: '[name+key],name,key,val'
    #dictdicts: '[name+key+key2],[name+key],[name+key2],name,key,key2,val'
    # lists
    # '++,val'
    # dictdicts
    interventions_enabled_each_day: '[key+key2],key,key2'
    interventions_manually_managed_each_day: '[key+key2],key,key2'
    seconds_on_domain_per_day: '[key+key2],key,key2'
    #intervention_to_options: 'key'
    visits_to_domain_per_day: '[key+key2],key,key2'
    intervention_to_parameters: '[key+key2],key,key2'
  }
  for k,v of current_collections
    if not prev_schema[k]?
      stores_to_create[k] = v
  new_schema = {[k,v] for k,v of prev_schema}
  if Object.keys(stores_to_create).length > 0
    db.version(dbver).stores(prev_schema)
    dbver += 1
    for k,v of stores_to_create
      new_schema[k] = v
    db.on 'ready', ->
      localStorage.setItem 'current_schema_db', JSON.stringify(new_schema)
      localStorage.setItem 'current_dbver_db', dbver
  db.version(dbver).stores(new_schema)
  realdb <- db.open().then
  callback realdb

export deleteDb = (callback) ->
  console.log 'deleteDb called'
  localStorage.removeItem('current_schema_db')
  localStorage.removeItem('current_dbver_db')
  db = new dexie('habitlab')
  db.delete().then ->
    callback?!

export getCollection = (collection_name, callback) ->
  db <- getDb()
  callback db[collection_name]

export addtovar = (key, val, callback) ->
  data <- getCollection('vars')
  new_val = val
  num_modified <- data.where('key').equals(key).modify((x) ->
    x.val += val
    new_val := x.val
  ).then
  if num_modified == 1
    if callback?
      callback(new_val)
    return
  if num_modified > 1
    console.log "addtovar #{key} matched more than 1"
    if callback?
      callback(new_val)
    return
  setvar key, val, callback

export setvar = (key, val, callback) ->
  data <- getCollection('vars')
  <- data.put({key: key, val: val}).then
  if callback?
    callback val

export getvar = (key, callback) ->
  data <- getCollection('vars')
  result <- data.get(key).then
  if result?
    return callback result.val
  else
    return callback null

export clearvar = (key, callback) ->
  data <- getCollection('vars')
  num_deleted <- data.where('key').equals(key).delete().then
  callback?!

export printvar = (key) ->
  result <- getvar key
  console.log result

export addtolist = (name, val, callback) ->
  data <- getCollection(name)
  result <- data.add(val).then
  if callback?
    callback val

export getlist = (name, callback) ->
  data <- getCollection(name)
  result <- data.toArray().then
  callback result

export clearlist = (name, callback) ->
  data <- getCollection(name)
  num_deleted <- data.delete().then
  callback?!

export setkey_dict = (name, key, val, callback) ->
  data <- getCollection(name)
  result <- data.put({key, val}).then
  if callback?
    callback val

export addtokey_dict = (name, key, val, callback) ->
  data <- getCollection(name)
  new_val = val
  num_modified <- data
  .where('key')
  .equals(key)
  .modify((x) ->
    x.val += val
    new_val := x.val
  ).then
  if num_modified == 1
    if callback?
      callback(new_val)
    return
  if num_modified > 1
    console.log "addtokey_dict #{name} #{key} matched more than 1"
    if callback?
      callback(new_val)
    return
  setkey_dict name, key, val, callback

export getkey_dict = (name, key, callback) ->
  data <- getCollection(name)
  result <- data
  .where('key')
  .equals(key)
  .toArray().then
  if result.length > 0
    return callback result[0].val
  return callback!

export delkey_dict = (name, key, callback) ->
  data <- getCollection(name)
  num_deleted <- data
  .where('key')
  .equals(key)
  .delete().then
  callback?!

export getdict = (name, callback) ->
  data <- getCollection(name)
  result <- data
  .toArray().then
  callback {[key, val] for {key, val} in result}

export cleardict = (name, callback) ->
  data <- getCollection(name)
  num_deleted <- data
  .delete().then
  callback?!

export getdict_for_key_dictdict = (name, key, callback) ->
  data <- getCollection(name)
  result <- data
  .where('key')
  .equals(key)
  .toArray().then
  if result.length > 0
    output = {}
    for {key2, val} in result
      output[key2] = val
    return callback output
  return callback {}

export getdict_for_key2_dictdict = (name, key2, callback) ->
  data <- getCollection(name)
  result <- data
  .where('key2')
  .equals(key2)
  .toArray().then
  if result.length > 0
    output = {}
    for {key, val} in result
      output[key] = val
    return callback output
  return callback {}

export getkey_dictdict = (name, key, key2, callback) ->
  data <- getCollection(name)
  result <- data
  .where('[key+key2]')
  .equals([key, key2])
  .toArray().then
  if result.length > 0
    return callback result[0].val
  return callback!

export setdict_for_key2_dictdict = (name, key2, dict, callback) ->
  data <- getCollection(name)
  items_to_add = [{key, key2, val} for key,val of dict]
  result <- data.bulkPut(items_to_add).then
  if callback?
    callback dict

export setdict_for_key_dictdict = (name, key, dict, callback) ->
  data <- getCollection(name)
  items_to_add = [{key, key2, val} for key2,val of dict]
  result <- data.bulkPut(items_to_add).then
  if callback?
    callback dict

export setkey_dictdict = (name, key, key2, val, callback) ->
  data <- getCollection(name)
  result <- data.put({key, key2, val}).then
  if callback?
    callback val

export addtokey_dictdict = (name, key, key2, val, callback) ->
  data <- getCollection(name)
  new_val = val
  num_modified <- data
  .where('[key+key2]')
  .equals([key, key2])
  .modify((x) ->
    x.val += val
    new_val := x.val
  ).then
  if num_modified == 1
    if callback?
      callback(new_val)
    return
  if num_modified > 1
    console.log "addtokey_dictdict #{name} #{key} #{key2} matched more than 1"
    if callback?
      callback(new_val)
    return
  setkey_dictdict name, key, key2, val, callback

export clear_dictdict = (name, callback) ->
  data <- getCollection(name)
  num_deleted <- data
  .delete().then
  callback?!

/*
export addtolist = (name, val, callback) ->
  data <- getListsCollection()
  result <- data.upsert {name: name, val: val}
  if callback?
    callback()

export getlist = (name, callback) ->
  data <- getListsCollection()
  result <- data.find({name: name}).fetch()
  callback [x.val for x in result]

export clearlist = (name, callback) ->
  data <- getListsCollection()
  result <- data.find({name: name}).fetch()
  <- async.eachSeries result, (item, ncallback) ->
    <- data.remove item['_id']
    ncallback()
  if callback?
    callback()

export printlist = (name) ->
  result <- getlist name
  console.log result

export clear_all_lists = (callback) ->
  data <- getListsCollection()
  result <- data.find({}).fetch()
  <- async.eachSeries result, (item, ncallback) ->
    <- data.remove item['_id']
    ncallback()
  if callback?
    callback()

export clear_all_vars = (callback) ->
  data <- getVarsCollection()
  result <- data.find({}).fetch()
  <- async.eachSeries result, (item, ncallback) ->
    <- data.remove item['_id']
    ncallback()
  if callback?
    callback()

export clear_all = (callback) ->
  <- async.series [
    clear_all_vars
    clear_all_lists
  ]
  if callback?
    callback()
*/

gexport_module 'dexie_utils', -> eval(it)
