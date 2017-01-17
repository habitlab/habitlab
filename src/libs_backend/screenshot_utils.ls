{cfy, yfy} = require 'cfy'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

export get_screenshot_as_base64 = cfy ->*
  data_url = yield yfy(chrome.tabs.captureVisibleTab)(chrome.windows.WINDOW_ID_CURRENT, {})
  return data_url

gexport_module 'db_utils_backend', -> eval(it)

