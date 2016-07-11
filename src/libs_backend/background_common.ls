require! {
  async
}

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{cfy, yfy} = require 'cfy'

chrome_tabs_sendmessage = yfy (tab_id, data, options, callback) ->
  if not callback? and typeof(options) == 'function'
    callback = options
    options = {}
  chrome.tabs.sendMessage tab_id, data, options, (result) ->
    callback(result)
    return true

chrome_tabs_query = yfy(chrome.tabs.query)

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

export send_message_to_tabid = cfy (tabid, type, data) ->*
  return chrome_tabs_sendmessage tabid, {type, data}

export get_active_tab_info = cfy ->*
  tabs = yield chrome_tabs_query {active: true, lastFocusedWindow: true}
  if tabs.length == 0
    return
  return tabs[0]

export get_active_tab_url = cfy ->*
  active_tab_info = yield get_active_tab_info()
  return active_tab_info.url

export printcb = (x) -> console.log(x)

export printfunc = (func, ...args) ->
  nargs = [x for x in args]
  nargs.push printcb
  func.apply({}, nargs)

gexport_module 'background_common', -> eval(it)
