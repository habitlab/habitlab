{yfy, cfy} = require 'cfy'

export sleep = (time) ->>
  return new Promise ->
    setTimeout(it, time)

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

# timeperiod: milliseconds
export run_every_timeperiod = (func, timeperiod) ->
  last_run_time = Date.now()
  func()
  setInterval ->
    cur_time = Date.now()
    if last_run_time + timeperiod < cur_time
      # need to run again
      last_run_time := cur_time
      func()
  , 1000
