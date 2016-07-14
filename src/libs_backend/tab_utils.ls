{cfy, yfy} = require 'cfy'

export close_selected_tab = cfy ->*
  tab = yield yfy(chrome.tabs.getSelected)()
  chrome.tabs.remove(tab.id)
  return

export open_url_in_new_tab = cfy (url) ->*
  tab = yield yfy(chrome.tabs.create) {url: url}
  return
