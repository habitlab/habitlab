export send_message_to_background = (type, data, callback) ->
  chrome.runtime.sendMessage {
    type
    data
  }, (result) ->
    if callback?
      callback(result)
  return true

export load_css_file = (filename, callback) ->
  send_message_to_background 'load_css_file', {css_file: filename}, callback

export load_css_code = (filename, callback) ->
  send_message_to_background 'load_css_code', {css_code: filename}, callback
