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


export get_screenshot_as_base64 = cfy ->*
  fetch('http://habitlab-reportbug.herokuapp.com/ping').then(-> it.text())
  data_url = yield yfy(chrome.tabs.captureVisibleTab)(chrome.windows.WINDOW_ID_CURRENT, {})
  return data_url

export get_data_for_feedback = cfy ->*
  data = {}
  data.background_url = window.location.href
  data.browser = navigator.userAgent
  data.extra = {}
  data.extra.user_id = yield get_user_id()
  data.extra.tab_info = yield get_active_tab_info()
  data.url = data.extra.tab_info.url
  data.loaded_interventions = yield list_currently_loaded_interventions()
  data.extra.interventions = JSON.parse(JSON.stringify(yield get_interventions()))
  for intervention_name,intervention_info of data.extra.interventions
    if intervention_info.goals?
      intervention_info.goal_names = intervention_info.goals.map (.name)
      delete intervention_info.goals
  data.extra.goals = JSON.parse(JSON.stringify(yield get_goals()))
  for goal_name,goal_info of data.extra.goals
    if goal_info.icon?
      delete goal_info.icon
  data.enabled_interventions = as_array(yield get_enabled_interventions())
  data.enabled_goals = as_array(yield get_enabled_goals())
  data.extra.manifest = yield chrome.runtime.getManifest()
  data.version = data.extra.manifest.version
  data.chrome_runtime_id = chrome.runtime.id
  data.extra.client_timestamp = Date.now()
  data.extra.client_localtime = new Date().toString()
  return data

gexport_module 'screenshot_utils', -> eval(it)

