Polymer({
  is: 'introduction-view', 
  ready: function() {
    console.log('introduction view loaded')
  },
  get_url: function() {
    return chrome.extension.getURL('icons/icon_38.png');
  }
})