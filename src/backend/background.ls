{
  getvar
  getfield
  getfields
  getfield_uncached
  getfields_uncached
  get_field_info
} = require 'fields/get_field'

{
  addtolist
  getlist
  getvar
  setvar
  addtovar
  getkey_dictdict
  addtokey_dictdict
} = require 'libs_backend/dexie_utils'

{
  get_interventions
  list_enabled_interventions_for_location
  list_available_interventions_for_location
  send_message_to_active_tab
  send_message_to_tabid
  get_active_tab_info
} = require 'libs_backend/background_common'

{
  make_wait_token
  wait_for_token
  finished_waiting
} = require 'libs_common/wait_utils'

{
  get_days_since_epoch
} = require 'libs_common/time_utils'

{
  url_to_domain
} = require 'libs_common/domain_utils'

require! {
  async
  moment
}

$ = require 'jquery'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

# console.log 'weblab running in background'

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

insert_css = (css_path, callback) ->
  # todo does not do anything currently
  if callback?
    callback()

running_background_scripts = {}

load_background_script = (options, intervention_info, callback) ->
  if running_background_scripts[options.path]?
    # already running
    return callback?!
  background_script_text <- $.get options.path
  background_script_function = new Function('env', background_script_text)
  env = {
    intervention_info: intervention_info
  }
  background_script_function(env)
  running_background_scripts[options.path] = env
  callback?!

execute_content_scripts_for_intervention = (intervention_info, callback) ->
  {content_script_options, name} = intervention_info
  console.log 'calling execute_content_scripts'
  tabs <- chrome.tabs.query {active: true, lastFocusedWindow: true}
  tabid = tabs[0].id
  # <- async.eachSeries intervention_info.content_script_options, (options, ncallback) ->
  #  execute_content_script tabid, options, ncallback

  wait_token = make_wait_token()

  wait_for_token wait_token, ->
    console.log 'wait token released'
    callback?!

  # based on the following
  # http://stackoverflow.com/questions/8859622/chrome-extension-how-to-detect-that-content-script-is-already-loaded-into-a-tab
  content_script_code = """
  (function(){

    console.log('execute_content_scripts_for_intervention called for intervention #{name}')

    if (!window.loaded_interventions) {
      window.loaded_interventions = []
    }
    if (window.loaded_interventions.includes('#{name}')) {
      return
    }
    window.loaded_interventions.push('#{name}')

    chrome.runtime.sendMessage({
      type: 'load_content_scripts',
      data: {
        content_script_options: #{JSON.stringify(content_script_options)},
        tabid: #{tabid},
        wait_token: #{wait_token},
        loaded_scripts: window.loaded_scripts || {},
      },
    });

  })();
  """
  console.log content_script_code
  chrome.tabs.executeScript tabid, {code: content_script_code}
  #callback?! # technically incorrect, may be calling too early. TODO might break with multiple interventions
  /*
  'load_content_script': (data, callback) ->
    {options, tabid, loaded_scripts} = data
    if loaded_scripts[options.path]?
      return
    chrome.tabs.executeScript tabid, {file: options.path, allFrames: options.all_frames, runAt: options.run_at}, ->
      callback?!
  */
  #chrome.tabs.executeScript(tabid, {code: 'chrome.extension.sendRequest({type: "load_content_script", data: })'})
  #callback?!

load_intervention = (intervention_name, callback) ->
  console.log 'start load_intervention ' + intervention_name
  all_interventions <- get_interventions()
  intervention_info = all_interventions[intervention_name]

  console.log intervention_info
  console.log 'start load background scripts ' + intervention_name

  # load background scripts
  <- async.eachSeries intervention_info.background_script_options, (options, ncallback) ->
    load_background_script options, intervention_info, ncallback

  console.log 'start load content scripts ' + intervention_name

  # load content scripts
  <- execute_content_scripts_for_intervention intervention_info

  console.log 'done load_intervention ' + intervention_name
  callback?!

list_loaded_interventions = (callback) ->
  send_message_to_active_tab 'list_loaded_interventions', {}, callback

load_intervention_for_location = (location, callback) ->
  possible_interventions <- list_enabled_interventions_for_location(location)
  errors, results <- async.eachSeries possible_interventions, (intervention, ncallback) ->
    load_intervention intervention, ncallback
  callback?!

getLocation = (callback) ->
  #send_message_to_active_tab 'getLocation', {}, callback
  console.log 'calling getTabInfo'
  get_active_tab_info (tabinfo) ->
    console.log 'getTabInfo results'
    console.log tabinfo
    console.log tabinfo.url
    callback tabinfo.url

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

