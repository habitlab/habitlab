{
  cfy
  yfy
} = require 'cfy'

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
