const {
  intervention_first_seen_power_enabledisable,
  get_enabled_interventions,
} = require('libs_common/intervention_utils')

const intervention = require('libs_common/intervention_info').get_intervention()

Polymer({
  is: 'habitlab-intervention-first-seen-power',
  properties: {
    intervention_name: {
      type: String,
      value: (intervention != null) ? intervention.displayname : '',
    },
    intervention_description: {
      type: String,
      value: (intervention != null) ? intervention.description : '',
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
  ready: async function() {
    /*
    let self = this
    //console.log('toast-test-widget ready')
    this.$.sample_toast.show()
    this.$.sample_toast_close_button.addEventListener('click', function() {
      self.$.sample_toast.hide()
    })
    */
    let self = this
    this.$$('#sample_toast').show()
    // setTimeout(function() {
    //   const {
    //     //make_checkbox_clickable,
    //     make_togglebutton_clickable,
    //   } = require('libs_frontend/frontend_libs')
    //   // workaround since paper-checkbox seems to mysteriously not be checkable
    //   make_togglebutton_clickable(self.$$('#future_visits_checkbox'))
    //   //make_checkbox_clickable(self.$$('#future_visits_checkbox'))
    // }, 1000);
    let enabled_interventions = await get_enabled_interventions()
    if (enabled_interventions != null && enabled_interventions[intervention.name] != null && enabled_interventions[intervention.name] == false) {
      this.is_intervention_enabled = false
    }
    console.log('finished ready')
  },
  is_intervention_enabled_changed: async function(is_enabled, prev_value) {
    console.log('is_intervention_enabled_changed')
    if (prev_value == null) {
      return
    }
    if (is_enabled == prev_value) {
      return
    }
    if (intervention == null) {
      return
    }
    await intervention_first_seen_power_enabledisable(intervention, is_enabled, window.location.href)
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
