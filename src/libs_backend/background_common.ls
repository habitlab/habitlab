{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  as_array
} = require 'libs_common/collection_utils'

{generate_random_id} = require 'libs_common/generate_random_id'

{cfy, yfy, add_noerr} = require 'cfy'

chrome_tabs_sendmessage = yfy (tab_id, data, options, callback) ->
  if not callback? and typeof(options) == 'function'
    callback = options
    options = {}
  chrome.tabs.sendMessage tab_id, data, options, (result) ->
    callback(result)
    return true

if chrome?tabs?query?
  chrome_tabs_query = yfy(chrome.tabs.query)

chrome_storage_sync = chrome.storage?sync ? chrome.storage?local

cached_user_id = null

export get_user_id = cfy ->*
  user_id = yield get_user_id_real()
  if user_id.length == 24
    return user_id
  else
    cached_user_id := null
    localStorage.removeItem('userid')
    yield add_noerr -> chrome_storage_sync.remove 'userid', it
    return yield get_user_id_real()

get_user_id_real = cfy ->*
  if cached_user_id?
    return cached_user_id
  userid = localStorage.getItem('userid')
  if userid?
    cached_user_id := userid
    return userid
  items = yield add_noerr -> chrome_storage_sync.get 'userid', it
  userid = items.userid
  if userid?
    cached_user_id := userid
    localStorage.setItem('userid', userid)
    return userid
  userid = generate_random_id()
  cached_user_id := userid
  localStorage.setItem('userid', userid)
  yield -> chrome_storage_sync.set {userid}, it
  return userid

export send_message_to_active_tab = cfy (type, data) ->*
  tabs = yield chrome_tabs_query {active: true, lastFocusedWindow: true}
  if tabs.length == 0
    return
  yield chrome_tabs_sendmessage tabs[0].id, {type, data}

send_message_to_all_active_tabs = cfy (type, data) ->*
  tabs = yield chrome_tabs_query {active: true}
  if tabs.length == 0
    return
  outputs = []
  for tab in tabs
    result = yield chrome_tabs_sendmessage tab.id, {type, data}
    outputs.push(result)
  return outputs

export eval_content_script = cfy (script) ->*
  results = yield send_message_to_all_active_tabs 'eval_content_script', script
  for result in results
    console.log result
  return result

export eval_content_script_for_active_tab = cfy (script) ->*
  yield send_message_to_active_tab 'eval_content_script', script

export eval_content_script_debug_for_active_tab = cfy (script) ->*
  yield send_message_to_active_tab 'eval_content_script_debug', script

export eval_content_script_debug_for_tabid = cfy (tabid, script) ->*
  yield chrome_tabs_sendmessage tabid, {type: 'eval_content_script_debug', data: script}

export eval_content_script_for_tabid = cfy (tabid, script) ->*
  yield chrome_tabs_sendmessage tabid, {type: 'eval_content_script', data: script}

export list_currently_loaded_interventions = cfy ->*
  tab = yield get_active_tab_info()
  loaded_interventions = yield eval_content_script_for_tabid tab.id, 'window.loaded_interventions'
  return as_array(loaded_interventions)

export is_tab_still_open = cfy (tab_id) ->*
  tabs = yield chrome_tabs_query {}
  for tab in tabs
    if tab.id == tab_id
      return true
  return false

export open_debug_page_for_tab_id = cfy (tab_id) ->*
  debug_page_url = chrome.runtime.getURL('index.html?tag=terminal-view&autoload=true&ispopup=true&tabid=' + tab_id)
  popup_windows = yield add_noerr -> chrome.windows.getAll {windowTypes: ['popup']}, it
  for popup_window in popup_windows
    window_info = yield add_noerr -> chrome.windows.get popup_window.id, {populate: true}, it
    for tab in window_info.tabs
      if tab.url == debug_page_url
        yield add_noerr -> chrome.tabs.update tab.id, {active: true}, it
        return yield add_noerr -> chrome.windows.update popup_window.id, {focused: true}, it
  yield add_noerr -> chrome.windows.create {url: debug_page_url, type: 'popup', width: 566, height: 422}, it

export send_message_to_tabid = cfy (tabid, type, data) ->*
  return chrome_tabs_sendmessage tabid, {type, data}

export disable_interventions_for_tabid = cfy (tabid) ->*
  yield eval_content_script_for_tabid tabid, """
  document.body.dispatchEvent(new CustomEvent('disable_intervention'))
  """

export disable_interventions_in_active_tab = cfy ->*
  tab = yield get_active_tab_info()
  yield disable_interventions_for_tabid tab.id

