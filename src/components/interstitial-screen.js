const $ = require('jquery')

const {polymer_ext} = require('libs_frontend/polymer_utils')
const {close_selected_tab} = require('libs_frontend/tab_utils')

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

Polymer({
  is: 'interstitial-screen',

  properties: {
    btnTxt: {
      type: String, 
    },
    btnTxt2: {
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
    },
    randomizer: {
      type: Boolean,
      value: Math.floor(Math.random()*2) == 0,
    },
    show_rss_message: {
      type: Boolean,
      computed: 'compute_show_rss_message(show_progress_message, randomizer)',
    },
    show_workpages_message: {
      type: Boolean,
      computed: 'compute_show_workpages_message(show_progress_message, randomizer)',
    },
    show_progress_message: {
      type: Boolean,
      value: false,
      //computed: 'compute_progress_message()',
    }
  },

  listeners: {
    'disable_intervention': 'disableIntervention',
    'show_button': 'showButton'
  },
  compute_show_rss_message: function(show_progress_message, randomizer) {
    return (!show_progress_message) && randomizer
  },
  compute_show_workpages_message: function(show_progress_message, randomizer) {
    return !show_progress_message && !randomizer
  },
  //compute_show_progress_message: function() {
  //  return false
  //},
  buttonclicked: function() {
    console.log('ok button clicked in polymer during loading')
    log_action({'negative': 'Continuted to site.'})
    $(this).hide()
  },
  hideButton: function() {
    console.log('button hidden')
    //$(this.$.okbutton).fadeOut("slow")
    this.$.okbutton.hidden = true
    //this.$.closetabbutton.hidden = true
    this.$.okbutton.style.display = 'none';
    //this.$.closetabbutton.style.display = 'none';
  },
  showProgress: function() {
    this.$.paperprogress.style.display = 'block';
  },
  incrementProgress: function() {
    this.$.paperprogress.value += 1;
  },
  setProgress: function(val) {
    this.$.paperprogress.value = val;
  },
  showButton: function() {
    console.log(this.$.okbutton)
    $(this.$.okbutton).fadeIn("slow")
    this.$.okbutton.hidden = false
    // this.$.closetabbutton.hidden = false
    this.$.okbutton.style.display = 'inline-flex';
    // this.$.closetabbutton.style.display = 'inline-flex';
  },
  ready: function() {
    console.log('interstitial-polymer ready')
    this.$.okbutton.textContent = this.btnTxt
    this.$.closetabbutton.text = this.btnTxt2
    this.$.titletext.textContent = this.titleText
    this.$.messagetext.textContent = this.messageText
    console.log(this.$.titletext.textContent)
    this.addEventListener('show_button', function() {
      console.log('hi')
    })
    
    //this.$.titletext.hidden = true
    // this.$.closetabbutton.hidden = true
    // var self = this
    // $(this.$.titletext).fadeIn().promise().then(function() {
    //   console.log('faded in title-text!')
    //   $(self.$.closetabbutton).fadeIn(5000, function() {
    //     console.log('faded in close-tab')
    //   })
    // })

    // this.$.paperprogress.hidden = true
    // this.$.paperprogress.style.display = 'none';
  },
  disableIntervention: function() {
    console.log('interstitial got callback')
    $(this).hide()
  },
  
  attributeChanged: function() {
    this.$.okbutton.textContent = this.btnTxt 
    this.$.closetabbutton.text = this.btnTxt2
    this.$.messagetext.textContent = this.messageText
    this.$.titletext.textContent = this.titleText
    console.log('attribute changed called')
  }
});

