Polymer({
  is: 'habitlab-logo-polymer',
  clicked: function() {
    console.log('habitlab-logo-polymer clicked');
  },
  buttonclicked: function() {
    console.log('habitlab-logo-polymer paper-button clicked');
  },
  ready: function() {
    console.log('habitlab-logo-polymer ready');
  },
  get_url: function() {
    console.log('url called')
    console.log(chrome.extension.getURL('icons/icon_38.png'));
    return chrome.extension.getURL('icons/icon_38.png');
  },
});

