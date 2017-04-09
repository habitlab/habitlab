{exec} = require 'shelljs'
require! glob

output_list = []
for x in glob.sync 'inline_scripts/*'
  output_list.push exec('cat ' + x + ' | openssl dgst -sha256 -binary | openssl enc -base64').stdout.trim()
output_str = "content_security_policy: script-src 'self' 'unsafe-eval'"
for x in output_list
  output_str += " 'sha256-"
  output_str += x
  output_str += "'"
output_str += "; object-src 'self'"
console.log output_str
