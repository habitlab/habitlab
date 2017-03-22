{
  start_syncing_all_data
  stop_syncing_all_data
} = require 'libs_backend/log_sync_utils'

{
  send_logging_enabled
  send_logging_disabled
} = require 'libs_backend/logging_enabled_utils'

Polymer {
  is: 'privacy-options'
  properties: {
    allow_logging: {
      type: Boolean
      value: do ->
        stored_value = localStorage.getItem('allow_logging')
        if stored_value?
          return stored_value == 'true'
        return true
      observer: 'allow_logging_changed'
    }
  }
  rerender: ->
    this.allow_logging = do ->
      stored_value = localStorage.getItem('allow_logging')
      if stored_value?
        return stored_value == 'true'
      return true
  allow_logging_changed: (allow_logging, prev_value_allow_logging) ->
    if not prev_value_allow_logging?
      return # was initializing
    if not allow_logging?
      return
    send_change = true
    prev_allow_logging = localStorage.getItem('allow_logging')
    if prev_allow_logging?
      prev_allow_logging = (prev_allow_logging == 'true')
      if prev_allow_logging == allow_logging # no change
        send_change = false
    localStorage.setItem('allow_logging', allow_logging)
    if allow_logging
      if send_change
        send_logging_enabled({page: 'settings', manual: true})
      start_syncing_all_data()
    else
      if send_change
        send_logging_disabled({page: 'settings', manual: true})
      stop_syncing_all_data()
}
