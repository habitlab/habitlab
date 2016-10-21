window.addEventListener "unhandledrejection", (evt) ->
  throw new Error(evt.reason)

localStorage.removeItem 'cached_list_all_goals'
localStorage.removeItem 'cached_list_all_interventions'
localStorage.removeItem 'cached_get_goals'
localStorage.removeItem 'cached_get_interventions'

window.global_exports = {}

{
  get_all_message_handlers
} = require 'libs_backend/expose_lib'

require 'libs_backend/expose_backend_libs'

{
  addtokey_dictdict
  start_syncing_all_db_collections
  getkey_dictdict
} = require 'libs_backend/db_utils'

{
  getfield
  getfields
  getfield_uncached
  getfields_uncached
  get_field_info
} = require 'fields/get_field'

{
  send_message_to_active_tab
  send_message_to_tabid
  get_active_tab_info
} = require 'libs_backend/background_common'

{
  get_interventions
  list_enabled_nonconflicting_interventions_for_location
  list_all_enabled_interventions_for_location
  list_available_interventions_for_location
  get_intervention_parameters
  is_it_outside_work_hours
} = require 'libs_backend/intervention_utils'

{
  get_goals
  get_enabled_goals
  get_goal_target
} = require 'libs_backend/goal_utils'

{
  make_wait_token
  wait_for_token
  finished_waiting
} = require 'libs_common/wait_utils'

{
  get_days_since_epoch
} = require 'libs_common/time_utils'

{
  get_new_session_id_for_domain
} = require 'libs_common/time_spent_utils'

{
  url_to_domain
} = require 'libs_common/domain_utils'

{
  as_array
  as_dictset
} = require 'libs_common/collection_utils'

require! {
  async
  moment
  'promise-debounce'
}

$ = require 'jquery'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  set_active_interventions_for_domain_and_session
} = require 'libs_backend/intervention_manager'

{
  get_progress_on_enabled_goals_today
  get_progress_on_goal_this_week
} = require 'libs_backend/goal_progress'

{
  start_syncing_all_logs
} = require 'libs_backend/log_utils'

{
  ensure_history_utils_data_cached
} = require 'libs_common/history_utils'

{cfy, yfy} = require 'cfy'

require 'libs_common/measurement_utils'

require 'libs_common/systemjs'

# console.log 'weblab running in background'
# alert('hello');

/*
execute_content_script = (tabid, options, callback) ->
  #chrome.tabs.query {active: true, lastFocusedWindow: true}, (tabs) ->
  if not tabid?
    if callback?
      callback()
    return
  chrome.tabs.executeScript tabid, {file: options.path, allFrames: options.all_frames, runAt: options.run_at}, ->
    if callback?
      callback()
*/

insert_css = cfy (css_path) ->*
  # todo does not do anything currently
  return

running_background_scripts = {}

load_background_script = cfy (options, intervention_info) ->*
  if running_background_scripts[options.path]?
    # already running
    return
  background_script_text = yield $.get options.path
  background_script_function = new Function('env', background_script_text)
  env = {
    intervention_info: intervention_info
  }
  background_script_function(env)
  running_background_scripts[options.path] = env
  return

cached_systemjs_code = null

