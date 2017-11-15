const $ = require('jquery')

const {polymer_ext} = require('libs_frontend/polymer_utils')
const {close_selected_tab} = require('libs_frontend/tab_utils')

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

const {
  get_positive_enabled_uncompleted_goals,
} = require('libs_common/goal_utils')

Polymer({
  is: 'interstitial-screen-num-visits',
  doc: 'A screen that shows time spent on a site today, number of visits, and links to New York Times articles.',
  properties: {
    sitenamePrintable: {
      type: String,
    },
    btnTxt: {
      type: String, 
    },
    btnTxt2: {
      type: String, 
    },    
    minutes: {
      type: Number
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
    show_positive_site_trigger: {
      type: Boolean,
      value: false
    },
    show_progress_message: {
      type: Boolean,
      value: false,
      //computed: 'compute_progress_message()',
    },
    show_quote_message: {
      type: Boolean,
      value: true,
    }

  },

  listeners: {
    'disable_intervention': 'disableIntervention',
    'show_button': 'showButton'
  },
  compute_show_rss_message: function(show_positive_site_trigger, show_progress_message, show_quote_message, randomizer) {
    return !show_positive_site_trigger && !show_quote_message && (!show_progress_message) && randomizer
  },
  compute_show_workpages_message: function(show_positive_site_trigger, show_progress_message, show_quote_message, randomizer) {
    return !show_positive_site_trigger && !show_quote_message && !show_progress_message && !randomizer
  },
  //compute_show_progress_message: function() {
  //  return false
  //},
  buttonclicked: function() {
    log_action({'negative': 'Continued to site.'})
    $(this).hide()
  },
  hideButton: function() {
    this.$.okbutton.hidden = true
    //this.$.calltoactionbutton.hidden = true
    this.$.okbutton.style.display = 'none';
    //this.$.calltoactionbutton.style.display = 'none';
  },
  /// Show positive site trigger if there's an enabled goal
  compute_show_positive_site_trigger: async function() {
    let randomizer = Math.floor(Math.random()*2) == 0
    return randomizer
    
    // let positive_goals = await get_positive_enabled_uncompleted_goals()
    // console.log(positive_goals)
    // return (Object.keys(positive_goals).length > 0)
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
    //this.$.calltoactionbutton.hidden = false
    this.$.okbutton.style.style.display = 'inline-flex';
    this.$.calltoactionbutton.setProperty('--call-to-action-button-display', 'inline-flex');
  },
  ready: async function() {
    console.log('interstitial-polymer ready')
    this.$.okbutton.textContent = this.btnTxt
    this.$.calltoactionbutton.text = this.btnTxt2
    
    this.show_positive_site_trigger = await this.compute_show_positive_site_trigger()
    this.show_quote_message = !this.show_positive_site_trigger

    this.addEventListener('show_button', function() {
    })
    //this.visits = 5;
    //this.minutes = 8;
    //this.seconds = 9;

  },
  disableIntervention: function() {
    $(this).hide()
  },
  
  attributeChanged: function() {
    this.$.okbutton.textContent = this.btnTxt 
    this.$.calltoactionbutton.closeTabText = this.btnTxt2
    this.$.messagetext.textContent = this.messageText
  }
});

