const {
  show_toast
} = require('libs_frontend/toast_utils')

const intervention = require('libs_common/intervention_info').get_intervention()

Polymer({
  is: 'habitlab-intervention-first-seen-info',
  properties: {
    intervention_name: {
      type: String,
      value: (intervention != null) ? intervention.displayname : ''
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
