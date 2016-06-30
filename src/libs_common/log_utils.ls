export addlog = (name, data, callback) ->
  console.log "added data to log with name #{name}"
  console.log data
  callback?!
