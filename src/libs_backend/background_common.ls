require! {
  async
}

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

export send_message_to_active_tab = (type, data, callback) ->
  chrome.tabs.query {active: true, lastFocusedWindow: true}, (tabs) ->
    if tabs.length == 0
      return
    chrome.tabs.sendMessage tabs[0].id, {type, data}, {}, callback

send_message_to_all_active_tabs = (type, data, callback) ->
  chrome.tabs.query {active: true}, (tabs) ->
    if tabs.length == 0
      return
    outputs = []
    <- async.eachSeries tabs, (tab, ncallback) ->
      chrome.tabs.sendMessage tab.id, {type, data}, {}, (result) ->
        outputs.push(result)
        ncallback()
        return true
    callback(outputs)

export eval_content_script = (script, callback) ->
  send_message_to_all_active_tabs 'eval_content_script', script, (results) ->
    for result in results
      console.log result
    callback?(result)
    return true

export send_message_to_tabid = (tabid, type, data, callback) ->
  chrome.tabs.sendMessage tabid, {type, data}, {}, callback

export get_active_tab_info = (callback) ->
  chrome.tabs.query {active: true, lastFocusedWindow: true}, (tabs) ->
    if tabs.length == 0
      return
    callback tabs[0]
    #chrome.tabs.get tabs[0].id, callback

export get_active_tab_url = (callback) ->
  active_tab_info <- get_active_tab_info
  callback active_tab_info.url

export printcb = (x) -> console.log(x)

export printfunc = (func, ...args) ->
  nargs = [x for x in args]
  nargs.push printcb
  func.apply({}, nargs)

gexport_module 'background_common', -> eval(it)
