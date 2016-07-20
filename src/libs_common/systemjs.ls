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
