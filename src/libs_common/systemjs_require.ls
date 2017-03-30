{cfy} = require 'cfy'

lib_cache = {}

common_libs_list = [
  'jquery'
  'cfy'
  'libs_common/domain_utils'
  'libs_common/time_utils'
  'moment'
]

frontend_libs_list = []
backend_libs_list = []

export make_require = (lib_names) ->>
  for lib_name in lib_names
    lib_name = lib_name.replace(/\.deps$/, '.jspm')
    if not lib_cache[lib_name]?
      lib_cache[lib_name] = await SystemJS.import(lib_name)
  return (lib_name) ->
    lib_name = lib_name.replace(/\.deps$/, '.jspm')
    lib_cache[lib_name]

export make_require_frontend = ->>
  await make_require common_libs_list.concat(frontend_libs_list)

export make_require_backend = ->>
  await make_require common_libs_list.concat(backend_libs_list)
