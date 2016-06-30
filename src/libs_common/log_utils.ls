if chrome.windows # background page
  {
    addtolog
    getlog
    clearlog
  } = require 'libs_backend/log_utils'
else
  {
    addtolog
    getlog
    clearlog
  } = require 'libs_frontend/log_utils'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

/*
export addtolog = (name, data, callback) ->
  console.log "added data to log with name #{name}"
  console.log data
  callback?!
*/

export log_impression = (name, callback) ->
  # name = intervention name
  # ex: facebook/notification_hijacker
  console.log "impression logged for #{name}"
  addtolog name, {type: 'impression', timestamp: Date.now()}, callback

export log_action = (name, data, callback) ->
  # name = intervention name
  # ex: facebook/notification_hijacker
  # data: a dictionary containing any details necessary
  # ex: {}
  new_data = {}
  for k,v of data
    new_data[k] = v
  new_data.timestamp = Date.now()
  new_data.type = 'action'
  console.log "action logged for #{name} with data #{JSON.stringify(data)}"
  addtolog name, new_data, callback

export addtolog
export getlog
export clearlog

gexport_module 'log_utils', -> eval(it)
