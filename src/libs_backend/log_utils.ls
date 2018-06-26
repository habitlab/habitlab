{
  memoize
  memoizeSingleAsync
} = require 'libs_common/memoize'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  get_days_since_epoch
} = require 'libs_common/time_utils'

{
  get_user_id
  get_install_id
} = require 'libs_backend/background_common'

{
  sleep
} = require 'libs_common/common_libs'

require! {
  dexie
}

{generate_random_id} = require 'libs_common/generate_random_id'

chrome_manifest = chrome.runtime.getManifest()
habitlab_version = chrome_manifest.version
developer_mode = not chrome_manifest.update_url?
unofficial_version = chrome.runtime.id != 'obghclocpdgcekcognpkblghkedcpdgd'

export get_db_major_version_interventionlogdb = -> '8'
export get_db_minor_version_interventionlogdb = -> '1'

export delete_db_if_outdated_interventionlogdb = ->>
  if localStorage.getItem('db_minor_version_interventionlogdb') != get_db_minor_version_interventionlogdb()
    localStorage.setItem('db_minor_version_interventionlogdb', get_db_minor_version_interventionlogdb())
  if localStorage.getItem('db_major_version_interventionlogdb') != get_db_major_version_interventionlogdb()
    await deleteInterventionLogDb()
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

export get_interventions_seen_today = ->>
  interventions = await intervention_utils.list_all_interventions()
  enabled = await intervention_utils.get_enabled_interventions()
  invns = []
  for intervention in interventions #get interventions seen today
    result = await get_num_impressions_today(intervention)
    if result > 0
      invns.push intervention
  for key in Object.keys(enabled) #filter for enabled interventions
    if enabled[key] == false
      delete enabled[key]
  combined = Array.from(new Set(invns.concat(enabled))) #remove duplicates
  combined.pop()
  return combined

export get_log_names = ->>
  interventions_list = await intervention_utils.list_all_interventions()
  logs_list = ['goals', 'interventions', 'feedback', 'pages', 'enabledisable'].map -> 'logs/'+it
  return interventions_list.concat(logs_list)

intervention_logdb_cache = null

export clear_intervention_logdb_cache = ->
  if intervention_logdb_cache?
    intervention_logdb_cache.close()
  intervention_logdb_cache := null

export getInterventionLogDb = ->>
  if intervention_logdb_cache? and intervention_logdb_cache.isOpen()
    return intervention_logdb_cache
  output = await getInterventionLogDb_uncached()
  intervention_logdb_cache := output
  return intervention_logdb_cache

seen_interventions_cache = localStorage.getItem('seen_interventions_cache')
if seen_interventions_cache?
  seen_interventions_cache = JSON.parse(seen_interventions_cache)
else
  seen_interventions_cache = {}

export check_if_intervention_has_been_seen_and_record_as_seen_if_not = (intervention_name) ->>
  if seen_interventions_cache[intervention_name]
    return true
  seen_interventions_cache[intervention_name] = true
  intervention_log_db = await getInterventionLogDb()
  intervention_log_collection = intervention_log_db[intervention_name]
  intervention_seen = false
  if intervention_log_collection?
    num_items_in_log = await intervention_log_collection.count()
    if num_items_in_log > 0
      intervention_seen = true
  if intervention_seen
    return true
  seen_interventions_cache[intervention_name] = true
  localStorage.setItem('seen_interventions_cache', JSON.stringify(seen_interventions_cache))
  cur_epoch = get_days_since_epoch()
  await db_utils.setvar('last_epoch_new_intervention_seen', cur_epoch)
  return false

export check_if_intervention_has_been_seen = (intervention_name) ->>
  if seen_interventions_cache[intervention_name]
    return true
  intervention_log_db = await getInterventionLogDb()
  intervention_log_collection = intervention_log_db[intervention_name]
  if not intervention_log_collection?
    return false
  num_items_in_log = await intervention_log_collection.count()
  return num_items_in_log > 0

