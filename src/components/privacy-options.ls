{
  start_syncing_all_data
  stop_syncing_all_data
  send_logging_enabled
  send_logging_disabled
} = require 'libs_backend/log_sync_utils'

{
  localstorage_getbool
  localstorage_setbool
} = require 'libs_common/localstorage_utils'

Polymer {
  is: 'privacy-options'
  properties: {
    allow_logging: {
      type: Boolean
      value: do ->
        stored_value = localStorage.getItem('allow_logging')
        if stored_value?
          return stored_value == 'true'
        return false
      observer: 'allow_logging_changed'
    }
  }
  rerender: ->
    this.allow_logging = do ->
      stored_value = localStorage.getItem('allow_logging')
      if stored_value?
        return stored_value == 'true'
      return true
  allow_logging_changed: (allow_logging) ->
    no_change = false
    prev_allow_logging = localStorage.getItem('allow_logging')
    if prev_allow_logging?
      prev_allow_logging = (prev_allow_logging == 'true')
      if prev_allow_logging == allow_logging # no change
        no_change = true
    localstorage_setbool('allow_logging', allow_logging)
    if allow_logging
      if not no_change
        send_logging_enabled({page: 'settings'})
      start_syncing_all_data()
    else
      if not no_change
        send_logging_disabled({page: 'settings'})
      stop_syncing_all_data()
}
