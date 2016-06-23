{
  memoize
} = require 'libs_common/memoize'

require! {
  dexie
}

{gexport} = require 'libs_common/gexport'

export getDb = memoize ->
  db = new dexie('habitlab')
  db.version(1).stores({
    vars: 'key,val'
    lists: '++,key,val'
    # composite index:
    # https://groups.google.com/forum/#!topic/dexiejs/G3_W5PssCGA
    dicts: '[name+key],name,key,val'
    dictdicts: '[name+key+key2],name,key,key2,val'
  })
  return db

export deleteDb = (callback) ->
  getDb().delete().then ->
    callback?!

export getCollection = (collection_name) ->
  db = getDb()
  return db[collection_name]

export getVarsCollection = memoize ->
  getCollection 'vars'

export getListsCollection = memoize ->
  getCollection 'lists'

export getDictsCollection = memoize ->
  getCollection 'dicts'

export getDictDictsCollection = memoize ->
  getCollection 'dictdicts'

export addtovar = (key, val, callback) ->
  data = getVarsCollection()
  new_val = val
  num_modified <- data.where(':id').equals(key).modify((x) ->
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
  data = getVarsCollection()
  <- data.put({key: key, val: val}).then
  if callback?
    callback val

export getvar = (key, callback) ->
  data = getVarsCollection()
  result <- data.get(key).then
  if result?
    return callback result.val
  else
    return callback null

export clearvar = (key, callback) ->
  data = getVarsCollection()
  num_deleted <- data.where(':id').equals(key).delete().then
  callback?!

export printvar = (key) ->
  result <- getvar key
  console.log result

export addtolist = (key, val, callback) ->
  data = getListsCollection()
  result <- data.add({'key': key, 'val': val}).then
  if callback?
    callback val

export getlist = (key, callback) ->
  data = getListsCollection()
  result <- data.where('key').equals(key).toArray().then
  callback [x.val for x in result]

export clearlist = (key, callback) ->
  data = getListsCollection()
  num_deleted <- data.where('key').equals(key).delete().then
  callback?!

export setkey_dict = (name, key, val, callback) ->
  data = getDictsCollection()
  result <- data.put({name, key, val}).then
  if callback?
    callback val

export addtokey_dict = (name, key, val, callback) ->
  data = getDictsCollection()
  new_val = val
  num_modified <- data
  .where('[name+key]')
  .equals([name, key])
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
  data = getDictsCollection()
  result <- data
  .where('[name+key]')
  .equals([name, key])
  .toArray().then
  if result.length > 0
    return callback result[0].val
  return callback!

export delkey_dict = (name, key, callback) ->
  data = getDictsCollection()
  num_deleted <- data
  .where('[name+key]')
  .equals([name, key])
  .delete().then
  callback?!

export getdict = (name, callback) ->
  data = getDictsCollection()
  result <- data
  .where('name')
  .equals(name)
  .toArray().then
  callback {[key, val] for {key, val} in result}

export cleardict = (name, callback) ->
  data = getDictsCollection()
  num_deleted <- data
  .where('name')
  .equals(name)
  .delete().then
  callback?!

export getkey_dictdict = (name, key, key2, callback) ->
  data = getDictDictsCollection()
  result <- data
  .where('[name+key+key2]')
  .equals([name, key, key2])
  .toArray().then
  if result.length > 0
    return callback result[0].val
  return callback!

export setkey_dictdict = (name, key, key2, val, callback) ->
  data = getDictDictsCollection()
  result <- data.put({name, key, key2, val}).then
  if callback?
    callback val

export addtokey_dictdict = (name, key, key2, val, callback) ->
  data = getDictDictsCollection()
  new_val = val
  num_modified <- data
  .where('[name+key+key2]')
  .equals([name, key, key2])
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

eval_dexie_utils = (str) -> eval(str)

gexport {
  eval_dexie_utils
}
