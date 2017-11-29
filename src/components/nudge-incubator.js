const {
  localstorage_getbool,
  localstorage_setbool
} = require('libs_common/localstorage_utils');

Polymer({
  is: 'nudge-incubator',
  open_nudge_incubator: function() {
    chrome.tabs.create({url: 'https://www.reddit.com/r/habitlab/'});
  }
})