message_handlers = {
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
  'getvar': (key, callback) ->
    getvar key, callback
  'setvar': (data, callback) ->
    {key, val} = data
    setvar key, val, callback
  'addtovar': (data, callback) ->
    {key, val} = data
    addtovar key, val, callback
  'getkey_dictdict': (data, callback) ->
    {name, key, key2} = data
    getkey_dictdict name, key, key2, callback
  'getdict_for_key_dictdict': (data, callback) ->
    {name, key} = data
    getdict_for_key_dictdict name, key, callback
  'getdict_for_key2_dictdict': (data, callback) ->
    {name, key2} = data
    getdict_for_key2_dictdict name, key2, callback
  /*
  'setvars': (data, callback) ->
  <- async.forEachOfSeries data, (v, k, ncallback) ->
    <- setvar k, v
    ncallback()
  callback()
  'getvars': (namelist, callback) ->
    output = {}
    <- async.eachSeries namelist, (name, ncallback) ->
      val <- getvar name
      output[name] = val
      ncallback()
    callback output
  */
  'addtolist': (data, callback) ->
    {list, item} = data
    addtolist list, item, callback
  'getlist': (name, callback) ->
    getlist name, callback
  'getLocation': (data, callback) ->
    getLocation (location) ->
      console.log 'getLocation background page:'
      console.log location
      callback location
  'load_intervention': (data, callback) ->
    {intervention_name} = data
    load_intervention intervention_name, ->
      callback()
  'load_intervention_for_location': (data, callback) ->
    {location} = data
    load_intervention_for_location location, ->
      callback()
  'load_content_scripts': (data, callback) ->
    {content_script_options, tabid, wait_token, loaded_scripts} = data
    <- async.eachSeries content_script_options, (options, ncallback) ->
      if loaded_scripts[options.path]?
        return ncallback()
      chrome.tabs.executeScript tabid, {file: options.path, allFrames: options.all_frames, runAt: options.run_at}, ->
        return ncallback()
    new_loaded_scripts = {[k,v] for k,v of loaded_scripts}
    for options in content_script_options
      new_loaded_scripts[options.path] = true
    content_script_code = """
    (function() {
      window.loaded_scripts = #{JSON.stringify(new_loaded_scripts)}
    })();
    """
    <- chrome.tabs.executeScript tabid, {code: content_script_code}
    finished_waiting(wait_token)
  'load_css_file': (data, callback) ->
    {css_file, tab} = data
    tabid = tab.id
    console.log 'load_css called'
    console.log css_file
    console.log tabid
    chrome.tabs.insertCSS tabid, {file: css_file}, ->
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

navigation_occurred = (url, tabId) ->
  #if tabid_to_current_location[tabId] == url
  #  return
  #tabid_to_current_location[tabId] = url
  send_message_to_tabid tabId, 'navigation_occurred', {
    url: url
    tabId: tabId
  }
  possible_interventions <- list_available_interventions_for_location(url)
  if possible_interventions.length > 0
    chrome.pageAction.show(tabId)
  else
    chrome.pageAction.hide(tabId)
  #send_pageupdate_to_tab(tabId)
  console.log "navigation_occurred to #{url}"
  load_intervention_for_location url

chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->
  if tab.url
    #console.log 'tabs updated!'
    #console.log tab.url
    if changeInfo.status != 'complete'
      return
    navigation_occurred tab.url, tabId

chrome.webNavigation.onHistoryStateUpdated.addListener (info) ->
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
}

chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  {type, data} = request
  console.log 'onmessage'
  console.log type
  console.log data
  console.log sender
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

# open the options page on first run
#chrome.tabs.create {url: 'options.html'}

browser_focus_changed = (new_focused) ->
  console.log "browser focus changed: #{new_focused}"

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
      browser_focus_changed(focused)
, 500

setInterval ->
  if !prev_browser_focused
    return
  if current_idlestate != 'active'
    return
  active_tab <- get_active_tab_info()
  current_domain = url_to_domain(active_tab.url)
  current_day = get_days_since_epoch()
  # console.log "currently browsing #{url_to_domain(active_tab.url)} on day #{get_days_since_epoch()}"
  addtokey_dictdict 'seconds_on_domain_per_day', current_domain, current_day, 1, (total_seconds) ->
    console.log "total seconds spent on #{current_domain} today is #{total_seconds}"
, 1000

gexport_module 'background', -> eval(it)
