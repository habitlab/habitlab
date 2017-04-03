require! {
  'js-yaml'
  'fs'
}

{exec} = require 'shelljs'

read_jspm_browser_config = ->
  jspm_browser_data_text = fs.readFileSync('jspm.browser.js', 'utf-8').replace('SystemJS.config(', '').replace('});', '}')
  jspm_browser_data = js-yaml.safeLoad jspm_browser_data_text
  jspm_browser_data.bundles = {}
  return jspm_browser_data

make_jspm_browser_config_with_bundles = (bundles) ->
  jspm_browser_data = read_jspm_browser_config()
  if bundles?
    jspm_browser_data.bundles = JSON.parse JSON.stringify bundles
  else
    jspm_browser_data.bundles = {}
  return 'SystemJS.config(' + JSON.stringify(jspm_browser_data, null, 2) + ');'

console.log make_jspm_browser_config_with_bundles()
jspm_bundle_info_list = js-yaml.safeLoad fs.readFileSync 'jspm_bundles.yaml', 'utf-8'
for jspm_bundle_info in jspm_bundle_info_list
  bundle_name = Object.keys(jspm_bundle_info)[0]
  bundle_contents = jspm_bundle_info[bundle_name]
  #exec "jspm bundle #{bundle_contents.join(' ')} --inject"
  #if fs.existsSync('bundle.js')
    
