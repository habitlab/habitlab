{cfy, yfy} = require 'cfy'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  get_active_tab_info
  list_currently_loaded_interventions
  get_user_id
} = require 'libs_backend/background_common'

{
  get_goals
  get_enabled_goals
} = require 'libs_backend/goal_utils'

{
  get_interventions
  get_enabled_interventions
} = require 'libs_backend/intervention_utils'

{
  as_array
} = require 'libs_common/collection_utils'


export get_screenshot_as_base64 = ->>
  fetch('https://habitlab-reportbug.herokuapp.com/ping').then(-> it.text())
  data_url = await yfy(chrome.tabs.captureVisibleTab)(chrome.windows.WINDOW_ID_CURRENT, {})
  return data_url

export get_data_for_feedback = ->>
  data = {}
  data.background_url = window.location.href
  data.browser = navigator.userAgent
  data.language = navigator.language
  data.languages = navigator.languages
  data.extra = {}
  data.extra.user_id = await get_user_id()
  data.extra.tab_info = await get_active_tab_info()
  data.url = data.extra.tab_info.url
  data.loaded_interventions = await list_currently_loaded_interventions()
  data.extra.interventions = JSON.parse(JSON.stringify(await get_interventions()))
  data.extra.goals = JSON.parse(JSON.stringify(await get_goals()))
  for goal_name,goal_info of data.extra.goals
    if goal_info.icon?
      delete goal_info.icon
  data.enabled_interventions = as_array(await get_enabled_interventions())
  data.enabled_goals = as_array(await get_enabled_goals())
  data.extra.manifest = chrome.runtime.getManifest()
  data.devmode = not data.extra.manifest.update_url?
  data.version = data.extra.manifest.version
  data.chrome_runtime_id = chrome.runtime.id
  data.extra.client_timestamp = Date.now()
  data.extra.client_localtime = new Date().toString()
  return data

gexport_module 'screenshot_utils', -> eval(it)

