# To compile this file and generate scripts/generate_polymer_dependencies_lib.js
# npm install -g livescript
# lsc -c scripts/generate_polymer_dependencies.ls

require! {
  fs
  cheerio
  process
  optionator
  glob
}

path = require 'upath'

src_path = null

options = {}

export set_src_path = (new_src_path) ->
  src_path := new_src_path

export set_src_path_from_argv = ->
  src_path := path.resolve(process.argv[1], '../../src')

export get_options = -> options

get_option_parser = ->
  options_list = [
    {
      option: 'tostdout'
      type: 'Boolean'
      default: 'false'
      description: 'Prints result to stdout instead of writing to .deps.js file'
    }
    {
      option: 'verbose'
      type: 'Boolean'
      default: 'false'
      description: 'Prints additional information to stdout'
    }
    {
      option: 'bower'
      type: 'Boolean'
      default: 'false'
      description: 'Include bower_components directory among those we generate .deps.js files for'
    }
    {
      option: 'jspm'
      type: 'Boolean'
      default: 'false'
      description: 'Include jspm_packages directory among those we generate .deps.js files for'
    }
    {
      option: 'target_jspm'
      type: 'Boolean'
      default: 'false'
      description: 'Target for generated files is jspm'
    }
    {
      option: 'node_modules_custom'
      type: 'Boolean'
      default: 'false'
      description: 'Include node_modules_custom directory among those we generate .deps.js files for'
    }
    {
      option: 'regenerate'
      type: 'Boolean'
      default: 'true'
      description: 'Regenerates .deps.js files that already exist'
    }
    {
      option: 'recursive'
      type: 'Boolean'
      default: 'true'
      description: 'Generates .deps.js files recursively'
    }
    {
      option: 'html_require_prefix'
      type: 'Boolean'
      default: 'false'
      description: 'Include html! prefix in the webpack require statement'
    }
  ]
  option_parser = optionator {
    options: options_list
  }
  return option_parser

export set_options = (custom_options) ->
  option_parser = get_option_parser()
  options := option_parser.parseArgv('')
  if custom_options?
    for k,v of custom_options
      options[k] = v

export set_options_from_argv = ->
  option_parser = get_option_parser()
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
  if not output?
    console.log "missing file #{import_path} relative to #{filepath_abs} or #{src_path}"
    #process.exit()
  return output

get_abs_path_script = (import_path, filepath_abs) ->
  output = get_abs_path_noerr import_path, filepath_abs
  if not output?
    for extension in ['.ls', '.jsx']
      output = get_abs_path_noerr import_path.replace(/\.js$/, extension), filepath_abs
      if output != null
        break
  if not output?
    console.log "missing file #{import_path} relative to #{filepath_abs} or #{src_path}"
    #process.exit()
  return output

# dependencies for script tag
script_deps = (tag, params) ->
  {filepath_abs, filename_abs, $} = params
  import_path = $(tag).attr('src')
  if not import_path?
    if filename_abs.endsWith('/src/popup.html')
      return ''
    console.log "script tag in #{filename_abs} is missing src attribute"
    return ''
  filename_abs = get_abs_path_script import_path, filepath_abs
  if not filename_abs?
    return ''
  filename_rel = path.relative src_path, filename_abs
  #if options.target_jspm and filename_rel.endsWith('.ls')
  #  filename_rel = filename_rel.replace(/\.ls$/, '.js')
  filename_rel = filename_rel.replace(/\.ls$/, '').replace(/\.js$/, '')
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
  if not filename_abs?
    return ''
  filename_rel = path.relative src_path, filename_abs
  output = []
  #output.push "import_dom_modules(require('html!#{relative_path}'))"
  deps_file = filename_rel.replace(/\.html$/, '.deps.js')
  #if options.target_jspm
  #  deps_file = filename_rel.replace(/\.html$/, '.jspm.js')
  #else
  #  deps_file = filename_rel.replace(/\.html$/, '.deps.js')
  output.push "require('#{deps_file}')"
  return output.join "\n"

generated_during_this_run = {}

