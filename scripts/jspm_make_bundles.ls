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

read_bundle_contents = ->
  jspm_browser_data_text = fs.readFileSync('jspm.browser.js', 'utf-8')
  bundles_idx = jspm_browser_data_text.indexOf('bundles:')
  jspm_browser_data_text = jspm_browser_data_text.substr(bundles_idx + 'bundles:'.length).trim()
  jspm_browser_data_text = jspm_browser_data_text.replace('});', '').trim()
  bundles = js-yaml.safeLoad jspm_browser_data_text
  return bundles['build.js']

make_jspm_browser_config_with_bundles = (bundles) ->
  jspm_browser_data_text = fs.readFileSync 'jspm_browser_config_template.js', 'utf-8'
  if bundles?
    jspm_browser_data_text = jspm_browser_data_text.replace('bundles: {}', 'bundles: ' + JSON.stringify(bundles, null, 2))
  return jspm_browser_data_text

write_jspm_browser_config_with_bundles = (bundles) ->
  jspm_browser_config = make_jspm_browser_config_with_bundles bundles
  fs.writeFileSync 'jspm.browser.js', jspm_browser_config, 'utf-8'

make_systemjs_paths_config_with_bundles = (bundles) ->
  systemjs_paths_data_text = fs.readFileSync 'systemjs_paths_template.js', 'utf-8'
  if bundles?
    systemjs_paths_data_text = systemjs_paths_data_text.replace('bundles: {}', 'bundles: ' + JSON.stringify(bundles, null, 2))
  return systemjs_paths_data_text

write_systemjs_paths_config_with_bundles = (bundles) ->
  systemjs_paths_config = make_systemjs_paths_config_with_bundles bundles
  fs.writeFileSync 'src/systemjs_paths.js', systemjs_paths_config, 'utf-8'

jspm_bundle_info_list = js-yaml.safeLoad fs.readFileSync 'jspm_bundles.yaml', 'utf-8'
bundle_output = {}
for jspm_bundle_info in jspm_bundle_info_list
  write_jspm_browser_config_with_bundles()
  bundle_name = Object.keys(jspm_bundle_info)[0]
  bundle_contents = jspm_bundle_info[bundle_name]
  bundle_contents_string = bundle_contents.map(-> '"' + it + '"').join(' + ')
  exec "jspm bundle #{bundle_contents_string} --inject"
  bundle_output["bundles/#{bundle_name}.js"] = read_bundle_contents()
  exec "babili-inplace build.js"
  fs.renameSync 'build.js', "src/bundles/#{bundle_name}.js"
  fs.unlinkSync 'build.js.map'
write_jspm_browser_config_with_bundles(bundle_output)
