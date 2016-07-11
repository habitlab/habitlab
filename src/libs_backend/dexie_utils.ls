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

export delete_db_if_outdated_db = cfy ->*
  if localStorage.getItem('db_minor_version_db') != get_db_minor_version_db()
    localStorage.setItem('db_minor_version_db', get_db_minor_version_db())
  if localStorage.getItem('db_major_version_db') != get_db_major_version_db()
    yield deleteDb()
    localStorage.setItem('db_major_version_db', get_db_major_version_db())
  return

export getDb = memoizeSingleAsync cfy ->*
  yield delete_db_if_outdated_db()
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
  realdb = yield db.open()
  return realdb

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
  yield data.put({key: key, val: val})
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
  result = yield data.put({key, val})
  return val

export addtokey_dict = cfy (name, key, val) ->*
  data = yield getCollection(name)
  new_val = val
  num_modified = yield data
  .where('key')
  .equals(key)
  .modify((x) ->
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

export cleardict = cfy (name) ->*
  data = yield getCollection(name)
  num_deleted = yield data
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
  items_to_add = [{key, key2, val} for key,val of dict]
  result = yield data.bulkPut(items_to_add)
  return dict

export setdict_for_key_dictdict = cfy (name, key, dict) ->*
  data = yield getCollection(name)
  items_to_add = [{key, key2, val} for key2,val of dict]
  result = yield data.bulkPut(items_to_add)
  return dict

export setkey_dictdict = cfy (name, key, key2, val) ->*
  data = yield getCollection(name)
  result = yield data.put({key, key2, val})
  return val

export addtokey_dictdict = cfy (name, key, key2, val) ->*
  data = yield getCollection(name)
  new_val = val
  num_modified = yield data
  .where('[key+key2]')
  .equals([key, key2])
  .modify((x) ->
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
  .delete()
  return

gexport_module 'dexie_utils', -> eval(it)
