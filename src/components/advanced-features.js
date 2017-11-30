const {
  localstorage_getbool,
  localstorage_setbool
} = require('libs_common/localstorage_utils');

const {
  log_pageclick
} = require('libs_backend/log_utils');

Polymer({
  is: 'advanced-features',
  open_intervention_editor: function() {
    chrome.tabs.create({url: chrome.extension.getURL('index.html?tag=intervention-editor')});
    log_pageclick({from: 'settings', tab: 'settings', to: 'intervention-editor'});
    // chrome.tabs.create({url: chrome.extension.getURL('index.html?tag=intervention-editor-onboard')});
  }
})
