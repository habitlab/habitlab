#!/usr/bin/env node

let fs = require('fs')

let filename_to_contents = {}
let files_list = [];
for (let filename of fs.readdirSync('rules')) {
  if (!filename.endsWith('.js')) {
  	continue
  }
  files_list.push(filename);
}
//for (let filename of files_list) {
//  let contents = fs.readFileSync('rules/' + filename, 'utf-8')
//  filename_to_contents[filename] = contents
//}

let output_rules_filenames = `module.exports = ${JSON.stringify(files_list)};`

//let output_rules_data = `module.exports = ${JSON.stringify(filename_to_contents)};`
let output_rules_all_list = []
output_rules_all_list.push('module.exports = {\n')
for (let filename of files_list) {
  let filename_base = filename.replace(/\.js$/, '')
  output_rules_all_list.push("'" + filename_base + '\': require(\'./rules/' + filename + '\'),\n')
}
output_rules_all_list.push('};')

fs.writeFileSync('rules_filenames.js', output_rules_filenames)
fs.writeFileSync('rules_all_requires.js', output_rules_all_list.join(''))
//fs.writeFileSync('rules_data.js', output_rules_data)
