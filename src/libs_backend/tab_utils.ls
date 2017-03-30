{cfy, yfy} = require 'cfy'

export close_selected_tab = ->>
  chrome_tabs_query = yfy(chrome.tabs.query)
  tabs = await chrome_tabs_query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT})
  if tabs[0]?
    chrome.tabs.remove(tabs[0].id)
  return

export close_tab_with_id = (tab_id) ->>
  chrome.tabs.remove(tab_id)
  return

export open_url_in_new_tab = (url) ->>
  tab = await yfy(chrome.tabs.create) {url: url}
  return

export get_selected_tab_id = ->>
  chrome_tabs_query = yfy(chrome.tabs.query)
  tabs = await chrome_tabs_query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT})
  if tabs[0]?
    return tabs[0].id
  return