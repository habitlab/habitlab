{
  send_message_to_background
} = require 'libs_frontend/content_script_utils'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

export getvar = (key, callback) ->
  send_message_to_background 'getvar', key, callback

export setvar = (key, val, callback) ->
  send_message_to_background 'setvar', {key, val}, callback

export addtovar = (key, val, callback) ->
  send_message_to_background 'addtovar', {key, val}, callback

export getkey_dictdict = (name, key, key2, callback) ->
  send_message_to_background 'getkey_dictdict', {name, key, key2}, callback

export addtolist = (name, val, callback) ->
  send_message_to_background 'addtolist', {name, val}, callback

export getlist = (name, callback) ->
  send_message_to_background 'getlist', name, callback

export clearlist = (name, callback) ->
  send_message_to_background 'clearlist', name, callback

gexport_module 'db_utils', -> eval(it)
