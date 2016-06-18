#!/usr/bin/env node

const fs = require('fs')

const folders = [
  'libs_frontend',
  'libs_backend',
  'libs_common',
  'interventions',
]

const srcdir = 'src' // src_gen

for (let folder of folders) {
  if (!fs.existsSync(srcdir)) {
    fs.mkdirSync(srcdir)
  }
  if (!fs.existsSync(`${srcdir}/${folder}`)) {
    fs.mkdirSync(`${srcdir}/${folder}`)
  }
  if (!fs.existsSync('node_modules/' + folder)) {
    fs.symlinkSync(`../${srcdir}/${folder}`, `node_modules/${folder}`, 'dir')
  }
}
