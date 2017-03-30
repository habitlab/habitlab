{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

{
  get_latest_habitlab_version
  run_check_for_update_if_needed
} = require 'libs_backend/habitlab_update_utils'

{
  localstorage_getbool
} = require 'libs_common/localstorage_utils'

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
    installable_update_version: {
      type: String
      value: localStorage.extension_update_available_version ? ''
    }
    is_update_installable: {
      type: Boolean
      computed: 'compute_is_update_installable(installable_update_version, current_version)'
    }
    available_update_version: {
      type: String
      value: ''
    }
    is_update_available: {
      type: Boolean
      computed: 'compute_is_update_installable(available_update_version, current_version)'
    }
    have_checked_for_updates: {
      type: Boolean
      value: false
    }
    check_for_updates_button_text: {
      type: String
      value: 'Check for updates now'
    }
    is_update_available_or_installable: {
      type: Boolean
      computed: 'compute_is_update_available_or_installable(is_update_available, is_update_installable)'
    }
    autocheck: {
      type: Boolean
      value: localstorage_getbool('allow_logging')
    }
  }
  compute_is_update_available_or_installable: (is_update_available, is_update_installable) ->
    return is_update_available or is_update_installable
  compute_is_update_installable: (installable_update_version, current_version) ->
    return (typeof(installable_update_version) == 'string') and installable_update_version.length > 0 and semver.valid(installable_update_version) and semver.gt(installable_update_version, current_version)
  install_update_now: ->
    localStorage.habitlab_open_url_on_next_start = 'https://habitlab.github.io/to?q=options'
    chrome.runtime.reload()
    chrome.runtime.restart()
  check_for_updates_now: ->>
    self = this
    self.check_for_updates_button_text = 'Checking for updates'
    self.available_update_version = await get_latest_habitlab_version()
    self.have_checked_for_updates = true
    self.check_for_updates_button_text = 'Check for updates now'
    if self.available_update_version? and semver.valid(self.available_update_version) and semver.gt(self.available_update_version, self.current_version)
      run_check_for_update_if_needed()
  ready: ->
    self = this
    display_update_info = ->
      if localStorage.extension_update_available_version?
        self.installable_update_version = localStorage.extension_update_available_version
    setInterval display_update_info, 1000
    setTimeout ->
      if self.autocheck
        self.check_for_updates_now()
    , 0
}
