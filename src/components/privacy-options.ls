{
  start_syncing_all_data
  stop_syncing_all_data
} = require 'libs_backend/log_sync_utils'

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
  allow_logging_changed: ->
    localStorage.setItem('allow_logging', this.allow_logging)
    if this.allow_logging
      start_syncing_all_data()
    else
      stop_syncing_all_data()
}
