{
  cfy
  yfy
} = require 'cfy'

send_message_to_background = yfy (type, data, callback) ->
  chrome.runtime.sendMessage {
    type
    data
  }, (result) ->
    if callback?
      callback(result)
  return true

export load_css_file = (filename) ->>
  await send_message_to_background 'load_css_file', {css_file: filename}

export load_css_code = (css_code) ->>
  await send_message_to_background 'load_css_code', {css_code: css_code}