execute_content_scripts_for_intervention = cfy (intervention_info, tabId, intervention_list) ->*
  {content_script_options, name} = intervention_info

  intervention_info_copy = JSON.parse JSON.stringify intervention_info
  parameter_values = yield get_intervention_parameters(intervention_info.name)
  for i in [0 til intervention_info_copy.parameters.length]
    parameter = intervention_info_copy.parameters[i]
    parameter.value = parameter_values[parameter.name]
    intervention_info_copy.params[parameter.name].value = parameter_values[parameter.name]

  if cached_systemjs_code != null
    systemjs_content_script_code = cached_systemjs_code
  else
    systemjs_content_script_code = yield $.get '/intervention_utils/systemjs.js'
    cached_systemjs_code := systemjs_content_script_code

  debug_content_script_code = """
    System.import('libs_frontend/content_script_debug').then(function(content_script_debug) {
      content_script_debug.listen_for_eval(function(x) { return eval(x); });
    });
  """
  if intervention_info_copy.params.debug? and intervention_info_copy.params.debug.value
    debug_content_script_code = """
    System.import('libs_frontend/content_script_debug').then(function(content_script_debug) {
      content_script_debug.listen_for_eval(function(x) { return eval(x); });
      content_script_debug.insert_console(function(x) { return eval(x); }, {lang: 'livescript'});
    });
    """
  for options in content_script_options
    content_script_code = yield $.get options.path
    content_script_code = """
if (!window.allowed_interventions) {
  window.allowed_interventions = #{JSON.stringify(as_dictset(intervention_list))};

  window.onunhandledrejection = function(evt) {
    throw evt.reason;
  };

  window.loaded_interventions = {};
  window.loaded_content_scripts = {};
}

if (window.allowed_interventions['#{intervention_info_copy.name}'] && !window.loaded_interventions['#{intervention_info_copy.name}']) {
  window.loaded_interventions['#{intervention_info_copy.name}'] = true;

  if (!window.loaded_content_scripts['#{options.path}']) {
    window.loaded_content_scripts['#{options.path}'] = true;
    const intervention = #{JSON.stringify(intervention_info_copy)};

    #{content_script_code}
    #{systemjs_content_script_code}
    #{debug_content_script_code}
  }
}
    """
    yield yfy(chrome.tabs.executeScript) tabId, {code: content_script_code, allFrames: options.all_frames, runAt: options.run_at}
  return

load_intervention_list = cfy (intervention_list, tabId) ->*
  all_interventions = yield get_interventions()
  intervention_info_list = [all_interventions[intervention_name] for intervention_name in intervention_list]

  # load background scripts
  for intervention_info in intervention_info_list
    for options in intervention_info.background_script_options
      yield load_background_script options, intervention_info

  # load content scripts
  for intervention_info in intervention_info_list
    yield execute_content_scripts_for_intervention intervention_info, tabId, intervention_list
  return

load_intervention = cfy (intervention_name, tabId) ->*
  all_interventions = yield get_interventions()
  intervention_info = all_interventions[intervention_name]

  # load background scripts
  for options in intervention_info.background_script_options
    yield load_background_script options, intervention_info

  # load content scripts
  yield execute_content_scripts_for_intervention intervention_info, tabId, [intervention_name]
  return

list_loaded_interventions = cfy ->*
  yield send_message_to_active_tab 'list_loaded_interventions', {}

get_session_id_for_tab_id_and_domain = cfy (tabId, domain) ->*
  if not tab_id_to_domain_to_session_id[tabId]?
    tab_id_to_domain_to_session_id[tabId] = {}
  session_id = tab_id_to_domain_to_session_id[tabId][domain]
  if session_id?
    return session_id
  session_id = yield get_new_session_id_for_domain(domain)
  tab_id_to_domain_to_session_id[tabId][domain] = session_id
  return session_id

