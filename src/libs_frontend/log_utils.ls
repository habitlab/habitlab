{
  send_message_to_background
} = require 'libs_frontend/content_script_utils'

export addtolog = (name, data, callback) ->
  send_message_to_background 'addtolog', {name, data}, callback

export getlog = (name, callback) ->
  send_message_to_background 'getlog', name, callback

export clearlog = (name, callback) ->
  send_message_to_background 'clearlog', name, callback
