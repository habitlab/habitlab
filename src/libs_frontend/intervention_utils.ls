{
  send_message_to_background
} = require 'libs_frontend/content_script_utils'

export set_intervention_enabled = (name, callback) ->
  send_message_to_background 'set_intervention_enabled', name, callback

export set_intervention_disabled = (name, callback) ->
  send_message_to_background 'set_intervention_disabled', name, callback
