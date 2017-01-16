{cfy, yfy} = require 'cfy'

export close_selected_tab = cfy ->*
  chrome_tabs_query = yfy(chrome.tabs.query)
  tabs = yield chrome_tabs_query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT})
  if tabs[0]?
    chrome.tabs.remove(tabs[0].id)
  return

export close_tab_with_id = cfy (tab_id) ->*
  chrome.tabs.remove(tab_id)
  return

export open_url_in_new_tab = cfy (url) ->*
  tab = yield yfy(chrome.tabs.create) {url: url}
  return

export get_selected_tab_id = cfy ->*
  chrome_tabs_query = yfy(chrome.tabs.query)
  tabs = yield chrome_tabs_query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT})
  if tabs[0]?
    return tabs[0].id
  return