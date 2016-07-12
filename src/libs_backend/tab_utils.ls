{cfy, yfy} = require 'cfy'

export close_selected_tab = cfy ->*
  tab = yield yfy(chrome.tabs.getSelected)()
  chrome.tabs.remove(tab.id)
  return
