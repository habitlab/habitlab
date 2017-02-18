{
  cfy
  yfy
} = require 'cfy'

{
  localget
} = require 'libs_common/cacheget_utils'

$ = require 'jquery'

css_packages = require('libs_common/css_packages')

export load_css_file = cfy (filename) ->*
  if css_packages[filename]?
    filename = css_packages[filename]
  css_code = yield localget(filename)
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
