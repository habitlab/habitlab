{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'intervention-view-single'
  properties: {
    intervention: {
      type: Object
      notify: true
    }
  }
  intervention_changed: (evt) ->
    checked = evt.target.checked
    intervention_name = evt.target.intervention.name
    if checked
      set_intervention_enabled intervention_name
    else
      set_intervention_disabled intervention_name
  automatically_managed_changed: (evt) ->
    checked = evt.target.checked
    intervention_name = evt.target.intervention.name
    if checked
      set_intervention_automatically_managed intervention_name
    else
      set_intervention_manually_managed intervention_name
}
