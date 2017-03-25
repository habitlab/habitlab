{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'update-check'
  properties: {
    update_status: {
      type: String
      value: 'checking'
    }
    current_version: {
      type: String
      value: chrome.runtime.getManifest().version
    }
    latest_version: {
      type: String
      value: 'checking'
    }
    devmode: {
      type: String
      value: not chrome.runtime.getManifest().update_url?
    }
  }
  ready: ->
    self = this
    chrome.runtime.onUpdateAvailable.addListener (details) ->
      chrome.runtime.reload()
      chrome.runtime.restart()
      setTimeout ->
        window.location.reload()
      , 3000
    chrome.runtime.requestUpdateCheck (status, details) ->
      self.update_status = status
      if status == 'throttled'
        self.detailed_info = 'Your check to update was throttled, please check again later'
      if status == 'no_update'
        self.detailed_info = 'No update is available, you are running the latest version'
      if status == 'update_available'
        self.detailed_info = 'An update is available. Latest version is ' + details.version ' - it is being downloaded and installed, please wait'
}