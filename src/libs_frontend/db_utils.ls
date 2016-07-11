{
  send_message_to_background
} = require 'libs_frontend/content_script_utils'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{cfy} = require 'cfy'

export getvar = cfy (key) ->*
  yield send_message_to_background 'getvar', key

export setvar = cfy (key, val) ->*
  yield send_message_to_background 'setvar', {key, val}

export addtovar = cfy (key, val) ->*
  yield send_message_to_background 'addtovar', {key, val}

export getkey_dictdict = cfy (name, key, key2) ->*
  yield send_message_to_background 'getkey_dictdict', {name, key, key2}

export addtolist = cfy (name, val) ->*
  yield send_message_to_background 'addtolist', {name, val}

export getlist = cfy (name) ->*
  yield send_message_to_background 'getlist', name

export clearlist = cfy (name) ->*
  yield send_message_to_background 'clearlist', name

gexport_module 'db_utils', -> eval(it)
