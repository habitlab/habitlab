{
  cfy
  yfy
} = require 'cfy'

export send_message_to_background = yfy (type, data, callback) ->
  chrome.runtime.sendMessage {
    type
    data
  }, (result) ->
    if callback?
      callback(result)
  return true

if IS_CONTENT_SCRIPT

  export load_css_file = cfy (filename) ->*
    yield send_message_to_background 'load_css_file', {css_file: filename}

  export load_css_code = cfy (css_code) ->*
    yield send_message_to_background 'load_css_code', {css_code: css_code}

else

  $ = require 'jquery'

  export load_css_file = cfy (filename) ->*
    css_code = yield $.get(filename)
    yield load_css_code(css_code)

  export load_css_code = cfy (css_code) ->*
    STYLES = document.createElement('style')
    #STYLES.textContent = style_parsed.textContent
    if STYLES.styleSheet
      STYLES.styleSheet.cssText = css_code
    else
      STYLES.appendChild(document.createTextNode(css_code))
    document.documentElement.appendChild(STYLES)
    return
