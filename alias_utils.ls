require! {
  'js-yaml'
  fs
}

prelude = require 'prelude-ls'

{list_libs} = require('./src/libs_common/function_signatures')

export get_alias_info = ->
  lib_alias_names = []
  lib_alias_names = lib_alias_names.concat prelude.sort(list_libs())
  if fs.existsSync('./src/libs_common/aliases.yaml')
    lib_alias_names = lib_alias_names.concat js-yaml.safeLoad fs.readFileSync('./src/libs_common/aliases.yaml', 'utf-8')
  output = []
  for lib_info in lib_alias_names
    if typeof(lib_info) == 'string'
      lib_info = {
        name: lib_info
        frontend: "libs_frontend/#{lib_info}"
        backend: "libs_backend/#{lib_info}"
      }
    if not lib_info.path?
      lib_info.path = "libs_common/#{lib_info.name}"
    output.push(lib_info)
  return output
