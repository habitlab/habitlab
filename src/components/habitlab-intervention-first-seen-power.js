const {
  show_toast
} = require('libs_frontend/toast_utils')

const intervention = require('libs_common/intervention_info').get_intervention()

Polymer({
  is: 'habitlab-intervention-first-seen-power',
  properties: {
    intervention_name: {
      type: String,
      value: (intervention != null) ? intervention.displayname : '',
    },
    sitename: {
      type: String,
      value: (intervention != null) ? intervention.sitename_printable : '',
    },
    is_intervention_enabled: {
      type: Boolean,
      value: true,
      observer: 'is_intervention_enabled_changed',
    }
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
   this.$$('#sample_toast').show()
    //show_toast('foobar')
  },
  is_intervention_enabled_changed: function(cur_value, prev_value) {
    if (prev_value == null) return
    if (cur_value == prev_value) return
    if (intervention == null) return
    let real_intervention_name = intervention_name
    if (intervention.generic_intervention != null) {
      real_intervention_name = intervention.generic_intervention
    }
    if (cur_value) { // enabled
      console.log('enabled')
      console.log(real_intervention_name)
    } else {
      console.log('disabled')
      console.log(real_intervention_name)
    }
  },
  ok_button_clicked: function() {
    this.$$('#sample_toast').hide()
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