load_intervention_for_location = promise-debounce cfy (location, tabId) ->*
  if is_it_outside_work_hours()
    return

  domain = url_to_domain(location)
  session_id = yield get_session_id_for_tab_id_and_domain(tabId, domain)
  active_interventions = yield getkey_dictdict 'interventions_active_for_domain_and_session', domain, session_id
  console.log 'active_interventions is'
  console.log active_interventions
  override_enabled_interventions = localStorage.getItem('override_enabled_interventions_once')
  console.log 'override_enabled_interventions is'
  console.log override_enabled_interventions
  if not active_interventions?
    if override_enabled_interventions?
      possible_interventions = as_array(JSON.parse(override_enabled_interventions))
    else
      possible_interventions = yield list_enabled_nonconflicting_interventions_for_location(location)
    intervention = possible_interventions[0]
    if intervention?
      yield set_active_interventions_for_domain_and_session domain, session_id, [intervention]
    else
      yield set_active_interventions_for_domain_and_session domain, session_id, []
    localStorage.removeItem('override_enabled_interventions_once')
  else
    active_interventions = JSON.parse active_interventions
    intervention = active_interventions[0]
    if intervention?
      all_enabled_interventions = yield list_all_enabled_interventions_for_location(location)
      if all_enabled_interventions.length > 0 and all_enabled_interventions.indexOf(intervention) == -1
        # the intervention is no longer enabled. need to choose a new session id
        console.log 'intervention is no longer enabled. choosing new session id'
        console.log 'tabid is ' + tabId
        console.log 'domain is ' + domain
        console.log 'old session_id is ' + session_id
        console.log 'active_interventions'
        console.log active_interventions
        console.log 'all_enabled_interventions'
        console.log all_enabled_interventions
        session_id = yield get_new_session_id_for_domain(domain)
        tab_id_to_domain_to_session_id[tabId][domain] = session_id
        if override_enabled_interventions?
          possible_interventions = as_array(JSON.parse(override_enabled_interventions))
        else
          possible_interventions = yield list_enabled_nonconflicting_interventions_for_location(location)
        intervention = possible_interventions[0]
        #domain_to_session_id_to_intervention[domain][session_id] = intervention
        if intervention?
          yield set_active_interventions_for_domain_and_session domain, session_id, [intervention]
        else
          yield set_active_interventions_for_domain_and_session domain, session_id, []
        localStorage.removeItem('override_enabled_interventions_once')
  interventions_to_load = []
  if intervention?
    interventions_to_load.push intervention
  #if not intervention?
  #  return
  #yield load_intervention intervention, tabId
  if not override_enabled_interventions?
     permanently_enabled_interventions = localStorage.getItem('permanently_enabled_interventions')
     if permanently_enabled_interventions?
       permanently_enabled_interventions = as_array(JSON.parse(permanently_enabled_interventions))
       all_available_interventions = yield list_available_interventions_for_location(location)
       all_available_interventions = as_dictset(all_available_interventions)
       permanently_enabled_interventions = permanently_enabled_interventions.filter (x) -> all_available_interventions[x]
       for permanently_enabled_intervention in permanently_enabled_interventions
         if permanently_enabled_intervention != intervention
           interventions_to_load.push permanently_enabled_intervention
           #yield load_intervention permanently_enabled_intervention, tabId
  yield load_intervention_list interventions_to_load, tabId
  return

/*
load_intervention_for_location = cfy (location, tabId) ->*
  {work_hours_only ? 'false', start_mins_since_midnight ? '0', end_mins_since_midnight ? '1440'} = localStorage
  work_hours_only = work_hours_only == 'true'
  start_mins_since_midnight = parseInt start_mins_since_midnight
  end_mins_since_midnight = parseInt end_mins_since_midnight
  mins_since_midnight = moment().hours()*60 + moment().minutes()
  if work_hours_only and not (start_mins_since_midnight <= mins_since_midnight <= end_mins_since_midnight)
    return
  possible_interventions = yield list_enabled_nonconflicting_interventions_for_location(location)
  for intervention in possible_interventions
    yield load_intervention intervention, tabId
  localStorage.removeItem('override_enabled_interventions_once')
  return
*/

getLocation = cfy ->*
  #send_message_to_active_tab 'getLocation', {}, callback
  tabinfo = yield get_active_tab_info()
  return tabinfo.url

split_list_by_length = (list, len) ->
  output = []
  curlist = []
  for x in list
    curlist.push x
    if curlist.length == len
      output.push curlist
      curlist = []
  if curlist.length > 0
    output.push curlist
  return output

message_handlers = get_all_message_handlers()

