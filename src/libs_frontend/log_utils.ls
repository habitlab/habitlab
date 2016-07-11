{
  send_message_to_background
} = require 'libs_frontend/content_script_utils'

{cfy} = require 'cfy'

export addtolog = cfy (name, data) ->*
  yield send_message_to_background 'addtolog', {name, data}

export getlog = cfy (name) ->*
  yield send_message_to_background 'getlog', name

export clearlog = cfy (name) ->*
  yield send_message_to_background 'clearlog', name
