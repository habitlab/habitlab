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
    },
    messageText: {
      type: String
    }

  },

  listeners: {
    'disable_intervention': 'disableIntervention',
    'show_button': 'showButton'
  },
  buttonclicked: function() {
    console.log('ok button clicked in polymer during loadin')
    $(this).hide()
  },
  hideButton: function() {
    this.$.okbutton.hidden = true
  },
  showButton: function() {
    console.log(this.$.okbutton)
    this.$.okbutton.hidden = false
  },
  ready: function() {
    console.log('interstitial-polymer ready')
    this.$.okbutton.textContent = this.btnTxt
    this.$.titletext.textContent = this.titleText
    this.$.messagetext.textContent = this.messageText
    console.log(this.$.titletext.textContent)
    this.addEventListener('show_button', function() {
      console.log('hi')
    })

  },
  disableIntervention: function() {
    console.log('interstitial got callback')
    $(this).hide()
  },
  
  attributeChanged: function() {
    this.$.okbutton.textContent = this.btnTxt 
    this.$.messagetext.textContent = this.messageText
    this.$.titletext.textContent = this.titleText
    console.log(this.$.titletext.textContent)
  }
});

