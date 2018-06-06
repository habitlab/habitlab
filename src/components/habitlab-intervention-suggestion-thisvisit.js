const intervention = require('libs_common/intervention_info').get_intervention()

Polymer({
  is: 'habitlab-intervention-suggestion-thisvisit',
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
  ready: function() {
    /*
    let self = this
    //console.log('toast-test-widget ready')
    this.$.sample_toast.show()
    this.$.sample_toast_close_button.addEventListener('click', function() {
      self.$.sample_toast.hide()
    })
    */
    //show_toast('foobar')
  },
  show: function() {
    this.$$('#sample_toast').show()
  },
  ok_button_clicked: function() {
    this.$$('#sample_toast').hide()
    this.fire('intervention_suggestion_accepted', {})
  },
  no_button_clicked: function() {
    this.$$('#sample_toast').hide()
    this.fire('intervention_suggestion_rejected', {})
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
