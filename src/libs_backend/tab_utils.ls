/**
 * Closes the selected tab
 */
export close_selected_tab = ->>
  tabs = await new Promise -> chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, it)
  if tabs[0]?
    chrome.tabs.remove(tabs[0].id)
  return

/**
 * Closes the tab with the specified tab id
 * @param {number} tab_id - The id of the tab
 */
export close_tab_with_id = (tab_id) ->>
  chrome.tabs.remove(tab_id)
  return

/**
 * Opens the specified URL in a new tab
 * @param {string} url - The URL we want to open in a new tab
 */
export open_url_in_new_tab = (url) ->>
  tab = await new Promise -> chrome.tabs.create {url: url}, it
  return

/**
 * Gets the tab id for the selected tab
 * @return {Promise.<number>} The id of the selected tab
 */
export get_selected_tab_id = ->>
  tabs = await new Promise -> chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, it)
  if tabs[0]?
    return tabs[0].id
  return