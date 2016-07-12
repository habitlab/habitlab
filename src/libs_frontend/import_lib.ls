{
  list_functions_in_lib
  get_function_signature
} = require 'libs_common/function_signatures'

{
  send_message_to_background
} = require 'libs_frontend/content_script_utils'

{cfy} = require 'cfy'

export import_lib = (lib_name) ->
  output = {}
  for func_name in list_functions_in_lib(lib_name)
    output[func_name] = import_func(func_name)
  return output

export import_func = (func_name) ->
  signature = get_function_signature(func_name)
  if not signature?
    throw new Error("need to add function signature for function #{func_name} in library #{lib_name} to libs_common/function_signatures.ls")
  if not (typeof(signature) == 'string' or Array.isArray(signature))
    throw new Error("invalid signature #{JSON.stringify(signature)} for function #{func_name} in library #{lib_name} in libs_common/function_signatures.ls")
  if Array.isArray(signature)
    return cfy (...args) ->*
      arg_dict = {}
      for arg_name,idx in signature
        arg_dict[arg_name] = args[idx]
      yield send_message_to_background(func_name, arg_dict)
    , {num_args: signature.length}
  if typeof(signature) == 'string'
    return cfy (arg) ->*
      yield send_message_to_background(func_name, arg)
  throw new Error("import_func failed for function #{func_name} with signature #{JSON.stringify(signature)}")
