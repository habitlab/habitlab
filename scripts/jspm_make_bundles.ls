require! {
  'js-yaml'
  'fs'
}

{exec} = require 'shelljs'

jspm_bundle_info_list = js-yaml.safeLoad fs.readFileSync 'jspm_bundles.yaml', 'utf-8'
for jspm_bundle_info in jspm_bundle_info_list
  bundle_name = Object.keys(jspm_bundle_info)[0]
  bundle_contents = jspm_bundle_info[bundle_name]
  #exec "jspm bundle #{bundle_contents.join(' ')} --inject"
  #if fs.existsSync('bundle.js')
    
