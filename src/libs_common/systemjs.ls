if not window.SystemJS
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
  require '../../jspm.config.js'
  #if not chrome.windows? # is not content script
  #  require '../../jspm_config_frontend.js'
  #else
  #  require '../../jspm_config_backend.js'
