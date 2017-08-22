{
  systemjsget
} = require 'libs_common/cacheget_utils'

css_packages = require('libs_common/css_packages')
css_files_cached = require('libs_common/css_files_cached')

loaded_css_files = {}

/**
 * Loads a css file
 * @param {string} filename - name of css package or path to css file
 */
export load_css_file = (filename) ->>
  if css_packages[filename]?
    filename = css_packages[filename]
  if loaded_css_files[filename]?
    return
  loaded_css_files[filename] = true
  if css_files_cached[filename]?
    css_code = css_files_cached[filename]
  else
    css_code = await systemjsget(filename)
  await load_css_code(css_code)

/**
 * Loads some css code
 * @param {string} css_code - the css code to load
 */
export load_css_code = (css_code) ->>
  STYLES = document.createElement('style')
  #STYLES.textContent = style_parsed.textContent
  if STYLES.styleSheet
    STYLES.styleSheet.cssText = css_code
  else
    STYLES.appendChild(document.createTextNode(css_code))
  document.documentElement.appendChild(STYLES)
  return
