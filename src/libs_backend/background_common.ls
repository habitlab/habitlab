{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  as_array
} = require 'libs_common/collection_utils'

{
  memoizeSingleAsync
} = require 'libs_common/memoize'

{generate_random_id} = require 'libs_common/generate_random_id'

chrome_tabs_sendmessage = (tab_id, data, options) ->
  if not options?
    options = {}
  return new Promise (resolve, reject) ->
    chrome.tabs.sendMessage tab_id, data, options, (result) ->
      resolve(result)
      return true

chrome_storage_sync = chrome.storage?sync ? chrome.storage?local

cached_user_id = null

export get_user_id = memoizeSingleAsync ->>
  user_id = await get_user_id_real()
  if user_id.length == 24
    return user_id
  else
    cached_user_id := null
    localStorage.removeItem('userid')
    await new Promise -> chrome_storage_sync.remove 'userid', it
    return await get_user_id_real()

export get_user_id_from_history = ->>
  history_search_results = await new Promise -> chrome.history.search({text: 'https://habitlab.stanford.edu', startTime: 0}, it)
  for search_result in history_search_results
    if search_result.url.startsWith('https://habitlab.stanford.edu/#hashdata|')
      data_text = search_result.url.replace('https://habitlab.stanford.edu/#hashdata|', '')
      for data_line in data_text.split('|')
        if data_line.includes('=')
          data_line_entries = data_line.split('=')
          key = data_line_entries[0]
          value = data_line_entries[1]
          if key == 'userid'
            return value
  return null

export clear_user_id_from_history = ->>
  history_search_results = await new Promise -> chrome.history.search({text: 'https://habitlab.stanford.edu', startTime: 0}, it)
  for search_result in history_search_results
    if search_result.url.startsWith('https://habitlab.stanford.edu/#hashdata|')
      await new Promise -> chrome.history.deleteUrl({url: search_result.url}, it)

export set_user_id_in_history = (userid) ->>
  return await new Promise -> chrome.history.addUrl({url: 'https://habitlab.stanford.edu/#hashdata|source=extension|userid=' + userid}, it)

get_user_id_real = ->>
  if cached_user_id?
    return cached_user_id
  userid = localStorage.getItem('userid')
  if userid?
    cached_user_id := userid
    return userid
  items = await new Promise -> chrome_storage_sync.get 'userid', it
  userid = items.userid
  if userid?
    cached_user_id := userid
    localStorage.setItem('userid', userid)
    return userid
  userid = await get_user_id_from_history()
  if not userid?
    userid = generate_random_id()
    await set_user_id_in_history(userid)
  cached_user_id := userid
  localStorage.setItem('userid', userid)
  await new Promise -> chrome_storage_sync.set {userid}, it
  return userid

cached_user_secret = null

export get_user_secret = memoizeSingleAsync ->>
  user_secret = await get_user_secret_real()
  if user_secret.length == 24
    return user_secret
  else
    cached_user_secret := null
    localStorage.removeItem('user_secret')
    await new Promise -> chrome_storage_sync.remove 'user_secret', it
    return await get_user_secret_real()

get_user_secret_real = ->>
  if cached_user_secret?
    return cached_user_secret
  user_secret = localStorage.getItem('user_secret')
  if user_secret?
    cached_user_secret := user_secret
    return user_secret
  items = await new Promise -> chrome_storage_sync.get 'user_secret', it
  user_secret = items.user_secret
  if user_secret?
    cached_user_secret := user_secret
    localStorage.setItem('user_secret', user_secret)
    return user_secret
  user_secret = generate_random_id()
  cached_user_secret := user_secret
  localStorage.setItem('user_secret', user_secret)
  await new Promise -> chrome_storage_sync.set {user_secret}, it
  return user_secret

export send_message_to_active_tab = (type, data) ->>
  tabs = await new Promise -> chrome.tabs.query {active: true, lastFocusedWindow: true}, it
  if tabs.length == 0
    return
  await chrome_tabs_sendmessage tabs[0].id, {type, data}

send_message_to_all_active_tabs = (type, data) ->>
  tabs = await new Promise -> chrome.tabs.query {active: true}, it
  if tabs.length == 0
    return
  outputs = []
  for tab in tabs
    result = await chrome_tabs_sendmessage tab.id, {type, data}
    outputs.push(result)
  return outputs

export eval_content_script = (script) ->>
  results = await send_message_to_all_active_tabs 'eval_content_script', script
  for result in results
    console.log result
  return result

export eval_content_script_for_active_tab = (script) ->>
  await send_message_to_active_tab 'eval_content_script', script

export eval_content_script_debug_for_active_tab = (script) ->>
  await send_message_to_active_tab 'eval_content_script_debug', script

export eval_content_script_debug_for_tabid = (tabid, script) ->>
  await chrome_tabs_sendmessage tabid, {type: 'eval_content_script_debug', data: script}

export eval_content_script_for_tabid = (tabid, script) ->>
  await chrome_tabs_sendmessage tabid, {type: 'eval_content_script', data: script}

