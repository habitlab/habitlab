#!/usr/bin/env lsc

# To compile this file and generate scripts/generate_polymer_dependencies
# npm install -g lscbin
# lscbin scripts/generate_polymer_dependencies.ls

require('livescript')

{
  set_src_path_from_argv
  set_options_from_argv
  get_options
  generate_dependencies_for_file
  generate_dependencies_for_all_files_in_src_path
} = require('./generate_polymer_dependencies_lib.ls')

do ->
  set_src_path_from_argv()
  set_options_from_argv()
  filename = get_options()['_'][0] # first positional argument
  if filename?
    filename = path.resolve(filename)
    generate_dependencies_for_file(filename)
    return
  else
    generate_dependencies_for_all_files_in_src_path()
