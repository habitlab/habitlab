#!/usr/bin/env lsc

require! {
  fs
  cheerio
  process
  path
}

filename = process.argv[2]
console.log process.argv
src_path = path.resolve process.argv[1], '../../src'
console.log src_path
input_file_path = path.resolve filename, '..'
console.log input_file_path

$ = cheerio.load(fs.readFileSync(filename, 'utf-8'))



for x in $('link[rel="import"]')
  import_path = $(x).attr('href')
  console.log import_path
  absolute_import_path = path.resolve input_file_path, import_path
  relative_path = path.relative src_path, absolute_import_path
  console.log relative_path
