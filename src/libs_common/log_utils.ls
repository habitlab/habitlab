{
  addtolog
  getlog
  clearlog
} = require 'libs_common/log_utils_base'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{cfy} = require 'cfy'

/*
export addtolog = (name, data, callback) ->
  console.log "added data to log with name #{name}"
  console.log data
  callback?!
*/

export log_impression = cfy (name) ->*
  # name = intervention name
  # ex: facebook/notification_hijacker
  console.log "impression logged for #{name}"
  yield addtolog name, {type: 'impression', timestamp: Date.now()}

export log_action = cfy (name, data) ->*
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
  yield addtolog name, new_data

export addtolog
export getlog
export clearlog

gexport_module 'log_utils', -> eval(it)
