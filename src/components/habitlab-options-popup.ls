{polymer_ext} = require 'libs_frontend/polymer_utils'
{cfy} = require 'cfy'

{
  set_intervention_disabled_permanently
} = require 'libs_common/intervention_utils'

intervention = require('libs_common/intervention_info').get_intervention()

polymer_ext {
  is: 'habitlab-options-popup'
  properties: {
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
    intervention: {
      type: String
      value: if intervention? then intervention.name else ''
    }
    intervention_description: {
      type: String
      value: if intervention? then intervention.description else ''
    }
    goal_descriptions: {
      type: String,
      value: if intervention? then (intervention.goals.map((.description)).join(', ')) else ''
    }
  }
  isdemo_changed: ->
    if this.isdemo
      this.open()
  ready: ->
    console.log 'habitlab-options-popup ready'
  open: ->
    this.$$('#intervention_info_dialog').open()
  disable_temp_callback: ->
    this.$$('#intervention_info_dialog').close()
    self = this
    this.fire('disable_intervention')

    console.log "disabled #{self.intervention}"
    swal {
      title: 'Disabled!'
      text: 'This intervention will be disabled temporarily.'
    }
  disable_perm_callback: ->
    this.$$('#intervention_info_dialog').close()
    self = this
    this.fire('disable_intervention')

    set_intervention_disabled_permanently(this.intervention, ->
      console.log "disabled #{self.intervention}"
      swal('Disabled!', 'This intervention will be disabled permanently.')
    )
}

