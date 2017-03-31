{
  get_function_signature
  list_functions_in_lib
} = require 'libs_common/function_signatures'

func_name_to_func = {
  #'hello_world': (callback) -> callback('hello world')
  #'add_numbers': (x, y, callback) -> callback(x + y)
}

export expose_lib = (lib_name, dict) ->
  for func_name in list_functions_in_lib(lib_name)
    expose_func(func_name, dict[func_name])
  return

export expose = (dict) ->
  for func_name,func of dict
    expose_func(func_name, func)
  return

# expose function to content scripts
export expose_func = (func_name, func) ->
  signature = get_function_signature(func_name)
  if not signature?
    throw new Error("need to add function signature for function #{func_name} to libs_common/function_signatures.ls")
  if not (typeof(signature) == 'string' or Array.isArray(signature))
    throw new Error("invalid signature #{JSON.stringify(signature)} for function #{func_name} in libs_common/function_signatures.ls")
  if not func?
    throw new Error("invalid function provided to expose_func for name #{func_name}")
  func_name_to_func[func_name] = func

export get_func_by_name = (func_name) ->
  return func_name_to_func[func_name]

export get_message_handler = (func_name) ->
  signature = get_function_signature(func_name)
  func = func_name_to_func[func_name]
  if Array.isArray(signature)
    return (data) ->>
      args = [data[arg_name] for arg_name in signature]
      return await func(...args)
  if typeof(signature) == 'string'
    return func
    #return (arg) ->>
    #  return await func(arg)
  throw new Error("get_message_handler failed for function named #{func_name} with signature #{JSON.stringify(signature)}")

export get_all_message_handlers = ->
  output = {}
  for func_name in Object.keys(func_name_to_func)
    output[func_name] = get_message_handler(func_name)
  return output