getInterventionLogDb_uncached = ->>
  await delete_db_if_outdated_interventionlogdb()
  log_names = await get_log_names()
  db = new dexie('interventionlog', {autoOpen: false})
  dbver = get_current_dbver_interventionlogdb()
  prev_schema = get_current_schema_interventionlogdb()
  stores_to_create = {}
  for logname in log_names
    if not prev_schema[logname]?
      stores_to_create[logname] = '++id,[type+day],type,day,itemid,synced'
  new_schema = {[k,v] for k,v of prev_schema}
  if Object.keys(stores_to_create).length > 0
    db.version(dbver).stores(prev_schema)
    dbver += 1
    for k,v of stores_to_create
      new_schema[k] = v
    db.on 'ready', ->
      localStorage.setItem 'current_schema_interventionlogdb', JSON.stringify(new_schema)
      localStorage.setItem 'current_dbver_interventionlogdb', dbver
    db.on 'versionchange', ->
      intervention_logdb_cache := null
      db.close()
      intervention_logdb_cache := null
  db.version(dbver).stores(new_schema)
  realdb = await db.open()
  return realdb

export deleteInterventionLogDb = ->>
  console.log 'deleteInterventionLogDb called'
  localStorage.removeItem('current_schema_interventionlogdb')
  localStorage.removeItem('current_dbver_interventionlogdb')
  db = new dexie('interventionlog')
  await db.delete()
  return

export getInterventionLogCollection = (name) ->>
  db = await getInterventionLogDb()
  return db[name]

export add_log_goals = (data) ->>
  data = {} <<< data
  if not data.enabled_interventions?
    data.enabled_interventions = await intervention_utils.get_enabled_interventions()
  if not data.enabled_goals?
    data.enabled_goals = await goal_utils.get_enabled_goals()
  await addtolog 'logs/goals', data

export add_log_interventions = (data) ->>
  data = {} <<< data
  if not data.enabled_interventions?
    data.enabled_interventions = await intervention_utils.get_enabled_interventions()
  if not data.enabled_goals?
    data.enabled_goals = await goal_utils.get_enabled_goals()
  await addtolog 'logs/interventions', data

export add_log_enabledisable = (data) ->>
  data = {} <<< data
  if not data.enabled_interventions?
    data.enabled_interventions = await intervention_utils.get_enabled_interventions()
  if not data.enabled_goals?
    data.enabled_goals = await goal_utils.get_enabled_goals()
  await addtolog 'logs/enabledisable', data

export add_log_habitlab_disabled = (data) ->>
  data = {} <<< data
  data.type = 'disabled'
  await add_log_enabledisable(data)

export add_log_habitlab_enabled = (data) ->>
  data = {} <<< data
  data.type = 'enabled'
  await add_log_enabledisable(data)

export add_log_feedback = (data) ->>
  data = {} <<< data
  if not data.enabled_interventions?
    data.enabled_interventions = await intervention_utils.get_enabled_interventions()
  if not data.enabled_goals?
    data.enabled_goals = await goal_utils.get_enabled_goals()
  await addtolog 'logs/feedback', data

export addtolog = (name, data) ->>
  data = {} <<< data
  if not data.type?
    data.type = 'general'
  data.userid = await get_user_id()
  data.install_id = await get_install_id()
  data.day = get_days_since_epoch()
  data.synced = 0
  data.timestamp = Date.now()
  data.localtime = new Date().toString()
  data.itemid = generate_random_id()
  data.log_major_ver = get_db_major_version_interventionlogdb()
  data.log_minor_ver = get_db_minor_version_interventionlogdb()
  data.habitlab_version = habitlab_version
  if developer_mode
    data.developer_mode = true
  if unofficial_version
    data.unofficial_version = chrome.runtime.id
  collection = await getInterventionLogCollection(name)
  result = await collection.add(data)
  return data

export getlog = (name) ->>
  collection = await getInterventionLogCollection(name)
  result = await collection.toArray()
  return result

export clearlog = (name) ->>
  collection = await getInterventionLogCollection(name)
  num_deleted = await collection.delete()
  return

export get_num_impressions = (name) ->>
  collection = await getInterventionLogCollection(name)
  num_impressions = await collection.where('type').equals('impression').count()
  return num_impressions

export get_num_impressions_for_days_before_today = (name, days_before_today) ->>
  collection = await getInterventionLogCollection(name)
  day = get_days_since_epoch() - days_before_today
  num_impressions = await collection.where('[type+day]').equals(['impression', day]).count()
  return num_impressions

export get_num_impressions_today = (name) ->>
  await get_num_impressions_for_days_before_today name, 0

export get_num_actions = (name) ->>
  collection = await getInterventionLogCollection(name)
  num_actions = await collection.where('type').equals('action').count()
  return num_actions