export disable_interventions_in_all_tabs = cfy ->*
  tabs = yield chrome_tabs_query {}
  yield [disable_interventions_for_tabid(tab.id) for tab in tabs]
  return

export get_active_tab_info = cfy ->*
  tabs = yield chrome_tabs_query {active: true, lastFocusedWindow: true}
  if tabs.length == 0
    return
  return tabs[0]

export get_active_tab_url = cfy ->*
  active_tab_info = yield get_active_tab_info()
  return active_tab_info.url

export get_active_tab_id = cfy ->*
  active_tab_info = yield get_active_tab_info()
  return active_tab_info.id

remote_file_exists = cfy (remote_file_path) ->*
  try
    request = yield fetch(remote_file_path)
    contents = yield request.text()
    return true
  catch
    return false

extension_url_exists = cfy (extension_file_path) ->*
  yield remote_file_exists(chrome.extension.getURL(extension_file_path))

fetch_remote_json_cache = {}

fetch_remote_json = cfy (path) ->*
  if fetch_remote_json_cache[path]?
    return fetch_remote_json_cache[path]
  request = yield fetch(path)
  tree_text = yield request.text()
  tree_contents = JSON.parse(tree_text)
  fetch_remote_json_cache[path] = tree_contents
  return tree_contents

list_files_in_path_for_github_repo = cfy (path) ->*
  path_parts = [x for x in path.split('/') when x? and x.length > 0]
  current_path = 'https://api.github.com/repos/habitlab/habitlab/git/trees/master'
  for path_part in path_parts
    tree_contents = yield fetch_remote_json(current_path)
    matching_parts = [x for x in tree_contents.tree when x.path == path_part]
    if matching_parts.length == 0
      return []
    current_path = matching_parts[0].url
  tree_contents = yield fetch_remote_json(current_path)
  return [x.path for x in tree_contents.tree]

list_files_in_libs_common = cfy ->*
  yield list_files_in_path_for_github_repo 'src/libs_common'

list_files_in_libs_backend = cfy ->*
  yield list_files_in_path_for_github_repo 'src/libs_backend'

list_files_in_libs_frontend = cfy ->*
  yield list_files_in_path_for_github_repo 'src/libs_frontend'

list_jspm_packages = ->
  libraries = SystemJS.getConfig().map
  library_names = Object.keys(libraries)
  library_names.sort()
  output = []
  for libname in library_names
    if libname.indexOf('/') == -1 # npm package
      output.push libname
  return output

export list_jspm_libraries_as_markdown = cfy ->*
  output = []
  libs_common_files = yield list_files_in_libs_common()
  libs_backend_files = yield list_files_in_libs_backend()
  libs_frontend_files = yield list_files_in_libs_frontend()
  jspm_packages = list_jspm_packages()
  output.push '### NPM Packages'
  for libname in jspm_packages
    output.push '* [' + libname + '](https://www.npmjs.com/package/' + libname + ')'
  function_signatures = yield SystemJS.import('libs_common/function_signatures')
  output.push ''
  output.push '### HabitLab Frontend APIs'
  for filename in libs_common_files
    if not (filename.endsWith('.ls') or filename.endsWith('.js'))
      continue
    libname = filename.replace(/.ls$/, '').replace(/.js$/, '')
    output.push '* [libs_common/' + libname + '](https://github.com/habitlab/habitlab/blob/master/src/libs_common/' + filename + ')'
  output.push ''
  output.push '### HabitLab Common APIs'
  for filename in libs_frontend_files
    if not (filename.endsWith('.ls') or filename.endsWith('.js'))
      continue
    libname = filename.replace(/.ls$/, '').replace(/.js$/, '')
    output.push '* [libs_frontend/' + libname + '](https://github.com/habitlab/habitlab/blob/master/src/libs_frontend/' + filename + ')'
  output.push ''
  output.push '### HabitLab Backend APIs'
  for libname in function_signatures.list_libs()
    filename = libname + '.ls'
    if libs_backend_files.indexOf(filename) == -1
      filename = libname + '.js'
    output.push '* [libs_common/' + libname + '](https://github.com/habitlab/habitlab/blob/master/src/libs_backend/' + filename + ')'
  return output.join('\n')

export printcb = (x) -> console.log(x)

export printcb_json = (x) -> console.log(JSON.stringify(x, 0, 2))

export jspm_eval = (x) ->
  SystemJS.import('data:text/javascript;base64,' + btoa(unescape(encodeURIComponent(x))))

export printfunc = (func, ...args) ->
  nargs = [x for x in args]
  nargs.push printcb
  func.apply({}, nargs)

gexport_module 'background_common', -> eval(it)
