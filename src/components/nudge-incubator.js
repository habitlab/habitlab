const {
  localstorage_getbool,
  localstorage_setbool
} = require('libs_common/localstorage_utils');

const {
  log_pageclick
} = require('libs_backend/log_utils');

Polymer({
  is: 'nudge-incubator',
  open_nudge_incubator: function() {
    chrome.tabs.create({url: 'https://www.reddit.com/r/habitlab/'});
    log_pageclick({from: 'settings', tab: 'settings', to: 'https://www.reddit.com/r/habitlab/'});
  }
})
