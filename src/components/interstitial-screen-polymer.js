const $ = require('jquery')


const {polymer_ext} = require('libs_frontend/polymer_utils')



Polymer({
  is: 'interstitial-screen-polymer',

  properties: {
    btnTxt: {
      type: String, 
    },
    minutes: {
      type: Number
    },
    titleText: {
      type: String, 
    },
    visits: {
      type: Number
    },
    intervention: {
      type: String
    }

  },
  buttonclicked: function() {
    console.log('ok button clicked in polymer')
    $(this).hide()
  },
  ready: function() {
    console.log('interstitial-polymer ready')
    this.$.okbutton.textContent = this.btnTxt
    this.$.titletext.textContent = this.titleText
    console.log(this.$.titletext.textContent)

  },
});

