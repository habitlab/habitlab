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
    devmode: {
      type: String
      value: not chrome.runtime.getManifest().update_url?
    }
    unofficial: {
      type: String
      value: do ->
        chrome_manifest = chrome.runtime.getManifest()
        if not chrome_manifest.update_url?
          return false # devmode
        if chrome_manifest.version == 'obghclocpdgcekcognpkblghkedcpdgd' or chrome_manifest.version == 'bleifeoekkfhicamkpadfoclfhfmmina'
          return false # official or preview
        return true
    }
    preview: {
      type: String
      value: do ->
        value: do ->
        chrome_manifest = chrome.runtime.getManifest()
        if not chrome_manifest.update_url?
          return false # devmode
        return chrome_manifest.version == 'bleifeoekkfhicamkpadfoclfhfmmina'
    }
    official: {
      type: String
      value: do ->
        chrome_manifest = chrome.runtime.getManifest()
        if not chrome_manifest.update_url?
          return false # devmode
        return chrome_manifest.version == 'obghclocpdgcekcognpkblghkedcpdgd' or chrome_manifest.version == 'bleifeoekkfhicamkpadfoclfhfmmina'
    }
    available_update_version: {
      type: String
      value: localStorage.extension_update_available_version ? ''
    }
    is_update_available: {
      type: Boolean
      computed: 'compute_is_update_available(available_update_version)'
    }
  }
  compute_is_update_available: (available_update_version) ->
    return (typeof(available_update_version) == 'string') and available_update_version.length > 0
  install_update_now: ->
    localStorage.habitlab_open_url_on_next_start = 'https://habitlab.github.io/to?q=options'
    chrome.runtime.reload()
    chrome.runtime.restart()
  check_for_update_if_needed: ->
    if this.devmode
      return
    last_time_update_checked = localStorage.getItem('habitlab_last_time_checked_for_updates')
    if last_time_update_checked?
      last_time_update_checked = parseInt(last_time_update_checked)
    else
      last_time_update_checked = 0
    current_time = Date.now()
    if last_time_update_checked + 1000*60*15 > current_time # within the past 15 minutes
      return
    localStorage.setItem('habitlab_last_time_checked_for_updates', current_time)
    chrome.runtime.requestUpdateCheck (status, details) ->
      return
  ready: ->
    self = this
    display_update_info = ->
      if localStorage.extension_update_available_version?
        self.available_update_version = localStorage.extension_update_available_version
    setInterval display_update_info, 1000
    self.check_for_update_if_needed()
    /*
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
    */
}
