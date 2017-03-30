{polymer_ext} = require 'libs_frontend/polymer_utils'
{cfy} = require 'cfy'

swal = require 'sweetalert2'

{
  load_css_file
} = require 'libs_common/content_script_utils'

{
  set_intervention_disabled
  set_intervention_disabled_permanently
} = require 'libs_common/intervention_utils'

{
  disable_habitlab
} = require 'libs_common/disable_habitlab_utils'

{
  open_url_in_new_tab
} = require 'libs_common/tab_utils'

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
      type: String
      value: if intervention? then (intervention.goals.map((.description)).join(', ')) else ''
    }
    screenshot: {
      type: String
    }
    other: {
      type: Object
      value: {}
    }
  }
  isdemo_changed: ->
    if this.isdemo
      this.open()
  ready: ->>
    await load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
  open: ->
    this.$$('#intervention_info_dialog').open()
  disable_temp_callback: ->
    this.$$('#intervention_info_dialog').close()
    self = this
    this.fire('disable_intervention')

    swal {
      title: 'Disabled!'
      text: 'This intervention will be disabled temporarily.'
    }
  disable_perm_callback: ->
    this.$$('#intervention_info_dialog').close()
    self = this
    this.fire('disable_intervention')

    set_intervention_disabled_permanently(this.intervention, ->
      swal('Disabled!', 'This intervention will be disabled permanently.')
    )
  disable_habitlab_callback: ->
    this.$$('#intervention_info_dialog').close()
    disable_habitlab()
    swal {
      title: 'HabitLab Disabled!',
      text: 'HabitLab will not deploy interventions for the rest of today.'
    }
  open_interventions_page: ->
    open_url_in_new_tab('options.html#interventions')
    this.$$('#intervention_info_dialog').close()
  open_feedback_form: ->>
    feedback_form = document.createElement('feedback-form')
    feedback_form.screenshot = this.screenshot
    feedback_form.other = this.other
    this.$$('#intervention_info_dialog').close()
    document.body.appendChild(feedback_form)
    feedback_form.open()
}

