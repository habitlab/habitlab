export addlog = (name, data, callback) ->
  console.log "added data to log with name #{name}"
  console.log data
  callback?!

export log_impression = (name, callback) ->
  # name = intervention name
  # ex: facebook/notification_hijacker
  console.log "impression logged for #{name}"
  callback?!

export log_action = (name, data, callback) ->
  # name = intervention name
  # ex: facebook/notification_hijacker
  # data: a dictionary containing any details necessary
  # ex: {}
  console.log "action logged for #{name} with data #{JSON.stringify(data)}"
  callback?!
