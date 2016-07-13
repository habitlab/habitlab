require! {
  'js-yaml'
  fs
}

export get_alias_info = ->
  lib_alias_names = js-yaml.safeLoad fs.readFileSync('./src/libs_common/aliases.yaml', 'utf-8')
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