export get_num_actions_for_days_before_today = (name, days_before_today) ->>
  collection = await getInterventionLogCollection(name)
  day = get_days_since_epoch() - days_before_today
  num_actions = await collection.where('[type+day]').equals(['action', day]).count()
  return num_actions

export get_num_actions_today = (name) ->>
  await get_num_actions_for_days_before_today name, 0

export get_num_actions = (name) ->>
  collection = await getInterventionLogCollection(name)
  day = get_days_since_epoch()
  num_actions = await collection.where('[type+day]').equals(['action', day]).count()
  return num_actions

export log_pageview = (data) ->>
  if data?
    data = {} <<< data
  else
    data = {}
  data.type = 'view'
  pagepath = window.location.pathname
  if window.location.search.length > 0
    pagepath += window.location.search
  if window.location.hash.length > 0
    pagepath += window.location.hash
  data.page = pagepath
  await addtolog 'logs/pages', data

export log_pagenav = (data) ->>
  if data?
    data = {} <<< data
  else
    data = {}
  data.type = 'nav'
  pagepath = window.location.pathname
  if window.location.search.length > 0
    pagepath += window.location.search
  if window.location.hash.length > 0
    pagepath += window.location.hash
  data.page = pagepath
  await addtolog 'logs/pages', data

export log_pageclick = (data) ->>
  if data?
    data = {} <<< data
  else
    data = {}
  data.type = 'click'
  pagepath = window.location.pathname
  if window.location.search.length > 0
    pagepath += window.location.search
  if window.location.hash.length > 0
    pagepath += window.location.hash
  data.page = pagepath
  await addtolog 'logs/pages', data

export log_impression_internal = (name, data) ->>
  # name = intervention name
  # ex: facebook/notification_hijacker
  if data?
    data = {} <<< data
  else
    data = {}
  data.type = 'impression'
  data.intervention = name
  await check_if_intervention_has_been_seen_and_record_as_seen_if_not(name)
  intervention_info = await intervention_utils.get_intervention_info(name)
  if intervention_info.generic_intervention?
    name = intervention_info.generic_intervention
  await db_utils.setkey_dict('time_intervention_most_recently_seen', name, Date.now())
  await addtolog name, data

export log_intervention_suggested_internal = (name, data) ->>
  # name = intervention name
  # ex: facebook/notification_hijacker
  if data?
    data = {} <<< data
  else
    data = {}
  data.type = 'suggested'
  data.intervention = name
  await check_if_intervention_has_been_seen_and_record_as_seen_if_not(name)
  cur_epoch = get_days_since_epoch()
  await db_utils.setvar('last_epoch_intervention_suggested', cur_epoch)
  await db_utils.setkey_dict('time_intervention_most_recently_seen', name, Date.now())
  await addtolog name, data

export log_intervention_suggestion_action_internal = (name, data) ->>
  # name = intervention name
  # ex: facebook/notification_hijacker
  # data: a dictionary containing any details necessary
  # ex: {}
  if data?
    data = {} <<< data
  else
    data = {}
  data.type = 'suggestion_action'
  data.intervention = name
  await addtolog name, data

export log_disable_internal = (name, data) ->>
  # name = intervention name
  # ex: facebook/notification_hijacker
  if data?
    data = {} <<< data
  else
    data = {}
  data.type = 'disable'
  data.intervention = name
  await addtolog name, data

export log_action_internal = (name, data) ->>
  # name = intervention name
  # ex: facebook/notification_hijacker
  # data: a dictionary containing any details necessary
  # ex: {}
  if data?
    data = {} <<< data
  else
    data = {}
  data.type = 'action'
  data.intervention = name
  await addtolog name, data

export log_upvote_internal = (name, data) ->>
  if data?
    data = {} <<< data
  else
    data = {}
  data.type = 'upvote'
  data.intervention = name
  await addtolog name, data

export log_downvote_internal = (name, data) ->>
  if data?
    data = {} <<< data
  else
    data = {}
  data.type = 'downvote'
  data.intervention = name
  await addtolog name, data

export log_feedback_internal = (name, data) ->>
  if data?
    data = {} <<< data
  else
    data = {}
  data.type = 'feedback'
  data.intervention = name
  await addtolog name, data

intervention_utils = require 'libs_backend/intervention_utils'
goal_utils = require 'libs_backend/goal_utils'
db_utils = require 'libs_backend/db_utils'

gexport_module 'log_utils_backend', -> eval(it)