export generate_dependencies_for_all_files_in_src_path = ->
  generated_during_this_run := {}
  for filename in glob.sync(src_path + '/**/*.html')
    if not options.bower and filename.indexOf('/bower_components/') != -1
      continue
    if not options.jspm and filename.indexOf('/jspm_packages/') != -1
      continue
    if not options.node_modules_custom and filename.indexOf('/node_modules_custom/') != -1
      continue
    generate_dependencies_for_file_recursive(filename)
  return

export generate_dependencies_for_file = (filename_abs) ->
  generated_during_this_run := {}
  generate_dependencies_for_file_recursive(filename_abs)

file_contents_cached = {}

output_file_contents_cached = {}

generate_dependencies_for_file_recursive = (filename_abs) ->
  if options.target_jspm
    outfile_abs = filename_abs.replace(/\.html/, '.jspm.js')
  else
    outfile_abs = filename_abs.replace(/\.html/, '.deps.js')
  if generated_during_this_run[outfile_abs]
    return
  generated_during_this_run[outfile_abs] = true
  if (not options.tostdout) and fs.existsSync(outfile_abs)
    if not options.regenerate
      return
    fs.unlinkSync(outfile_abs)
  if options.verbose
    console.log "generating: #{outfile_abs}"
  filename_rel = path.relative src_path, filename_abs
  filepath_rel = path.resolve filename_rel, '..'
  filepath_abs = path.resolve filename_abs, '..'
  cached_contents = file_contents_cached[filename_abs]
  current_contents = null
  if fs.existsSync(filename_abs)
    current_contents = fs.readFileSync(filename_abs, 'utf-8')
  if current_contents == cached_contents
    return
  file_contents_cached[filename_abs] = current_contents
  $ = cheerio.load(current_contents)
  params = {filepath_rel, filepath_abs, filename_abs, $}
  output = []
  dependencies = []
  output.push '// this file was generated by scripts/generate_polymer_dependencies'
  output.push '// do not edit this file directly'
  output.push '// instead, edit the corresponding .html file and re-run the script'
  output.push "const {import_dom_modules} = require('libs_frontend/dom_utils')"
  for tag in $('link[rel="import"]')
    if options.verbose
      if tag.type == 'css'
        console.log 'has css import via html imports: ' + filename_abs
    dependency_file = get_html_import_abspath(tag, params)
    if not dependency_file?
      console.log "html import does not exist for #{filename_abs}"
      continue
    dependencies.push dependency_file
    output.push html_import_deps(tag, params)
  if options.target_jspm
    output.push "import_dom_modules(require('#{filename_rel}!text'), '#{filename_rel}')"
  else if options.html_require_prefix
    output.push "import_dom_modules(require('html!#{filename_rel}'), '#{filename_rel}')"
  else
    output.push "import_dom_modules(require('#{filename_rel}'), '#{filename_rel}')"
  for tag in $('link[rel="stylesheet"]')
    if options.verbose
      console.log 'has stylesheet: ' + filename_abs
  if options.verbose
    for tag in $('style')
      if not tag.parentNode?
        console.log 'has style with no dom-module parent: ' + filename_abs
      if tag.parentNode?
        console.log tag.parentNode.name
      #if tag.parentNode.nodeName != 'DOM-MODULE'
      #  console.log 'has style with no dom-module parent: ' + filename_abs
  for tag in $('script')
    output.push script_deps(tag, params)
  output = output.join("\n").split("\n").filter(-> it.length > 0).join("\n") + "\n"
  if options.tostdout
    console.log output
    return
  cached_output = output_file_contents_cached[outfile_abs]
  if (not cached_output?) and fs.existsSync(outfile_abs)
    cached_output = fs.readFileSync outfile_abs, 'utf-8'
    output_file_contents_cached[outfile_abs] = cached_output
  if cached_output != output
    output_file_contents_cached[outfile_abs] = output
    fs.writeFileSync outfile_abs, output
    if options.recursive
      for dep in dependencies
        generate_dependencies_for_file_recursive(dep)
  return
