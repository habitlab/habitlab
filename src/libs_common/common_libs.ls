{yfy, cfy} = require 'cfy'

export sleep = (time) ->>
  sleep_base = (msecs, callback) ->
    setTimeout(callback, msecs)
  await yfy(sleep_base)(time)

export once_true = yfy (condition, callback) ->
  if condition()
    callback()
  else
    setTimeout ->
      once_true(condition, callback)
    , 100

export run_only_one_at_a_time = (func) ->
  # func is assumed to take 1 argument (finished callback) for the time being
  is_running = false
  return ->
    if is_running
      return
    is_running := true
    func ->
      # finished
      is_running := false
