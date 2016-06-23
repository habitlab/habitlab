{
  send_message_to_background
} = require 'libs_frontend/content_script_utils'

export getvar = (key, callback) ->
  send_message_to_background 'getvar', key, callback

export setvar = (key, val, callback) ->
  send_message_to_background 'setvar', {key, val}, callback

export addtovar = (key, val, callback) ->
  send_message_to_background 'addtovar', {key, val}, callback
