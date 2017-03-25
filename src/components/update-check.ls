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
    can_update_now: {
      type: Boolean
      value: localStorage.extension_update_available_version?
    }
    devmode: {
      type: String
      value: not chrome.runtime.getManifest().update_url?
    }
  }
  apply_update_now: ->
    if localStorage.extension_update_available_version?
      localStorage.habitlab_open_url_on_next_start = 'https://habitlab.github.io/to?q=update'
      chrome.runtime.reload()
      chrome.runtime.restart()
      setTimeout ->
        window.location.reload()
      , 3000
  ready: ->
    self = this
    display_update_info = ->
      if localStorage.extension_update_available_version?
        self.can_update_now = true
      self.apply_update_now()
    setInterval display_update_info, 1000
    chrome.runtime.onUpdateAvailable.addListener (details) ->
      chrome.runtime.reload()
      chrome.runtime.restart()
      setTimeout ->
        window.location.reload()
      , 3000
    
    chrome.runtime.requestUpdateCheck (status, details) ->
      self.update_status = status
      if status == 'throttled'
        return
        #self.detailed_info = 'Your check to update was throttled, please check again later'
      if status == 'no_update'
        self.detailed_info = 'No update is available, you are running the latest version'
      if status == 'update_available'
        self.
        self.detailed_info = 'An update is available. Latest version is ' + details.version ' - it is being downloaded and installed, please wait'
}
