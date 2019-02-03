const {
  get_intervention, 
} = require('libs_common/intervention_info')

Polymer({
  is: 'goal-gauger',
  doc: `Tell you how many days in a row you've met your goal of saving X amount of time on site and reset the goal`,
  properties: {
    time: {
      type: Number,
      value: 5 // default start time for slider
    },
    setting_icon : {
      type : String,
      value : (function() {
        return chrome.extension.getURL('icons/settings_icon.png');
      })()
    },
    logo : {
      type : String,
      value : (function() {
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

  update_goal : function() {
    console.log('update goal clicked !')
  }
});