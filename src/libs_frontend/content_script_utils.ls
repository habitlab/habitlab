export send_message_to_background = (type, data, callback) ->
  chrome.runtime.sendMessage {
    type
    data
  }, (result) ->
    if callback?
      callback(result)
  return true

if IS_CONTENT_SCRIPT

  export load_css_file = (filename, callback) ->
    send_message_to_background 'load_css_file', {css_file: filename}, callback

  export load_css_code = (css_code, callback) ->
    send_message_to_background 'load_css_code', {css_code: css_code}, callback

else

  $ = require 'jquery'

  export load_css_file = (filename, callback) ->
    css_code <- $.get filename
    load_css_code css_code, callback

  export load_css_code = (css_code, callback) ->
    STYLES = document.createElement('style')
    #STYLES.textContent = style_parsed.textContent
    if STYLES.styleSheet
      STYLES.styleSheet.cssText = css_code
    else
      STYLES.appendChild(document.createTextNode(css_code))
    document.documentElement.appendChild(STYLES)
    callback?!
