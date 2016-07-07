const $ = require('jquery');


Polymer({
  is: 'interstitial-screen-polymer',
  properties: {

  },
  buttonclicked: function() {
    console.log('ok button clicked in polymer');
  },
  ready: function() {
    console.log('interstitial-polymer ready');
  },
});

