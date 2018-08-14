const {
  record_intensity_level_for_intervention
} = require('libs_common/intervention_utils')

const {
  log_feedback
} = require('libs_frontend/intervention_log_utils')

Polymer({
  is: 'habitlab-intervention-feedback',
  properties: {
    time_spent_printable: {
      type: String,
      computed: 'compute_time_spent_printable(seconds_spent)',
    },
    intervention_info: {
      type: Object,
    },
    goal_info: {
      type: Object,
    },
    seconds_spent: {
      type: Number,
      value: 0,
    },
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed',
    },
    intervention_name: {
      type: String,
      //value: (intervention != null) ? intervention.displayname : ''
      computed: 'compute_intervention_name(intervention_info)'
    },
    intervention_description: {
      type: String,
      //value: (intervention != null) ? intervention.description : '',
      computed: 'compute_intervention_description(intervention_info)'
    },
    intervention_icon: {
      type: String,
      computed: 'compute_intervention_icon(intervention_info)'
    }
  },
  compute_intervention_name: function(intervention_info) {
    if (intervention_info != null) {
      return intervention_info.displayname
    }
    return ''
  },
  compute_intervention_description: function(intervention_info) {
    if (intervention_info != null) {
      return intervention_info.description
    }
    return ''
  },
  compute_time_spent_printable: function(seconds_spent) {
    return Math.round(seconds_spent / 60).toString() + ' minutes'
  },
  isdemo_changed: function() {
    if (this.isdemo) {
      this.show();
    }
  },
  too_intense_clicked: async function() {
    let generic_name = this.intervention_info.generic_intervention
    if (generic_name == null) {
      generic_name = this.intervention_info.name
    }
    record_intensity_level_for_intervention(this.intervention_info.name, generic_name, 'too_intense')
    this.close()
  },
  not_intense_clicked: async function() {
    let generic_name = this.intervention_info.generic_intervention
    if (generic_name == null) {
      generic_name = this.intervention_info.name
    }
    record_intensity_level_for_intervention(this.intervention_info.name, generic_name, 'not_intense')
    this.close()
  },
  just_right_clicked: async function() {
    let generic_name = this.intervention_info.generic_intervention
    if (generic_name == null) {
      generic_name = this.intervention_info.name
    }
    record_intensity_level_for_intervention(this.intervention_info.name, generic_name, 'just_right')
    this.close()
  },
  compute_intervention_icon: function(intervention_info) {
    let url_path
    if (intervention_info.generic_intervention != null)
      url_path = 'interventions/'+ intervention_info.generic_intervention + '/icon.svg'
    else {
      if (intervention_info.custom == true) {
        url_path = 'icons/custom_intervention_icon.svg'
      } else {
        url_path = 'interventions/'+ intervention_info.name + '/icon.svg'
      }
    }
    return (chrome.extension.getURL(url_path)).toString()
  },
  close: function() {
    this.$$('#sample_toast').hide()
  },
  show: function() {
    if (this.intervention_info == null) {
      this.intervention_info = require('libs_common/intervention_info').get_intervention();
    }
    this.$$('#sample_toast').show()
    let generic_name = this.intervention_info.generic_intervention
    if (generic_name == null) {
      generic_name = this.intervention_info.name
    }
    log_feedback({
      feedback_type: 'intensity_prompt_shown',
      generic_name: generic_name,
      intervention_name: this.intervention_info.name,
    })
  },
})
