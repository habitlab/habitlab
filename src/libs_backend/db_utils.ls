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

export delete_db_if_outdated_db = ->>
  if localStorage.getItem('db_minor_version_db') != get_db_minor_version_db()
    localStorage.setItem('db_minor_version_db', get_db_minor_version_db())
  if localStorage.getItem('db_major_version_db') != get_db_major_version_db()
    await deleteDb()
    localStorage.removeItem('current_schema_db')
    localStorage.setItem('db_major_version_db', get_db_major_version_db())
  return

current_schema_for_collections = {
  vars: 'key,synced'
  intervention_vars_synced: '[key+key2],key,key2,synced'
  intervention_vars_unsynced: '[key+key2],key,key2'
  goal_vars_synced: '[key+key2],key,key2,synced'
  goal_vars_unsynced: '[key+key2],key,key2'
  experiment_vars_for_goal: '[key+key2],key,key2,synced'
  experiment_vars: 'key,synced'
  history_vars: 'key,synced'
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
  domains_suggested_as_goals: 'key,synced'
  interventions_to_intensity_ratings: 'key,synced'
  custom_intervention_code: 'key'
  custom_intervention_code_original: 'key,synced'
  interventions_currently_disabled: 'key,synced'
  goal_targets: 'key,synced'
  goal_frequencies: 'key,synced'
  time_intervention_most_recently_seen: 'key,synced'
  seconds_saved_for_intervention: 'key,synced'
  seconds_saved_for_domain: 'key,synced'
  seconds_saved_for_intervention_on_domain: '[key+key2],key,key2,synced'
  baseline_session_time_on_domains: 'key,synced'
  baseline_time_on_domains: 'key,synced'
  times_intervention_used: 'key,synced'
  intervention_downvote_timestamps: '++,key,synced'
  intervention_upvote_timestamps: '++,key,synced'
  intervention_feedback: '++,key,synced'
  idea_pairs_voted: '++'
}

export get_current_collections = ->
  return current_schema_for_collections

export list_collections_to_sync = ->
  output = []
  for k,v of current_schema_for_collections
    if v.endsWith(',synced')
      output.push k
  return output

export is_collection_synced = (collection_name) ->
  if current_schema_for_collections[collection_name]? and current_schema_for_collections[collection_name].endsWith(',synced')
    return true
  return false

sleep = (time) ->>
  return new Promise ->
    setTimeout(it, time)

local_cache_db = null
getdb_running = false

export getDb = ->>
  if local_cache_db? and local_cache_db.isOpen()
    return local_cache_db
  if getdb_running
    while getdb_running
      await sleep(1)
    while getdb_running or local_cache_db == null
      await sleep(1)
    return local_cache_db
  getdb_running := true
  await delete_db_if_outdated_db()
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
    localStorage.setItem 'current_schema_db', JSON.stringify(new_schema)
    localStorage.setItem 'current_dbver_db', dbver
    #db.on 'ready', ->
  db.version(dbver).stores(new_schema)
  db.on 'versionchange', ->
    db.close()
    prev_schema = get_current_schema_db()
    dbver := parseInt localStorage.getItem('current_dbver_db')
    db.version(dbver).stores(prev_schema)
    db.open().then (new_db) ->
      local_cache_db := new_db
    return false
  local_cache_db := await db.open()
  getdb_running := false
  return local_cache_db

export deleteDbCollection = (collection_name) ->>
  db = await getDb()
  db.close()
  dbver = get_current_dbver_db()
  dbver += 1
  schema = get_current_schema_db()
  schema[collection_name] = null
  db.version(dbver).stores(schema)
  localStorage.setItem 'current_schema_db', JSON.stringify(schema)
  localStorage.setItem 'current_dbver_db', dbver
  local_cache_db := await db.open()

export deleteDb = ->>
  console.log 'deleteDb called'
  localStorage.removeItem('current_schema_db')
  localStorage.removeItem('current_dbver_db')
  db = new dexie('habitlab')
  await db.delete()
  return

export getCollection = (collection_name) ->>
  db = await getDb()
  return db[collection_name]

export addtovar = (key, val) ->>
  data = await getCollection('vars')
  new_val = val
  num_modified = await data.where('key').equals(key).modify((x) ->
    x.synced = 0
    x.val += val
    new_val := x.val
  )
  if num_modified == 1
    return new_val
  if num_modified > 1
    console.log "addtovar #{key} matched more than 1"
    return new_val
  await setvar key, val

export setvar = (key, val) ->>
  data = await getCollection('vars')
  await data.put({key: key, val: val, synced: 0, timestamp: Date.now()})
  return val

export getvar = (key) ->>
  data = await getCollection('vars')
  result = await data.get(key)
  if result?
    return result.val
  else
    return null

export clearvar = (key) ->>
  data = await getCollection('vars')
  num_deleted = await data.where('key').equals(key).delete()
  return

export printvar = (key) ->>
  result = await getvar key
  console.log result
  return result

export setvar_experiment = (key, val) ->>
  data = await getCollection('experiment_vars')
  await data.put({key: key, val: val, synced: 0, timestamp: Date.now()})
  return val

export getvar_experiment = (key) ->>
  data = await getCollection('experiment_vars')
  result = await data.get(key)
  if result?
    return result.val
  else
    return null

