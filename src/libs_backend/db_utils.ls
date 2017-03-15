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

{yfy, cfy} = require 'cfy'

export get_db_major_version_db = -> '5'
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

export delete_db_if_outdated_db = cfy ->*
  if localStorage.getItem('db_minor_version_db') != get_db_minor_version_db()
    localStorage.setItem('db_minor_version_db', get_db_minor_version_db())
  if localStorage.getItem('db_major_version_db') != get_db_major_version_db()
    yield deleteDb()
    localStorage.removeItem('current_schema_db')
    localStorage.setItem('db_major_version_db', get_db_major_version_db())
  return

export get_current_collections = ->
  return {
    vars: 'key,synced'
    #lists: '++,key,val'
    # composite index:
    # https://groups.google.com/forum/#!topic/dexiejs/G3_W5PssCGA
    #dicts: '[name+key],name,key,val'
    #dictdicts: '[name+key+key2],[name+key],[name+key2],name,key,key2,val'
    # lists
    # '++,val'
    # dictdicts
    interventions_enabled_each_day: '[key+key2],key,key2,synced'
    interventions_manually_managed_each_day: '[key+key2],key,key2,synced'
    seconds_on_domain_per_day: '[key+key2],key,key2,synced'
    #intervention_to_options: 'key'
    visits_to_domain_per_day: '[key+key2],key,key2,synced'
    intervention_to_parameters: '[key+key2],key,key2,synced'
    custom_measurements_each_day: '[key+key2],key,key2,synced'
    seconds_on_domain_per_session: '[key+key2],key,key2,synced'
    interventions_active_for_domain_and_session: '[key+key2],key,key2,synced'
    domain_to_last_session_id: 'key,synced'
    interventions_currently_disabled: 'key,synced'
    goal_targets: 'key,synced'
    seconds_saved_for_intervention: 'key,synced'
    seconds_saved_for_domain: 'key,synced'
    seconds_saved_for_intervention_on_domain: '[key+key2],key,key2,synced'
    times_intervention_used: 'key,synced'
  }

local_cache_db = null

export getDb = cfy ->*
  if local_cache_db?
    return local_cache_db
  yield delete_db_if_outdated_db()
  db = new dexie('habitlab', {autoOpen: false})
  dbver = get_current_dbver_db()
  prev_schema = get_current_schema_db()
  stores_to_create = {}
  current_collections = get_current_collections()
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
  /*
  db.on 'versionchange', ->
    console.log '====================!!!!!!!!!------------#################'
    console.log 'versionchange'
    console.log '=====================~~~~~~~~~~~~~%%%%%%%%%###############'
    db.close()
    db.open().then (new_db) ->
      local_cache_db := new_db
    return false
  */
  local_cache_db := yield db.open()
  return local_cache_db

export deleteDb = cfy ->*
  console.log 'deleteDb called'
  localStorage.removeItem('current_schema_db')
  localStorage.removeItem('current_dbver_db')
  db = new dexie('habitlab')
  yield db.delete()
  return

export getCollection = cfy (collection_name) ->*
  db = yield getDb()
  return db[collection_name]

export addtovar = cfy (key, val) ->*
  data = yield getCollection('vars')
  new_val = val
  num_modified = yield data.where('key').equals(key).modify((x) ->
    x.synced = 0
    x.val += val
    new_val := x.val
  )
  if num_modified == 1
    return new_val
  if num_modified > 1
    console.log "addtovar #{key} matched more than 1"
    return new_val
  yield setvar key, val

export setvar = cfy (key, val) ->*
  data = yield getCollection('vars')
  yield data.put({key: key, val: val, synced: 0, timestamp: Date.now()})
  return val

export getvar = cfy (key) ->*
  data = yield getCollection('vars')
  result = yield data.get(key)
  if result?
    return result.val
  else
    return null

export clearvar = cfy (key) ->*
  data = yield getCollection('vars')
  num_deleted = yield data.where('key').equals(key).delete()
  return

export printvar = cfy (key) ->*
  result = yield getvar key
  console.log result
  return result

export addtolist = cfy (name, val) ->*
  data = yield getCollection(name)
  result = yield data.add(val)
  return val

