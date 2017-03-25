{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

{
  check_if_update_available_and_run_update
} = require 'libs_backend/habitlab_update_utils'

require! {
  cfy
  semver
}

polymer_ext {
  is: 'update-check'
  properties: {
    current_version: {
      type: String
      value: chrome.runtime.getManifest().version
    }
    devmode: {
      type: Boolean
      value: not chrome.runtime.getManifest().update_url?
    }
    unofficial: {
      type: Boolean
      value: do ->
        if not chrome.runtime.getManifest().update_url?
          return false # devmode
        if chrome.runtime.id == 'obghclocpdgcekcognpkblghkedcpdgd' or chrome.runtime.id == 'bleifeoekkfhicamkpadfoclfhfmmina'
          return false # official or preview
        return true
    }
    preview: {
      type: Boolean
      value: do ->
        value: do ->
        if not chrome.runtime.getManifest().update_url?
          return false # devmode
        return chrome.runtime.id == 'bleifeoekkfhicamkpadfoclfhfmmina'
    }
    official: {
      type: Boolean
      value: do ->
        if not chrome.runtime.getManifest().update_url?
          return false # devmode
        return chrome.runtime.id == 'obghclocpdgcekcognpkblghkedcpdgd' or chrome.runtime.id == 'bleifeoekkfhicamkpadfoclfhfmmina'
    }
    appid: {
      type: String
      value: chrome.runtime.id
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
  ready: ->
    self = this
    display_update_info = ->
      if localStorage.extension_update_available_version?
        self.available_update_version = localStorage.extension_update_available_version
    setInterval display_update_info, 1000
    check_if_update_available_and_run_update()
}
