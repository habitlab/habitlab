#!/usr/bin/env node

const fs = require('fs')

const folders = [
  'libs_frontend',
  'libs_backend',
  'libs_common',
  'interventions',
]

for (let folder of folders) {
  if (!fs.existsSync('src_gen')) {
    fs.mkdirSync('src_gen')
  }
  if (!fs.existsSync('src_gen/' + folder)) {
    fs.mkdirSync('src_gen/' + folder)
  }
  if (!fs.existsSync('node_modules/' + folder)) {
    fs.symlinkSync('../src_gen/' + folder, 'node_modules/' + folder, 'dir')
  }
}