export list_currently_loaded_interventions = ->>
  console.log 'list_currently_loaded_interventions'
  tab = await get_active_tab_info()
  console.log 'tab'
  console.log tab
  loaded_interventions = await eval_content_script_for_tabid tab.id, 'window.loaded_interventions'
  console.log 'loaded_interventions'
  console.log loaded_interventions
  return as_array(loaded_interventions)

export list_currently_loaded_interventions_for_tabid = (tab_id) ->>
  console.log 'list_currently_loaded_interventions_for_tabid'
  loaded_interventions = await eval_content_script_for_tabid tab_id, 'window.loaded_interventions'
  return as_array(loaded_interventions)

export is_tab_still_open = (tab_id) ->>
  tabs = await new Promise -> chrome.tabs.query {}, it
  for tab in tabs
    if tab.id == tab_id
      return true
  return false

export open_debug_page_for_tab_id = (tab_id) ->>
  debug_page_url = chrome.runtime.getURL('index.html?tag=terminal-view&autoload=true&ispopup=true&tabid=' + tab_id)
  popup_windows = await new Promise -> chrome.windows.getAll {windowTypes: ['popup']}, it
  for popup_window in popup_windows
    window_info = await new Promise -> chrome.windows.get popup_window.id, {populate: true}, it
    for tab in window_info.tabs
      if tab.url == debug_page_url
        await new Promise -> chrome.tabs.update tab.id, {active: true}, it
        return await new Promise -> chrome.windows.update popup_window.id, {focused: true}, it
  await new Promise -> chrome.windows.create {url: debug_page_url, type: 'popup', width: 566, height: 422}, it

export send_message_to_tabid = (tabid, type, data) ->>
  return chrome_tabs_sendmessage tabid, {type, data}

export disable_interventions_for_tabid = (tabid) ->>
  await eval_content_script_for_tabid tabid, """
  document.body.dispatchEvent(new CustomEvent('disable_intervention'))
  """

export disable_interventions_in_active_tab = ->>
  tab = await get_active_tab_info()
  await disable_interventions_for_tabid tab.id

export disable_interventions_in_all_tabs = ->>
  tabs = await new Promise -> chrome.tabs.query {}, it
  await Promise.all [disable_interventions_for_tabid(tab.id) for tab in tabs]
  return

export get_active_tab_info = ->>
  tabs = await new Promise -> chrome.tabs.query {active: true, lastFocusedWindow: true}, it
  if tabs.length > 0
    return tabs[0]
  # this part seems necessary for opera sometimes
  last_focused_window_info = await new Promise -> chrome.windows.getLastFocused(it)
  if not last_focused_window_info?id?
    return
  tabs = await new Promise -> chrome.tabs.query {active: true, windowId: last_focused_window_info.id}, it
  if tabs.length > 0
    return tabs[0]
  return

export get_active_tab_url = ->>
  active_tab_info = await get_active_tab_info()
  return active_tab_info.url

export get_active_tab_id = ->>
  active_tab_info = await get_active_tab_info()
  return active_tab_info.id

remote_file_exists = (remote_file_path) ->>
  try
    request = await fetch(remote_file_path)
    contents = await request.text()
    return true
  catch
    return false

extension_url_exists = (extension_file_path) ->>
  await remote_file_exists(chrome.extension.getURL(extension_file_path))

fetch_remote_json_cache = {}

fetch_remote_json = (path) ->>
  if fetch_remote_json_cache[path]?
    return fetch_remote_json_cache[path]
  request = await fetch(path)
  tree_text = await request.text()
  tree_contents = JSON.parse(tree_text)
  fetch_remote_json_cache[path] = tree_contents
  return tree_contents

list_files_in_path_for_github_repo = (path) ->>
  path_parts = [x for x in path.split('/') when x? and x.length > 0]
  current_path = 'https://api.github.com/repos/habitlab/habitlab/git/trees/master'
  for path_part in path_parts
    tree_contents = await fetch_remote_json(current_path)
    matching_parts = [x for x in tree_contents.tree when x.path == path_part]
    if matching_parts.length == 0
      return []
    current_path = matching_parts[0].url
  tree_contents = await fetch_remote_json(current_path)
  return [x.path for x in tree_contents.tree]

list_files_in_libs_common = ->>
  await list_files_in_path_for_github_repo 'src/libs_common'

list_files_in_libs_backend = ->>
  await list_files_in_path_for_github_repo 'src/libs_backend'

list_files_in_libs_frontend = ->>
  await list_files_in_path_for_github_repo 'src/libs_frontend'

list_jspm_packages = ->
  libraries = SystemJS.getConfig().map
  library_names = Object.keys(libraries)
  library_names.sort()
  output = []
  for libname in library_names
    if libname.indexOf('/') == -1 # npm package
      output.push libname
  return output

export list_jspm_libraries_as_markdown = ->>
  output = []
  libs_common_files = await list_files_in_libs_common()
  libs_backend_files = await list_files_in_libs_backend()
  libs_frontend_files = await list_files_in_libs_frontend()
  jspm_packages = list_jspm_packages()
  output.push '### NPM Packages'
  for libname in jspm_packages
    output.push '* [' + libname + '](https://www.npmjs.com/package/' + libname + ')'
  function_signatures = await SystemJS.import('libs_common/function_signatures')
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
