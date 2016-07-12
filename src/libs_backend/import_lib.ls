{
  list_functions_in_lib
  get_function_signature
} = require 'libs_common/function_signatures'

{
  get_func_by_name
} = require 'libs_backend/expose_lib'

{cfy} = require 'cfy'

export import_lib = (lib_name) ->
  output = {}
  for func_name in list_functions_in_lib(lib_name)
    output[func_name] = import_func(func_name)
  return output

export import_func = get_func_by_name