export getlist = cfy (name) ->*
  data = yield getCollection(name)
  result = yield data.toArray()
  return result

export clearlist = cfy (name) ->*
  data = yield getCollection(name)
  num_deleted = yield data.delete()
  return

export setkey_dict = cfy (name, key, val) ->*
  data = yield getCollection(name)
  result = yield data.put({key, val, synced: 0, timestamp: Date.now()})
  return val

export addtokey_dict = cfy (name, key, val) ->*
  data = yield getCollection(name)
  new_val = val
  num_modified = yield data
  .where('key')
  .equals(key)
  .modify((x) ->
    x.synced = 0
    x.val += val
    new_val := x.val
  )
  if num_modified == 1
    return new_val
  if num_modified > 1
    console.log "addtokey_dict #{name} #{key} matched more than 1"
    return new_val
  yield setkey_dict name, key, val

export getkey_dict = cfy (name, key) ->*
  data = yield getCollection(name)
  result = yield data
  .where('key')
  .equals(key)
  .toArray()
  if result.length > 0
    return result[0].val
  return

export delkey_dict = cfy (name, key) ->*
  data = yield getCollection(name)
  num_deleted = yield data
  .where('key')
  .equals(key)
  .delete()
  return

export getdict = cfy (name) ->*
  data = yield getCollection(name)
  result = yield data
  .toArray()
  return {[key, val] for {key, val} in result}

export setdict = cfy (name, dict) ->*
  data = yield getCollection(name)
  items_to_add = [{key, val, synced: 0, timestamp: Date.now()} for key,val of dict]
  result = yield data.bulkPut(items_to_add)
  return dict

export cleardict = cfy (name) ->*
  data = yield getCollection(name)
  num_deleted = yield data
  .filter(-> true)
  .delete()
  return

export getdict_for_key_dictdict = cfy (name, key) ->*
  data = yield getCollection(name)
  result = yield data
  .where('key')
  .equals(key)
  .toArray()
  if result.length > 0
    output = {}
    for {key2, val} in result
      output[key2] = val
    return output
  return {}

export getdict_for_key2_dictdict = cfy (name, key2) ->*
  data = yield getCollection(name)
  result = yield data
  .where('key2')
  .equals(key2)
  .toArray()
  if result.length > 0
    output = {}
    for {key, val} in result
      output[key] = val
    return output
  return {}

export getkey_dictdict = cfy (name, key, key2) ->*
  data = yield getCollection(name)
  result = yield data
  .where('[key+key2]')
  .equals([key, key2])
  .toArray()
  if result.length > 0
    return result[0].val
  return

export setdict_for_key2_dictdict = cfy (name, key2, dict) ->*
  data = yield getCollection(name)
  items_to_add = [{key, key2, val, synced: 0, timestamp: Date.now()} for key,val of dict]
  result = yield data.bulkPut(items_to_add)
  return dict

export setdict_for_key_dictdict = cfy (name, key, dict) ->*
  data = yield getCollection(name)
  items_to_add = [{key, key2, val, synced: 0, timestamp: Date.now()} for key2,val of dict]
  result = yield data.bulkPut(items_to_add)
  return dict

export setkey_dictdict = cfy (name, key, key2, val) ->*
  data = yield getCollection(name)
  result = yield data.put({key, key2, val, synced: 0, timestamp: Date.now()})
  return val

export addtokey_dictdict = cfy (name, key, key2, val) ->*
  data = yield getCollection(name)
  new_val = val
  num_modified = yield data
  .where('[key+key2]')
  .equals([key, key2])
  .modify((x) ->
    x.synced = 0
    x.val += val
    new_val := x.val
  )
  if num_modified == 1
    return new_val
  if num_modified > 1
    console.log "addtokey_dictdict #{name} #{key} #{key2} matched more than 1"
    return new_val
  yield setkey_dictdict name, key, key2, val

export clear_dictdict = cfy (name) ->*
  data = yield getCollection(name)
  num_deleted = yield data
  .filter(-> true)
  .delete()
  return

gexport_module 'db_utils_backend', -> eval(it)
