
let valid_function_names_cached = []
async function get_api_function_names() {
  let api_doc_text = await fetch('API.md').then(x => x.text())
  let lines_with_functions = api_doc_text.split('\n').filter(x => x.startsWith('[const {'))
  let output = []

  return output
}

async function list_missing_imports(ast, output) {
  console.log(ast)
  output.push({
    message: 'list missing imports'
  })
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
  let eslint_config = {"parserOptions":{"sourceType":"module","ecmaVersion":8,"ecmaFeatures":{"impliedStrict":1}},"extends":["eslint:recommended","plugin:import/errors","plugin:import/warnings","plugin:habitlab/standard"],"env":{"es6":1,"browser":1,"webextensions":1,"commonjs":1},"globals":{"SystemJS":1,"require":1,"require_component":1,"exports":1,"module":1,"console":1,"Polymer":true,"intervention":true,"positive_goal_info":true,"goal_info":true,"tab_id":true,"Buffer":true,"dlog":true,"parameters":true,"set_default_parameters":true},
  "rules":{"no-console":0,"no-unused-vars":1,"require-yield":1,"no-undef":1,"comma-dangle":["warn","only-multiline"]}}
  console.log(eslint_config)
  let errors = eslint.linter.verify(text, eslint_config)
  return errors
}

async function parse_text(text) {
  let espree = await get_espree()
  return espree.parse(text, {tolerant: true, ecmaVersion: 8})
}

async function run_all_checks(text) {
  let output = await run_eslint_checks(text)
  let ast = await parse_text(text)
  let rules = [
    list_missing_imports
  ]
  for (let rule of rules) {
    await rule(ast, output)
  }
  return output
}

module.exports = {
  run_all_checks
}

