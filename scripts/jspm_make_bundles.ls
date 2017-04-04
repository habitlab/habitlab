require! {
  'js-yaml'
  'fs'
}

{exec, which} = require 'shelljs'

for command in ['jspm', 'babili-inplace']
  if not which command
    console.log "missing #{command} command. please run the following command:"
    console.log "npm install -g #{command}"
    process.exit()

read_jspm_browser_config = ->
  jspm_browser_data_text = fs.readFileSync('jspm.browser.js', 'utf-8').replace('SystemJS.config(', '').replace('});', '}')
  jspm_browser_data = js-yaml.safeLoad jspm_browser_data_text
  return jspm_browser_data

read_bundle_contents = ->
  jspm_browser_data = read_jspm_browser_config()
  return jspm_browser_data.bundles['build.js']

read_jspm_browser_config_clean = ->
  jspm_browser_data = read_jspm_browser_config()
  jspm_browser_data.bundles = {}
  return jspm_browser_data

make_jspm_browser_config_with_bundles = (bundles) ->
  jspm_browser_data = read_jspm_browser_config_clean()
  if bundles?
    jspm_browser_data.bundles = JSON.parse JSON.stringify bundles
  else
    jspm_browser_data.bundles = {}
  return 'SystemJS.config(' + JSON.stringify(jspm_browser_data, null, 2) + ');'

write_jspm_browser_config_with_bundles = (bundles) ->
  jspm_browser_config = make_jspm_browser_config_with_bundles bundles
  fs.writeFileSync 'jspm.browser.js', jspm_browser_config, 'utf-8'

console.log make_jspm_browser_config_with_bundles()
jspm_bundle_info_list = js-yaml.safeLoad fs.readFileSync 'jspm_bundles.yaml', 'utf-8'
bundle_output = {}
for jspm_bundle_info in jspm_bundle_info_list
  write_jspm_browser_config_with_bundles()
  bundle_name = Object.keys(jspm_bundle_info)[0]
  bundle_contents = jspm_bundle_info[bundle_name]
  bundle_contents_string = bundle_contents.map(-> '"' + it + '"').join(' ')
  exec "jspm bundle #{bundle_contents_string} --inject"
  bundle_output["bundles/#{bundle_name}.js"] = read_bundle_contents()
  exec "babili-inplace build.js"
  fs.renameSync 'build.js', "bundles/#{bundle_name}.js"
  fs.unlinkSync 'build.js.map'
write_jspm_browser_config_with_bundles(bundle_output)
