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

{
  get_goals
} = require 'libs_common/goal_utils'

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
      observer: 'intervention_changed'
    }
    intervention_description: {
      type: String
      value: if intervention? then intervention.description else ''
    }
    goal_descriptions: {
      type: String
      #value: if intervention? then (intervention.goals.map((.description)).join(', ')) else ''
    }
    goal_name_to_info: {
      type: Object
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
  intervention_changed: ->>
    if not this.goal_name_to_info?
      this.goal_name_to_info = await get_goals()
    goal_name_to_info = this.goal_name_to_info
    goal_names = intervention.goals
    this.goal_descriptions = goal_names.map(-> goal_name_to_info[it]).map((.description)).join(', ')
  ready: ->>
    await load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
  open: ->
    this.$$('#intervention_info_dialog').open()
  disable_temp_callback: ->
    this.$$('#intervention_info_dialog').close()
    self = this
    this.fire('disable_intervention')

    swal {
      title: 'Turned Off!'
      text: 'This intervention will be turned off temporarily.'
    }
  disable_perm_callback: ->
    this.$$('#intervention_info_dialog').close()
    self = this
    this.fire('disable_intervention')

    set_intervention_disabled_permanently(this.intervention, ->
      swal('Turned Off!', 'This intervention will be turned off permanently.')
    )
  disable_habitlab_callback: ->
    this.$$('#intervention_info_dialog').close()
    disable_habitlab()
    swal {
      title: 'HabitLab Turned Off!',
      text: 'HabitLab will not show you interventions for the rest of today.'
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

