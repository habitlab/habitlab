const {
  get_intervention, 
} = require('libs_common/intervention_info')

Polymer({
  is: 'plan-police',
  doc: 'A screen that asks users to choose the difficulty of intervention they want this visit.',
  properties: {
    time: {
      type: Number,
      value: get_intervention().sitename_printable
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
  feedback_button_clicked: function(evt) {
    
  },
});