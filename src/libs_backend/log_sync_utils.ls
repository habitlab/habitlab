{
  get_log_names
  getInterventionLogCollection
} = require 'libs_backend/log_utils'

{
  get_current_collections
  list_collections_to_sync
  getCollection
} = require 'libs_backend/db_utils'

{
  get_user_id
} = require 'libs_backend/background_common'

$ = require 'jquery'

{cfy} = require 'cfy'

{
  sleep
} = require 'libs_common/common_libs'

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

upload_log_item_to_server = (name, data) ->>
  if localStorage.getItem('local_logging_server') == 'true'
    logging_server_url = 'http://localhost:5000/'
  else
    logging_server_url = 'https://habitlab.herokuapp.com/'
  collection = await getInterventionLogCollection(name)
  data = {} <<< data
  data.logname = name
  upload_successful = true
  try
    response = await $.ajax({
      type: 'POST'
      url: logging_server_url + 'addtolog'
      dataType: 'json'
      contentType: 'application/json'
      data: JSON.stringify(data)
    })
    if response.success
      await collection.where('id').equals(data.id).modify({synced: 1})
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

export sync_unsynced_logs = (name) ->>
  collection = await getInterventionLogCollection(name)
  num_unsynced = await collection.where('synced').equals(0).count()
  if num_unsynced == 0
    return true
  #console.log 'num unsynced ' + num_unsynced
  unsynced_items = await collection.where('synced').equals(0).toArray()
  #console.log 'unsynced_items are'
  #console.log unsynced_items
  all_successful = true
  for x in unsynced_items
    item_upload_success = await upload_log_item_to_server(name, x)
    if not item_upload_success
      all_successful = false
      return false
  return all_successful

log_syncing_active = false

export start_syncing_all_logs = ->>
  if log_syncing_active
    dlog 'log_syncing already active'
    return
  log_syncing_active := true
  while log_syncing_active
    log_names = await get_log_names()
    for logname in log_names
      if not log_syncing_active
        return
      all_successful = await sync_unsynced_logs(logname)
      if not all_successful
        dlog 'error during logs syncing, pausing 120 seconds: ' + logname
        await sleep(120000)
    await sleep(1000)

export stop_syncing_all_logs = ->
  log_syncing_active := false

make_item_synced_in_collection = (collection_name, item) ->>
  collection = await getCollection(collection_name)
  schema = get_current_collections()[collection_name]
  primary_key = schema.split(',')[0]
  if primary_key == 'key'
    query = item.key
  else if primary_key == '[key+key2]'
    query = [item.key, item.key2]
  else
    throw new Error('collection has primary key that we do not handle: ' + collection_name)
  await collection.where(primary_key).equals(query).and((x) -> x.timestamp == item.timestamp).modify({synced: 1})

upload_collection_item_to_server = (name, data) ->>
  if localStorage.getItem('local_logging_server') == 'true'
    logging_server_url = 'http://localhost:5000/'
  else
    logging_server_url = 'https://habitlab.herokuapp.com/'
  collection = await getCollection(name)
  data = {} <<< data
  data.userid = await get_user_id()
  data.collection = name
  data.habitlab_version = habitlab_version
  if developer_mode
    data.developer_mode = true
  if unofficial_version
    data.unofficial_version = chrome.runtime.id
  upload_successful = true
  try
    response = await $.ajax({
      type: 'POST'
      url: logging_server_url + 'sync_collection_item'
      dataType: 'json'
      contentType: 'application/json'
      data: JSON.stringify(data)
    })
    if response.success
      await make_item_synced_in_collection(name, data)
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

export sync_unsynced_items_in_db_collection = (name) ->>
  collection = await getCollection(name)
  num_unsynced = await collection.where('synced').equals(0).count()
  if num_unsynced == 0
    return true
  #console.log 'num_unsynced: ' + num_unsynced
  unsynced_items = await collection.where('synced').equals(0).toArray()
  #console.log 'unsynced_items are'
  #console.log unsynced_items
  all_successful = true
  for x in unsynced_items
    item_upload_success = await upload_collection_item_to_server(name, x)
    if not item_upload_success
      all_successful = false
      return false
  return all_successful

db_syncing_active = false

export start_syncing_all_db_collections = ->>
  if db_syncing_active
    dlog 'db_syncing already active'
    return
  db_syncing_active := true
  collection_names = list_collections_to_sync()
  while db_syncing_active
    for collection_name in collection_names
      if not db_syncing_active
        return
      all_successful = await sync_unsynced_items_in_db_collection(collection_name)
      if not all_successful
        dlog 'error during collection syncing, pausing 1200 seconds: ' + collection_name
        await sleep(1200000)
    await sleep(120000)

export stop_syncing_all_db_collections = ->
  db_syncing_active := false

gexport_module 'log_sync_utils', -> eval(it)
