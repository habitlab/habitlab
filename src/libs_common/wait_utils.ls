wait_token_to_callback = {}

export make_wait_token = ->
  while true
    wait_token = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    if not wait_token_to_callback[wait_token]
      return wait_token

export wait_for_token = (wait_token, callback) ->
  wait_token_to_callback[wait_token] = callback

export finished_waiting = (wait_token, data) ->
  callback = wait_token_to_callback[wait_token]
  delete wait_token_to_callback[wait_token]
  callback(data)