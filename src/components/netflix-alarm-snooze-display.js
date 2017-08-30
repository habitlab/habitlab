const $ = require('jquery')
const moment = require('moment')

const {polymer_ext} = require('libs_frontend/polymer_utils')
const {close_selected_tab} = require('libs_frontend/tab_utils')

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

Polymer({
  is: 'netflix-alarm-snooze-display',

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
    exit_url:{
      type: String,
      value: chrome.extension.getURL('interventions/netflix/infinite_alarm/exit.png')
    },
    /*line_url:{
      type: String,
      value: chrome.extension.getURL('interventions/netflix/infinite_alarm/line.png')
    },*/
    logo_url:{
      type: String,
      value: chrome.extension.getURL('interventions/netflix/infinite_alarm/logo.png')
    },
    alarm_image_url: {
      type: String,
      value: chrome.extension.getURL('interventions/netflix/infinite_alarm/time_passed_clock.png')
    },
    bell_image_url: {
      type: String,
      value: chrome.extension.getURL('interventions/netflix/infinite_alarm/alarmbell.png')
    },
    show_netflix_message: {
      type: Boolean,
      computed: 'compute_show_workpages_message(show_progress_message, randomizer)',
    },
    show_progress_message: {
      type: Boolean,
      value: false,
      //computed: 'compute_progress_message()',
    },
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
  show_time_selector: function() {
    let dialog = document.createElement('time-selector-dialog');
    document.body.appendChild(dialog)
    dialog.show()
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
  showButton: function() {
    console.log(this.$.okbutton)
    this.$.okbutton.hidden = false
    //this.$.closetabbutton.hidden = false
    this.$.okbutton.style.display = 'inline-flex';
    this.$.closetabbutton.style.display = 'inline-flex';
  },
  ready: function() {
    console.log('interstitial-polymer ready')
    this.$.closetabbutton.text = this.btnTxt2
    //this.$.time_selector.value = moment().format('HH:mm')
    this.$.time_display.innerText = moment().format('hh:mm A')
  },
  disableIntervention: function() {
    console.log('interstitial got callback')
    $(this).hide()
  },
  snooze_button_clicked: function() {
    console.log('snooze button clicked')
    let ring_time_unix_time_milliseconds = moment().add(5, 'minutes').seconds(0).milliseconds(0).valueOf()
    this.fire('snooze_set', {ring_time: ring_time_unix_time_milliseconds})
  },
  
  attributeChanged: function() {
    this.$.okbutton.textContent = this.btnTxt 
    this.$.closetabbutton.text = this.btnTxt2
    this.$.messagetext.textContent = this.messageText
    this.$.titletext.textContent = this.titleText
  }
});



