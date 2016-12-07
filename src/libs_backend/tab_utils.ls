{cfy, yfy} = require 'cfy'

export close_selected_tab = cfy ->*
  tab = yield yfy(chrome.tabs.getSelected)()
  chrome.tabs.remove(tab.id)
  return

export close_tab_with_id = cfy (tab_id) ->*
  chrome.tabs.remove(tab_id)
  return

export open_url_in_new_tab = cfy (url) ->*
  tab = yield yfy(chrome.tabs.create) {url: url}
  return

export get_selected_tab_id = cfy ->*
  tab = yield yfy(chrome.tabs.getSelected)()
  return tab.id