export clearvar_experiment = (key) ->>
  data = await getCollection('experiment_vars')
  num_deleted = await data.where('key').equals(key).delete()
  return

export printvar_experiment = (key) ->>
  result = await getvar_experiment key
  console.log result
  return result

export setvar_history = (key, val) ->>
  data = await getCollection('history_vars')
  await data.put({key: key, val: val, synced: 0, timestamp: Date.now()})
  return val

export getvar_history = (key) ->>
  data = await getCollection('history_vars')
  result = await data.get(key)
  if result?
    return result.val
  else
    return null

export clearvar_history = (key) ->>
  data = await getCollection('history_vars')
  num_deleted = await data.where('key').equals(key).delete()
  return

export printvar_history = (key) ->>
  result = await getvar_history key
  console.log result
  return result

export remove_key_from_var_dict = (dictname, key) ->>
  dict_text = await getvar dictname
  if dict_text?
    dict = JSON.parse dict_text
  else
    dict = {}
  if dict[key]?
    delete dict[key]
  await setvar dictname, JSON.stringify(dict)
  return

export remove_item_from_var_list = (listname, item) ->>
  list_text = await getvar listname
  if list_text?
    list = JSON.parse list_text
  else
    list = []
  list = list.filter -> it != item
  await setvar listname, JSON.stringify(list)

export addtolist = (name, val) ->>
  data = await getCollection(name)
  result = await data.add(val)
  return val

export getlist = (name) ->>
  data = await getCollection(name)
  result = await data.toArray()
  return result

export clearlist = (name) ->>
  data = await getCollection(name)
  num_deleted = await data.delete()
  return

export addtolist_for_key = (name, key, val) ->>
  data = await getCollection(name)
  newval = {
    key: key
    val: val
  }
  result = await data.add(newval)
  return newval

export getlist_for_key = (name, key) ->>
  data = await getCollection(name)
  result = await data
  .where('key')
  .equals(key)
  .toArray()
  return result.map((.val))

export clearlist_for_key = (name, key) ->>
  data = await getCollection(name)
  num_deleted = await data
  .where('key')
  .equals(key)
  .delete()
  return

export setkey_dict = (name, key, val) ->>
  data = await getCollection(name)
  result = await data.put({key, val, synced: 0, timestamp: Date.now()})
  return val

export addtokey_dict = (name, key, val) ->>
  data = await getCollection(name)
  new_val = val
  num_modified = await data
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
  await setkey_dict name, key, val

export getkey_dict = (name, key) ->>
  data = await getCollection(name)
  result = await data
  .where('key')
  .equals(key)
  .toArray()
  if result.length > 0
    return result[0].val
  return

export delkey_dict = (name, key) ->>
  data = await getCollection(name)
  num_deleted = await data
  .where('key')
  .equals(key)
  .delete()
  return

export getdict = (name) ->>
  data = await getCollection(name)
  result = await data
  .toArray()
  return {[key, val] for {key, val} in result}

export setdict = (name, dict) ->>
  data = await getCollection(name)
  items_to_add = [{key, val, synced: 0, timestamp: Date.now()} for key,val of dict]
  result = await data.bulkPut(items_to_add)
  return dict

export cleardict = (name) ->>
  data = await getCollection(name)
  num_deleted = await data
  .filter(-> true)
  .delete()
  return

export getdictdict = (name) ->>
  data = await getCollection(name)
  result = await data
  .toArray()
  output = {}
  for {key, key2, val} in result
    if not output[key]?
      output[key] = {}
    output[key][key2] = val
  return output

export getdict_for_key_dictdict = (name, key) ->>
  data = await getCollection(name)
  result = await data
  .where('key')
  .equals(key)
  .toArray()
  if result.length > 0
    output = {}
    for {key2, val} in result
      output[key2] = val
    return output
  return {}

export getdict_for_key2_dictdict = (name, key2) ->>
  data = await getCollection(name)
  result = await data
  .where('key2')
  .equals(key2)
  .toArray()
  if result.length > 0
    output = {}
    for {key, val} in result
      output[key] = val
    return output
  return {}

export getkey_dictdict = (name, key, key2) ->>
  data = await getCollection(name)
  result = await data
  .where('[key+key2]')
  .equals([key, key2])
  .toArray()
  if result.length > 0
    return result[0].val
  return

export setdict_for_key2_dictdict = (name, key2, dict) ->>
  data = await getCollection(name)
  items_to_add = [{key, key2, val, synced: 0, timestamp: Date.now()} for key,val of dict]
  result = await data.bulkPut(items_to_add)
  return dict

export setdict_for_key_dictdict = (name, key, dict) ->>
  data = await getCollection(name)
  items_to_add = [{key, key2, val, synced: 0, timestamp: Date.now()} for key2,val of dict]
  result = await data.bulkPut(items_to_add)
  return dict

export setkey_dictdict = (name, key, key2, val) ->>
  data = await getCollection(name)
  result = await data.put({key, key2, val, synced: 0, timestamp: Date.now()})
  return val

export addtokey_dictdict = (name, key, key2, val) ->>
  data = await getCollection(name)
  new_val = val
  num_modified = await data
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
  await setkey_dictdict name, key, key2, val

export clear_dictdict = (name) ->>
  data = await getCollection(name)
  num_deleted = await data
  .filter(-> true)
  .delete()
  return

gexport_module 'db_utils_backend', -> eval(it)
