#!/usr/bin/env lsc

require! {
  fs
  cheerio
  process
  path
  optionator
}

src_path = path.resolve process.argv[1], '../../src'

options = {}

do ->
  options_list = [
    {
      option: 'tostdout'
      type: 'Boolean'
      default: 'false'
      description: 'Prints result to stdout instead of writing to file'
    }
    {
      option: 'regenerate'
      type: 'Boolean'
      default: 'true'
      description: 'Regenerates files that already exist'
    }
    {
      option: 'recursive'
      type: 'Boolean'
      default: 'true'
      description: 'Generates files recursively'
    }
  ]
  option_parser = optionator {
    options: options_list
  }
  options := option_parser.parseArgv(process.argv)

get_abs_path_noerr = (import_path, filepath_abs) ->
  output = path.resolve filepath_abs, import_path
  if fs.existsSync(output)
    return output
  output = path.resolve src_path, import_path
  if fs.existsSync(output)
    return output
  return null

get_abs_path = (import_path, filepath_abs) ->
  output = get_abs_path_noerr import_path, filepath_abs
  if output == null
    console.log "missing file #{import_path} relative to #{filepath_abs} or #{src_path}"
    process.exit()
  return output

get_abs_path_script = (import_path, filepath_abs) ->
  output = get_abs_path_noerr import_path, filepath_abs
  if output == null
    for extension in ['.ls', '.jsx']
      output = get_abs_path_noerr import_path.replace(/\.js$/, extension), filepath_abs
      if output != null
        break
  if output == null
    console.log "missing file #{import_path} relative to #{filepath_abs} or #{src_path}"
    process.exit()
  return output

# dependencies for script tag
script_deps = (tag, params) ->
  {filepath_abs, $} = params
  import_path = $(tag).attr('src')
  filename_abs = get_abs_path_script import_path, filepath_abs
  filename_rel = path.relative src_path, filename_abs
  return "require('#{filename_rel}')"

get_html_import_abspath = (tag, params) ->
  {filepath_rel, filepath_abs, $} = params
  import_path = $(tag).attr('href')
  filename_abs = get_abs_path import_path, filepath_abs
  return filename_abs

# dependencies for html imports
html_import_deps = (tag, params) ->
  {filepath_rel, filepath_abs, $} = params
  import_path = $(tag).attr('href')
  filename_abs = get_abs_path import_path, filepath_abs
  filename_rel = path.relative src_path, filename_abs
  output = []
  #output.push "import_dom_modules(require('html!#{relative_path}'))"
  deps_file = filename_rel.replace(/\.html$/, '.deps.js')
  output.push "require('#{deps_file}')"
  return output.join "\n"

generate_dependencies_for_file = (filename_abs) ->
  outfile_abs = filename_abs.replace(/\.html/, '.deps.js')
  if not options.tostdout and fs.existsSync(outfile_abs)
    if not options.regenerate
      return
    fs.unlinkSync(outfile_abs)
  console.log "generating: #{outfile_abs}"
  filename_rel = path.relative src_path, filename_abs
  filepath_rel = path.resolve filename_rel, '..'
  filepath_abs = path.resolve filename_abs, '..'
  $ = cheerio.load(fs.readFileSync(filename_abs, 'utf-8'))
  params = {filepath_rel, filepath_abs, $}
  output = []
  dependencies = []
  output.push "const {import_dom_modules} = require('libs_frontend/dom_utils')"
  for tag in $('link[rel="import"]')
    dependencies.push get_html_import_abspath(tag, params)
    output.push html_import_deps(tag, params)
  output.push "import_dom_modules(require('html!#{filename_rel}'))"
  for tag in $('script')
    output.push script_deps(tag, params)
  output = output.join("\n").split("\n").filter(-> it.length > 0).join("\n") + "\n"
  if options.tostdout
    console.log output
    return
  fs.writeFileSync outfile_abs, output
  if options.recursive
    for dep in dependencies
      generate_dependencies_for_file(dep)
  return

do ->
  filename = options['_'][0] # first positional argument
  filename = path.resolve(filename)
  #relative_path = path.relative src_path, filename
  #console.log relative_path
  generate_dependencies_for_file(filename)
  #console.log input_file_path
