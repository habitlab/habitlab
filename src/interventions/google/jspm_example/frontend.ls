console.log 'jspm example running'

{
  listen_for_eval
  insert_console
} = require 'libs_frontend/content_script_debug'

require 'script!jspm_packages/system.js'
SystemJS.config {
  defaultJSExtensions: true,
  baseURL: chrome.extension.getURL('/')
  browserConfig: {
    baseURL: chrome.extension.getURL('/')
    paths: {
      'npm:': chrome.extension.getURL "/jspm_packages/npm/"
    }
  }
}
require 'jspm_config'

listen_for_eval ((x) -> eval(x))
insert_console ((x) -> eval(x)), {lang: 'livescript'}
