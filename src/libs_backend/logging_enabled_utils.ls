$ = require 'jquery'

{cfy} = require 'cfy'

{
  get_user_id
} = require 'libs_backend/background_common'

chrome_manifest = chrome.runtime.getManifest()
habitlab_version = chrome_manifest.version
developer_mode = not chrome_manifest.update_url?
unofficial_version = chrome.runtime.id != 'obghclocpdgcekcognpkblghkedcpdgd'

export get_basic_client_data = cfy ->*
  data = {}
  data.client_timestamp = Date.now()
  data.client_localtime = new Date().toString()
  data.user_id = yield get_user_id()
  data.browser = navigator.userAgent
  data.language = navigator.language
  data.languages = navigator.languages
  data.version = habitlab_version
  data.devmode = developer_mode
  data.chrome_runtime_id = chrome.runtime.id
  if unofficial_version
    data.unofficial_version = chrome.runtime.id
  return data

export send_logging_enabled = cfy (options) ->*
  options = options ? {}
  data = yield get_basic_client_data()
  data.logging_enabled = true
  for k,v of options
    data[k] = v
  $.ajax {
    type: 'POST'
    url: 'https://habitlab.herokuapp.com/add_logging_state'
    dataType: 'json'
    contentType: 'application/json'
    data: JSON.stringify(data)
  }

export send_logging_disabled = cfy (options) ->*
  options = options ? {}
  data = yield get_basic_client_data()
  data.logging_enabled = false
  for k,v of options
    data[k] = v
  $.ajax {
    type: 'POST'
    url: 'https://habitlab.herokuapp.com/add_logging_state'
    dataType: 'json'
    contentType: 'application/json'
    data: JSON.stringify(data)
  }
