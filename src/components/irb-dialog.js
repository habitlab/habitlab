const {
  start_syncing_all_data,
  stop_syncing_all_data
} = require('libs_backend/log_sync_utils')

const {
  send_logging_enabled,
  send_logging_disabled
} = require('libs_backend/logging_enabled_utils')

const {
  log_pagenav
} = require('libs_backend/log_utils')

Polymer({
  is: 'irb-dialog',
  properties: {
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed'
    },
    shown_in_context: {
      type: String,
      value: 'default'
    },
    allow_logging: {
      type: Boolean,
      value: (function() {
        let stored_value = localStorage.getItem('allow_logging')
        if (stored_value != null)
          return stored_value == 'true'
        return true
      })(),
      observer: 'allow_logging_changed'
    },
    geza_meoaddr: {
      type: String,
      value: [['gko', 'vacs'].join(''), ['stan', 'ford', '.', 'edu'].join('')].join('@')
    }
  },
  accept_clicked: function() {
    localStorage.setItem('irb_accepted', true)
    if (localStorage.getItem('allow_logging') == null) { // user is accepting the default
      localStorage.setItem('allow_logging_on_default_with_onboarding', true)
      localStorage.setItem('allow_logging', true)
      send_logging_enabled({page: 'onboarding', manual: false, allow_logging_on_default_with_onboarding: true})
      start_syncing_all_data()
    }
    log_pagenav({from: 'irb', to: this.shown_in_context, reason: 'irb-accepted'})
    this.close()
  },
  allow_logging_changed: function(allow_logging, prev_value_allow_logging) {
    if (prev_value_allow_logging == null)
      return // was initializing
    if (allow_logging == null)
      return
    let send_change = true
    let prev_allow_logging = localStorage.getItem('allow_logging')
    if (prev_allow_logging != null) {
      prev_allow_logging = (prev_allow_logging == 'true')
      if (prev_allow_logging == allow_logging) // no change
        send_change = false
    }
    localStorage.setItem('allow_logging', allow_logging)
    if (allow_logging) {
      if (send_change)
        send_logging_enabled({page: 'onboarding', manual: true})
      start_syncing_all_data()
    } else {
      if (send_change)
        send_logging_disabled({page: 'onboarding', manual: true})
      stop_syncing_all_data()
    }
    this.fire('allow-logging-changed', {allow_logging: allow_logging})
  },
  open: function() {
    this.$.irb_dialog.open()
  },
  close: function() {
    this.$.irb_dialog.close()
    this.fire('irb-dialog-closed', {})
  },
  open_if_needed: function() {
    if (localStorage.getItem('allow_logging') == null && localStorage.getItem('irb_accepted') != 'true')
      this.open()
  },
  isdemo_changed: function(isdemo) {
    if (isdemo) {
      this.open()
    }
  },
})
