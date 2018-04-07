const {polymer_ext} = require('libs_frontend/polymer_utils');
const {get_intervention} = require('libs_common/intervention_info')
const {intervention_feedback} = require('libs_common/intervention_feedback_utils')

const {
  add_log_interventions
} = require('libs_common/log_utils')

polymer_ext({
  is: 'habitlab-logo-v2',
  properties: {
    width: {
      type: String,
      value: '35px',
    },
    height: {
      type: String,
      value: '35px',
    },
    unclickable: {
      type: Boolean,
      value: false
    },
    intervention_name: {
      type: String,
      value: (function() {
        let intervention_info = get_intervention()
        if (intervention_info != null)
          return intervention_info.displayname
        else return ''
      })()
    },
    intervention_icon: {
      type: String,
      value: (function() {
        let intervention_info = get_intervention()
        if (intervention_info != null ){
          let intervention_name = intervention_info.name
          if (intervention_name == 'debug/fake_intervention') {
            return chrome.extension.getURL('interventions/custom/icon.svg') 
          }
          if (intervention_info.custom) {
            return chrome.extension.getURL('interventions/custom/icon.svg')
          }
          if (intervention_info.generic_intervention != null) {
            return chrome.extension.getURL('interventions/' + intervention_info.generic_intervention + '/icon.svg')
          }
          return chrome.extension.getURL('interventions/' + intervention_name + '/icon.svg')
        }
        else return ''
      })()
    }
  },
  get_img_style: function() {
    return `width: ${this.width}; height: ${this.height};`
  },
  ready: function() {
    if (this.unclickable) {
      this.style.cursor = "default";
    }
    SystemJS.import('libs_common/screenshot_utils');
  },
  habitlab_button_clicked: async function() {
    /*
    //var screenshot_utils = await SystemJS.import('libs_common/screenshot_utils');
    //var screenshot = await screenshot_utils.get_screenshot_as_base64();
    //var data = await screenshot_utils.get_data_for_feedback();
    const habitlab_options_popup = document.createElement('habitlab-reward-display-toast-voting');
    habitlab_options_popup.active_screen = 'permanently_disable'
    //habitlab_options_popup.screenshot = screenshot;
    document.body.appendChild(habitlab_options_popup);
    this.fire('disable_intervention')
    //console.log(habitlab_options_popup)
    //habitlab_options_popup.screenshot = screenshot;
    //habitlab_options_popup.other = data;
    //console.log(habitlab_options_popup)
    //console.log(habitlab_options_popup.show)
    habitlab_options_popup.show();
    */
    var screenshot_utils = require('libs_common/screenshot_utils');
    var screenshot = await screenshot_utils.get_screenshot_as_base64();
    var data = await screenshot_utils.get_data_for_feedback();
    const habitlab_options_popup = document.createElement('habitlab-options-popup-v2');
    document.body.appendChild(habitlab_options_popup);
    habitlab_options_popup.screenshot = screenshot;
    habitlab_options_popup.other = data;
    habitlab_options_popup.open();
    add_log_interventions({
      type: 'intervention_turn_off_settings_menu_opened',
      page: 'habitlab-logo-v2',
      subpage: 'habitlab-logo-v2',
      category: 'intervention_turnoffsettings',
      url: window.location.href,
      intervention_name: this.intervention_name
    })
  },
  get_url: function() {
    //return chrome.extension.getURL('icons/habitlab_gear_with_text.svg');
    return chrome.extension.getURL('icons/gear_white.svg');
  },
}, {
  source: require('libs_common/localization_utils'),
  methods: [
    'msg'
  ]
});
