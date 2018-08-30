const intervention = require('libs_common/intervention_info').get_intervention();

const {
  log_intervention_suggestion_action,
  log_impression,
} = require('libs_frontend/intervention_log_utils');

const {
  set_intervention_enabled,
  set_intervention_disabled,
} = require('libs_frontend/intervention_utils');

Polymer({
  is: 'habitlab-intervention-suggestion-thisvisit-optout',
  properties: {
    intervention_name: {
      type: String,
      value: (intervention != null) ? intervention.displayname : ''
    },
    intervention_description: {
      type: String,
      value: (intervention != null) ? intervention.description : '',
    },
    intervention_difficulty: {
      type: String,
      value: (intervention != null) ? intervention.difficulty : 'medium'
    },
    intervention_difficulty_printable: {
      type: String,
      computed: 'compute_intervention_difficulty_printable(intervention_difficulty)',
    },
    sitename: {
      type: String,
      value: (intervention != null) ? intervention.sitename_printable : '',
    },
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed',
    },
  },
  isdemo_changed: function() {
    if (this.isdemo) {
      this.show();
    }
  },
  compute_intervention_difficulty_printable: function(intervention_difficulty) {
    let output = 'Medium'
    switch (intervention_difficulty) {
      case 'easy':
        output = 'Easy';
        break
      case 'medium':
        output = 'Medium';
        break
      case 'hard':
        output = 'Hard';
        break
    }
    return output
  },
  show: async function() {
    this.$$('#sample_toast').show()
    await set_intervention_enabled(intervention.name)
    await log_impression({'suggestion': 'true', 'optout':'true'})
  },
  ok_button_clicked: async function() {
    this.$$('#sample_toast').hide();
    await log_impression({'suggestion': 'true', 'suggestion_optout':'true', 'ok_clicked':'true'})
  },
  //ok_button_clicked: async function() {
    //this.$$('#sample_toast').hide()
   // this.fire('intervention_suggestion_accepted', {})
  //},
  no_button_clicked: async function() {
    this.$$('#sample_toast').hide();
    this.fire('disable_intervention')
    await set_intervention_disabled(intervention.name)
    await log_intervention_suggestion_action({'action': 'rejected', 'accepted': 'false', 'optout':'false'})
  },
  get_intervention_icon_url: function() {
    let url_path
    if (intervention.generic_intervention != null)
      url_path = 'interventions/'+ intervention.generic_intervention + '/icon.svg'
    else {
      if (intervention.custom == true) {
        url_path = 'icons/custom_intervention_icon.svg'
      } else {
        url_path = 'interventions/'+ intervention.name + '/icon.svg'
      }
    }
    return (chrome.extension.getURL(url_path)).toString()
  }
})
