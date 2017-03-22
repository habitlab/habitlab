{
  get_log_names
  getInterventionLogCollection
} = require 'libs_backend/log_utils'

{
  get_current_collections
  getCollection
} = require 'libs_backend/db_utils'

{
  get_user_id
} = require 'libs_backend/background_common'

$ = require 'jquery'

{cfy} = require 'cfy'

{
  sleep
} = require 'libs_frontend/common_libs'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

chrome_manifest = chrome.runtime.getManifest()
habitlab_version = chrome_manifest.version
developer_mode = not chrome_manifest.update_url?
unofficial_version = chrome.runtime.id != 'obghclocpdgcekcognpkblghkedcpdgd'

export start_syncing_all_data = ->
  if localStorage.getItem('allow_logging') != 'true'
    dlog 'logging disabled, not syncing data'
    return
  start_syncing_all_logs()
  start_syncing_all_db_collections()

export stop_syncing_all_data = ->
  stop_syncing_all_db_collections()
  stop_syncing_all_logs()

# logs syncing

upload_log_item_to_server = cfy (name, data) ->*
  if localStorage.getItem('local_logging_server') == 'true'
    logging_server_url = 'http://localhost:5000/'
  else
    logging_server_url = 'https://habitlab.herokuapp.com/'
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
      dlog 'response from server was not successful in upload_log_item_to_server'
      dlog response
      dlog data
  catch
    upload_successful = false
    dlog 'error thrown in upload_log_item_to_server'
    dlog e
    dlog data
    dlog name
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
      return false
  return all_successful

log_syncing_active = false

export start_syncing_all_logs = cfy ->*
  if log_syncing_active
    dlog 'log_syncing already active'
    return
  log_syncing_active := true
  log_names = yield get_log_names()
  while log_syncing_active
    for logname in log_names
      if not log_syncing_active
        return
      all_successful = yield sync_unsynced_logs(logname)
      if not all_successful
        dlog 'error during logs syncing, pausing 60 seconds: ' + logname
        yield sleep(60000)
    yield sleep(1000)

export stop_syncing_all_logs = ->
  log_syncing_active := false

/*
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
*/


make_item_synced_in_collection = cfy (collection_name, item) ->*
  collection = yield getCollection(collection_name)
  schema = get_current_collections()[collection_name]
  primary_key = schema.split(',')[0]
  if primary_key == 'key'
    query = item.key
  else if primary_key == '[key+key2]'
    query = [item.key, item.key2]
  else
    throw new Error('collection has primary key that we do not handle: ' + collection_name)
  yield collection.where(primary_key).equals(query).and((x) -> x.timestamp == item.timestamp).modify({synced: 1})

upload_collection_item_to_server = cfy (name, data) ->*
  if localStorage.getItem('local_logging_server') == 'true'
    logging_server_url = 'http://localhost:5000/'
  else
    logging_server_url = 'https://habitlab.herokuapp.com/'
  collection = yield getCollection(name)
  data = {} <<< data
  data.userid = yield get_user_id()
  data.collection = name
  data.habitlab_version = habitlab_version
  if developer_mode
    data.developer_mode = true
  if unofficial_version
    data.unofficial_version = chrome.runtime.id
  upload_successful = true
  try
    response = yield $.ajax({
      type: 'POST'
      url: logging_server_url + 'sync_collection_item'
      dataType: 'json'
      contentType: 'application/json'
      data: JSON.stringify(data)
    })
    if response.success
      yield make_item_synced_in_collection(name, data)
    else
      upload_successful = false
      dlog 'response from server was not successful in upload_collection_item_to_server'
      dlog response
      dlog data
  catch
    dlog 'error thrown in upload_collection_item_to_server'
    dlog e
    upload_successful = false
  return upload_successful

export sync_unsynced_items_in_db_collection = cfy (name) ->*
  collection = yield getCollection(name)
  num_unsynced = yield collection.where('synced').equals(0).count()
  if num_unsynced == 0
    return true
  #console.log 'num_unsynced: ' + num_unsynced
  unsynced_items = yield collection.where('synced').equals(0).toArray()
  #console.log 'unsynced_items are'
  #console.log unsynced_items
  all_successful = true
  for x in unsynced_items
    item_upload_success = yield upload_collection_item_to_server(name, x)
    if not item_upload_success
      all_successful = false
      return false
  return all_successful

db_syncing_active = false

export start_syncing_all_db_collections = cfy ->*
  if db_syncing_active
    dlog 'db_syncing already active'
    return
  db_syncing_active := true
  collection_names = Object.keys get_current_collections()
  while db_syncing_active
    for collection_name in collection_names
      if not db_syncing_active
        return
      all_successful = yield sync_unsynced_items_in_db_collection(collection_name)
      if not all_successful
        dlog 'error during collection syncing, pausing 60 seconds: ' + collection_name
        yield sleep(60000)
    yield sleep(1000)

export stop_syncing_all_db_collections = ->
  db_syncing_active := false

/*
collection_syncers_active = {}

export start_syncing_db_collection = cfy (name) ->*
  if collection_syncers_active[name]
    console.log 'collection_syncing already active for ' + name
    return
  console.log 'start syncing collection for ' + name
  collection_syncers_active[name] = true
  while collection_syncers_active[name] == true
    yield sync_unsynced_items_in_db_collection(name)
    yield -> setTimeout it, 60000 # should change to every 60 seconds (60000)

export start_syncing_all_db_collections = cfy ->*
  collection_names = Object.keys get_current_collections()
  for collection_name in collection_names
    start_syncing_db_collection collection_name

export stop_syncing_db_collection = cfy (name) ->*
  console.log 'stop syncing collection called for ' + name
  collection_syncers_active[name] = false

export stop_syncing_all_db_collections = cfy (name) ->*
  for k in Object.keys(collection_syncers_active)
    collection_syncers_active[k] = false
*/

gexport_module 'log_sync_utils', -> eval(it)
