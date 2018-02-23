
let valid_function_names_cached = []
async function get_api_function_names() {
  let api_doc_text = await fetch('API.md').then(x => x.text())
  let lines_with_functions = api_doc_text.split('\n').filter(x => x.startsWith('[const {'))
  let functions = {}
  for(let line of lines_with_functions) {
    let name = line.substring(line.indexOf('{') + 1, line.indexOf('}'))
    let require_statement = line.substring(line.indexOf('[') + 1, line.indexOf(']'))
    functions[name] = require_statement
  }
  return functions
}

function is_api_import_declaration(declaration, api_function_names) {
  if(declaration.type != 'VariableDeclarator') return false
  if(declaration.id.type != 'ObjectPattern') return false
  if(declaration.id.properties.length != 1) {
    console.log('unknown case, number of properties != 1')
    return false
  }
  let property = declaration.id.properties[0]
  if(property.type != 'Property' || property.kind != 'init') return false
  if(property.key.type != 'Identifier') return false
  let func_name = property.key.name
  if(declaration.init.type != 'CallExpression') return false
  if(declaration.init.callee.type != 'Identifier') return false
  let func_call = declaration.init.callee.name
  if(declaration.init.arguments.length != 1) {
    console.log('arguments is not 1, case unaccounted for')
    return false
  }
  let arg0 = declaration.init.arguments[0].raw
  if(api_function_names[func_name] == 'const {' + func_name + '} = ' + func_call + '(' + arg0 + ')') return true
}

function is_api_call_missing_require(expression, imported_api_functions, api_function_names) {
  // expression is not a call expression
  if(expression.type != 'CallExpression') return false
  // callee function is not an api function
  if(expression.callee.type != 'Identifier') return false
  if(Object.keys(api_function_names).indexOf(expression.callee.name) == -1) return false
  // api function call was already required
  if(imported_api_functions.indexOf(expression.callee.name) >= 0) return false
  return true
}

async function list_all_api_calls_missing_require(ast, api_function_names) {
  let api_calls_missing_require = []
  let imported_api_functions = []
  for(let line of ast.body) {
    let expressions = []
    switch(line.type) {
      case 'ExpressionStatement':
        if(is_api_call_missing_require(line.expression, imported_api_functions, api_function_names))
          api_calls_missing_require.push(line.expression)
        break;
      case 'VariableDeclaration':
        for(let declaration of line.declarations) {
          if(is_api_import_declaration(declaration, api_function_names)) {
            console.log('is api import decl')
            imported_api_functions.push(declaration.id.properties[0].key.name)
          }
          else if(is_api_call_missing_require(declaration.init, imported_api_functions, api_function_names))
            api_calls_missing_require.push(declaration.init)
        }
        break;
      default:
        console.log('AST type not accounted for ' + line.type);
        break;
    }
  }
  return api_calls_missing_require
}

async function list_missing_imports(js_editor, ast, output, text) {
  console.log(ast)
  let api_function_names = await get_api_function_names()
  let api_calls_missing_require = await list_all_api_calls_missing_require(ast, api_function_names)
  output = await remove_api_call_eslint_errors(output, api_function_names)
  for(let api_call of api_calls_missing_require) {
    let start = js_editor.session.doc.indexToPosition(api_call.callee.start)
    let end = js_editor.session.doc.indexToPosition(api_call.callee.end)
    output.push({
      message: 'API call missing import. Use ' + api_function_names[api_call.callee.name],
      line: start.row + 1,
      column: start.column + 1,
      endLine: end.row + 1,
      endColumn: end.column + 1
    })
  }
  return output
}

async function check_undefined_identifier_use(output) {
  console.log("here 1.5")
  console.log("checking undefined identifiers")
  console.log(output)
  for(let index in output) {
    let error_msg = output[index]
    console.log(error_msg)
    if(error_msg.message == "'$' is not defined.") {
      error_msg.message = "Trying to use jQuery? Be sure to include \"const $ = require('jQuery')\""
    } else if(error_msg.message == "'sweetalert' is not defined." || error_msg.message == "'swal' is not defined.") {
      error_msg.message = "Trying to use SweetAlert? Be sure to include \"var sweetalert = require_package('sweetalert2')\""
    }
    console.log(error_msg.message)
    output[index] = error_msg
  }
  return output
}


async function remove_api_call_eslint_errors(output, api_function_names) {
  for(let i = 0; i < output.length; i++) {
    let error = output[i]
    let regex = /\'.*\' is not defined./
    if(error.message.match(regex) != null) {
      let undefined_call = error.message.split("'")[1]
      for(let name in api_function_names) {
        if(name == undefined_call) {
          output.splice(i, 1)
          i--;
        } 
      }
    }
  }
  return output
}

let espree_cached = null
async function get_espree() {
  if (espree_cached) {
    return espree_cached
  }
  espree_cached = await SystemJS.import('espree')
  return espree_cached
}

let eslint_cached = null
async function get_eslint() {
  if (eslint_cached) {
    return eslint_cached
  }
  eslint_cached = await SystemJS.import('eslint')
  return eslint_cached
}

async function run_eslint_checks(text) {
  let eslint = await get_eslint()
  let eslint_config = {"parserOptions":{"sourceType":"module","ecmaVersion":8,"ecmaFeatures":{"impliedStrict":1}},"extends":["eslint:recommended","plugin:import/errors","plugin:import/warnings","plugin:habitlab/standard"],"env":{"es6":1,"browser":1,"webextensions":1,"commonjs":1},"globals":{"SystemJS":1,"require":1,"require_package":1,"require_component":1,"exports":1,"module":1,"console":1,"Polymer":true,"intervention":true,"positive_goal_info":true,"goal_info":true,"tab_id":true,"Buffer":true,"dlog":true,"parameters":true,"set_default_parameters":true},
    "rules":{"no-console":0,"no-unused-vars":1,"require-yield":1,"no-undef":1,"comma-dangle":["warn","only-multiline"]}}
  let errors = eslint.linter.verify(text, eslint_config)
  return errors
}

async function parse_text(text) {
  let espree = await get_espree()
  return espree.parse(text, {tolerant: true, ecmaVersion: 8})
}

async function run_all_checks(js_editor, text) {
  let output = await run_eslint_checks(text)
  console.log(output)
  console.log("here 1")
  output = await check_undefined_identifier_use(output)
  console.log("here 2")
  let ast = await parse_text(text)
  output = await list_missing_imports(js_editor, ast, output, text)
  return output
}

module.exports = {
  run_all_checks
}