message_handlers <<< {
  'getfield': (name, callback) ->
    getfield name, callback
  'getfields': (namelist, callback) ->
    getfields namelist, callback
  'getfields_uncached': (namelist, callback) ->
    getfields_uncached namelist, callback
  'requestfields': (info, callback) ->
    {fieldnames} = info
    getfields fieldnames, callback
  'requestfields_uncached': (info, callback) ->
    {fieldnames} = info
    getfields_uncached fieldnames, callback
  'getLocation': (data, callback) ->
    getLocation (location) ->
      console.log 'getLocation background page:'
      console.log location
      callback location
  'load_intervention': (data, callback) ->
    {intervention_name, tabId} = data
    load_intervention intervention_name, tabId, ->
      callback()
  'load_intervention_for_location': cfy (data) ->*
    {location, tabId} = data
    yield load_intervention_for_location location, tabId
    return
  'load_css_file': (data, callback) ->
    {css_file, tab} = data
    tabid = tab.id
    chrome.tabs.insertCSS tabid, {file: css_file}, ->
      callback()
  'load_css_code': (data, callback) ->
    {css_code, tab} = data
    tabid = tab.id
    chrome.tabs.insertCSS tabid, {code: css_code}, ->
      callback()
}

ext_message_handlers = {
  'is_extension_installed': (info, callback) ->
    callback true
  # 'getfields': message_handers.getfields
  'requestfields': (info, callback) ->
    confirm_permissions info, (accepted) ->
      if not accepted
        return
      getfields info.fieldnames, (results) ->
        console.log 'getfields result:'
        console.log results
        callback results
  'requestfields_uncached': (info, callback) ->
    confirm_permissions info, (accepted) ->
      if not accepted
        return
      getfields_uncached info.fieldnames, (results) ->
        console.log 'getfields result:'
        console.log results
        callback results
  'get_field_descriptions': (namelist, callback) ->
    field_info <- get_field_info()
    output = {}
    for x in namelist
      if field_info[x]? and field_info[x].description?
        output[x] = field_info[x].description
    callback output
}

confirm_permissions = (info, callback) ->
  {pagename, fieldnames} = info
  field_info <- get_field_info()
  field_info_list = []
  for x in fieldnames
    output = {name: x}
    if field_info[x]? and field_info[x].description?
      output.description = field_info[x].description
    field_info_list.push output
  send_message_to_active_tab 'confirm_permissions', {pagename, fields: field_info_list}, callback

#tabid_to_current_location = {}

#which_interventions_are_loaded = (tabId, callback) ->

prev_domain = ''

domain_changed = (new_domain) ->
  prev_domain := new_domain
  current_day = get_days_since_epoch()
  addtokey_dictdict 'visits_to_domain_per_day', new_domain, current_day, 1, (total_visits) ->
    console.log "total visits to #{new_domain} today is #{total_visits}"

# our definition of a session:
# how long a tab was open and on Facebook (or other site of interest) until it was closed
# some pitfalls. if user navigates to FB, then goes to say buzzfeed, then goes back (on that same tab) the sessions are merged
tab_id_to_domain_to_session_id = {}
# domain_to_session_id_to_intervention = {}

export list_domain_to_session_ids = ->
  for tab_id,domain_to_session_id of tab_id_to_domain_to_session_id
    console.log domain_to_session_id

navigation_occurred = (url, tabId) ->
  new_domain = url_to_domain(url)
  if new_domain != prev_domain
    domain_changed(new_domain)
  #if tabid_to_current_location[tabId] == url
  #  return
  #tabid_to_current_location[tabId] = url
  #possible_interventions <- list_available_interventions_for_location(url)
  #if possible_interventions.length > 0
  #  chrome.pageAction.show(tabId)
  #else
  #  chrome.pageAction.hide(tabId)
  #send_pageupdate_to_tab(tabId)
  console.log "navigation_occurred to #{url}"
  load_intervention_for_location url, tabId

chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->
  if tab.url
    #console.log 'tabs updated!'
    #console.log tab.url
    #if changeInfo.status != 'complete'
    #  return
    #if changeInfo.status == 'complete'
    #  send_message_to_tabid tabId, 'navigation_occurred', {
    #    url: tab.url
    #    tabId: tabId
    #  }
    send_message_to_tabid tabId, 'navigation_occurred', {
      url: tab.url
      tabId: tabId
    }
    navigation_occurred tab.url, tabId

chrome.webNavigation.onHistoryStateUpdated.addListener (info) ->
  send_message_to_tabid info.tabId, 'navigation_occurred', {
    url: info.url
    tabId: info.tabId
  }
  navigation_occurred info.url, info.tabId

chrome.runtime.onMessageExternal.addListener (request, sender, sendResponse) ->
  {type, data} = request
  message_handler = ext_message_handlers[type]
  if type == 'requestfields' or type == 'requestfields_uncached'
    # do not prompt for permissions for these urls
    whitelist = [
      'http://localhost:8080/previewdata.html'
      'http://tmi.netlify.com/previewdata.html'
      'https://tmi.netlify.com/previewdata.html'
      'https://tmi.stanford.edu/previewdata.html'
      'https://tmisurvey.herokuapp.com/'
      'http://localhost:8080/'
      'https://localhost:8081/'
      'https://tmi.stanford.edu/'
      'http://localhost:3000/'
      'http://browsingsurvey.herokuapp.com/'
      'https://browsingsurvey.herokuapp.com/'
      'http://browsingsurvey2.herokuapp.com/'
      'https://browsingsurvey2.herokuapp.com/'
      'http://browsingsurvey3.herokuapp.com/'
      'https://browsingsurvey3.herokuapp.com/'
      'http://browsingsurvey4.herokuapp.com/'
      'https://browsingsurvey4.herokuapp.com/'
      'http://browsingsurvey5.herokuapp.com/'
      'https://browsingsurvey5.herokuapp.com/'
      'http://browsingsurvey6.herokuapp.com/'
      'https://browsingsurvey6.herokuapp.com/'
      'http://browsingsurvey7.herokuapp.com/'
      'https://browsingsurvey7.herokuapp.com/'
      'http://browsingsurvey8.herokuapp.com/'
      'https://browsingsurvey8.herokuapp.com/'
      'http://browsingsurvey9.herokuapp.com/'
      'https://browsingsurvey9.herokuapp.com/'
      'http://browsingsurvey10.herokuapp.com/'
      'https://browsingsurvey10.herokuapp.com/'
      'http://browsingsurvey11.herokuapp.com/'
      'https://browsingsurvey11.herokuapp.com/'
      'http://browsingsurvey12.herokuapp.com/'
      'https://browsingsurvey12.herokuapp.com/'
      'http://browsingsurvey13.herokuapp.com/'
      'https://browsingsurvey13.herokuapp.com/'
    ]
    for whitelisted_url in whitelist
      if sender.url.indexOf(whitelisted_url) == 0
        message_handler = message_handlers[type]
        break
  if not message_handler?
    return
  #tabId = sender.tab.id
  message_handler data, (response) ~>
    #console.log 'response is:'
    #console.log response
    #response_string = JSON.stringify(response)
    #console.log 'length of response_string: ' + response_string.length
    #console.log 'turned into response_string:'
    #console.log response_string
    if sendResponse?
      sendResponse response
  return true # async response

message_handlers_requiring_tab = {
  'load_css_file': true
  'load_css_code': true
}

chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  {type, data} = request
  #console.log 'onmessage'
  #console.log type
  #console.log data
  #console.log sender
  message_handler = message_handlers[type]
  if not message_handler?
    return
  # tabId = sender.tab.id
  if message_handlers_requiring_tab[type]
    if typeof(data) == 'object' and data != null and sender.tab? and not data.tab?
      data = {} <<< data
      data.tab = sender.tab
  message_handler data, (response) ->
    #console.log 'message handler response:'
    #console.log response
    #response_data = {response}
    #console.log response_data
    # chrome bug - doesn't seem to actually send the response back....
    #sendResponse response_data
    if sendResponse?
      sendResponse response
    # {requestId} = request
    # if requestId? # response requested
    #  chrome.tabs.sendMessage tabId, {event: 'backgroundresponse', requestId, response}
  if sendResponse?
    return true
  else
    return false

#browser_focus_changed = (new_focused) ->
#  console.log "browser focus changed: #{new_focused}"

current_idlestate = 'active'

chrome.idle.onStateChanged.addListener (idlestate) ->
  current_idlestate := idlestate
  console.log "idle state changed: #{idlestate}"

prev_browser_focused = false
setInterval ->
  chrome.windows.getCurrent (browser) ->
    focused = browser.focused
    if focused != prev_browser_focused
      prev_browser_focused := focused
      #browser_focus_changed(focused)
, 500

/*
export list_current_tab_ids = ->
  chrome.tabs.query {}, (tabs) ->
    output = {}
    for tab in tabs
      output[tab.url] = tab.id
    console.log output
*/

setInterval (cfy ->*
  if !prev_browser_focused
    return
  if current_idlestate != 'active'
    return
  active_tab = yield get_active_tab_info()
  if not active_tab?
    return
  if active_tab.url.startsWith('chrome://') or active_tab.url.startsWith('chrome-extension://') # ignore time spent on extension pages
    return
  current_domain = url_to_domain(active_tab.url)
  current_day = get_days_since_epoch()
  # console.log "currently browsing #{url_to_domain(active_tab.url)} on day #{get_days_since_epoch()}"
  session_id = yield get_session_id_for_tab_id_and_domain(active_tab.id, current_domain)
  #console.log "session id #{session_id} current_domain #{current_domain} tab_id #{active_tab.id}"
  yield addtokey_dictdict 'seconds_on_domain_per_session', current_domain, session_id, 1
  yield addtokey_dictdict 'seconds_on_domain_per_day', current_domain, current_day, 1
  #addtokey_dictdict 'seconds_on_domain_per_day', current_domain, current_day, 1, (total_seconds) ->
  #  console.log "total seconds spent on #{current_domain} today is #{total_seconds}"
), 1000

do ->
  # open the options page on first run
  if not localStorage.getItem('notfirstrun')
    localStorage.setItem('notfirstrun', true)
    chrome.tabs.create {url: 'options.html#introduction'}

localStorage.tabsOpened = 0
chrome.tabs.onCreated.addListener (x) ->
  localStorage.tabsOpened = Number(localStorage.tabsOpened) + 1
  console.log localStorage.tabsOpened

/*
setInterval (cfy ->*
  if !prev_browser_focused
    return
  if current_idlestate != 'active'
    return
  active_tab = yield get_active_tab_info()
  if not active_tab?
    return
  if active_tab.url.startsWith('chrome://') or active_tab.url.startsWith('chrome-extension://') # ignore time spent on extension pages
    return
  current_domain = url_to_domain(active_tab.url)
  console.log "current domain is #{current_domain}"
  console.log "current tab id is #{active_tab.id}"
  session_id = yield get_session_id_for_tab_id_and_domain(active_tab.id, current_domain)
  console.log "session_id: #{session_id}"
  seconds_spent = yield get_seconds_spent_on_domain_in_session(current_domain, session_id)
  console.log "seconds spent: #{seconds_spent}"
), 1000
*/

start_syncing_all_logs()
start_syncing_all_db_collections()

gexport_module 'background', -> eval(it)

systemjs_require <- System.import('libs_common/systemjs_require').then()
drequire <- systemjs_require.make_require_frontend().then()
window.drequire = drequire

ensure_history_utils_data_cached()

require 'libs_common/global_exports_post'
require('libs_backend/notification_timer') #lewin notification_timer code
