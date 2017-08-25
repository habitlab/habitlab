require! {
  espree
}

walk = require 'esprima-walk'

list_requires_multi = (code, list_of_function_names) ->
  if not list_of_function_names?
    list_of_function_names = ['require']
  parsed = espree.parse code, {
    tolerant: true
    ecmaVersion: 8
  }
  function_name_to_output = {}
  for function_name in list_of_function_names
    output = []
    output_set = {}
    walk parsed, (node) ->
      if node?type == 'CallExpression' and node?callee?type == 'Identifier' and node?callee?name == function_name
        value = node?arguments?0?value
        if not value?
          value = node?arguments?0?quasis?0?value?raw
        if value? and typeof(value) == 'string'
          if not output_set[value]
            output.push value
            output_set[value] = true
    function_name_to_output[function_name] = output
  return function_name_to_output

module.exports = list_requires_multi
