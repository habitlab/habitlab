/**
 * Closes the selected tab
 * @return {Promise.<undefined>} No return value, promise resolves once tab is closed
 */
async function close_selected_tab() {
  let tabs = await new Promise(function(cb) {
    chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, cb)
  })
  if (tabs[0] != null) {
    chrome.tabs.remove(tabs[0].id)
  }
  return
}

/**
* Closes the tab with the specified tab id
* @param {number} tab_id - The id of the tab
*/
async function close_tab_with_id(tab_id) {
  chrome.tabs.remove(tab_id)
  return
}

/**
* Opens the specified URL in a new tab
* @param {string} url - The URL we want to open in a new tab
*/
async function open_url_in_new_tab(url) {
  let tab = await new Promise(function(cb) {
    chrome.tabs.create({url: url}, cb)
  })
  return
}

/**
* Gets the tab id for the selected tab
* @return {Promise.<number>} The id of the selected tab
*/
async function get_selected_tab_id() {
  let tabs = await new Promise(function(cb) {
    chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, cb)
  })
  if (tabs[0] != null) {
    return tabs[0].id
  }
  return
}

module.exports = {
  close_selected_tab,
  close_tab_with_id,
  open_url_in_new_tab,
  get_selected_tab_id,
}