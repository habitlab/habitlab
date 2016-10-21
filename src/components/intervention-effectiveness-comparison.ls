{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

$ = require 'jquery'

{
  cfy
} = require 'cfy'

{
  close_selected_tab
} = require 'libs_common/tab_utils'

{
  get_intervention
} = require 'libs_common/intervention_info'

polymer_ext {
  is: 'intervention-effectiveness-comparison'
  properties: {
    intervention_name: {
      type: String
    }
    intervention: {
      type: Object
      value: get_intervention()
    }
    goal: {
      type: Object
      computed: 'compute_goal(intervention)'
    }
  }
  compute_goal: (intervention) ->
    return intervention.goals[0]
  ready: ->
    console.log 'ready called in intervention-effectiveness-comparison'
}
