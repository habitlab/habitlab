const {polymer_ext} = require('libs_frontend/polymer_utils');
const {get_intervention} = require('libs_common/intervention_info')

polymer_ext({
  is: 'habitlab-logo-v2',
  properties: {
    width: {
      type: String,
      value: '40px',
    },
    height: {
      type: String,
      value: '40px',
    },
    unclickable: {
      type: Boolean,
      value: false
    },
    intervention_name: {
      type: String,
      value: (function() {
        let intervention_info = get_intervention()
        return intervention_info.displayname
      })()
    },
    intervention_icon: {
      type: String,
      value: (function() {
        let intervention_info = get_intervention()
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
    var screenshot_utils = await SystemJS.import('libs_common/screenshot_utils');
    var screenshot = await screenshot_utils.get_screenshot_as_base64();
    var data = await screenshot_utils.get_data_for_feedback();
    const habitlab_options_popup = document.createElement('habitlab-options-popup');
    document.body.appendChild(habitlab_options_popup);
    habitlab_options_popup.screenshot = screenshot;
    habitlab_options_popup.other = data;
    habitlab_options_popup.open();
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
