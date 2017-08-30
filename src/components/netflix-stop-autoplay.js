const $ = require('jquery')
const moment = require('moment')

const {polymer_ext} = require('libs_frontend/polymer_utils')
const {close_selected_tab} = require('libs_frontend/tab_utils')

const {
  url_to_domain
} = require('libs_common/domain_utils')

const {
  get_minutes_spent_on_domain_today,
  get_visits_to_domain_today
} = require('libs_common/time_spent_utils')

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

const {
  start_episode_tracker,
  get_num_episodes_watched
} = require('libs_frontend/netflix_utils')

Polymer({
  is: 'netflix-stop-autoplay',

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
    playings: {
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
      value: chrome.runtime.getURL('interventions/netflix/stop_autoplay/exit.png')
    },
    logo_url:{
      type: String,
      value: chrome.runtime.getURL('interventions/netflix/stop_autoplay/logo.png')
    },
    alarm_image_url: {
      type: String,
      value: chrome.runtime.getURL('interventions/netflix/stop_autoplay/alarm_clock.png')
    },
    show_netflix_message: {
      type: Boolean,
      computed: 'compute_show_workpages_message(show_progress_message, randomizer)',
    },
    show_rss_message: {
      type: Boolean,
      computed: 'compute_show_rss_message(show_progress_message, randomizer)',
    },
    show_progress_message: {
      type: Boolean,
      value: false,
      //computed: 'compute_progress_message()',
    },
    show_workpages_message: {
      type: Boolean,
      computed: 'compute_show_workpages_message(show_progress_message, randomizer)',
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
    console.log('video should continue')
    document.querySelector('video').play()
    $(this).remove()
    // console.log('video should now continue to play')    
    // document.querySelector('video').play()
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
    this.$.okbutton.hidden = false
    //this.$.closetabbutton.hidden = false
    this.$.okbutton.style.display = 'inline-flex';
    this.$.closetabbutton.style.display = 'inline-flex';
  },
  ready: async function() {
    this.$.closetabbutton.text = this.btnTxt2
    //this.$.time_selector.value = moment().format('HH:mm')
    this.$.time_display.innerText = moment().format('hh:mm A')
    let domain = url_to_domain(window.location.href)
    /*
    var self = this
    get_minutes_spent_on_domain_today(domain).then(function(minutes) {
      self.minutes = minutes
      something_else(minutes).then(function(y) {

      })
    })
    */
    this.minutes = await get_minutes_spent_on_domain_today(domain)
    start_episode_tracker()
    this.playings = get_num_episodes_watched()
  },
  disableIntervention: function() {
    $(this).remove()
  },
  
  attributeChanged: function() {
    this.$.okbutton.textContent = this.btnTxt 
    this.$.closetabbutton.text = this.btnTxt2
    this.$.messagetext.textContent = this.messageText
    this.$.titletext.textContent = this.titleText
  }
});

