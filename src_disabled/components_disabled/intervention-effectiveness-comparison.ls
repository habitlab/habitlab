{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

$ = require 'jquery'

{
  cfy
} = require 'cfy'

{
  get_intervention
} = require 'libs_common/intervention_info'

{
  get_intervention_info
} = require 'libs_common/intervention_utils'

polymer_ext {
  is: 'intervention-effectiveness-comparison'
  properties: {
    intervention_name: {
      type: String
      observer: 'intervention_name_changed'
    }
    intervention: {
      type: Object
      value: get_intervention()
    }
    goal: {
      type: Object
      computed: 'compute_goal(intervention)'
    }
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
  }
  isdemo_changed: (isdemo) ->
    if isdemo
      this.intervention_name = 'facebook/remove_news_feed'
  intervention_name_changed: cfy (intervention_name) ->*
    this.intervention = yield get_intervention_info(intervention_name)
  compute_goal: (intervention) ->
    if intervention.goals.length == 0
      return intervention.goals[0]
    return intervention.goals.filter(-> !it.name.startsWith('debug/'))[0]
  
  ready: ->
    console.log 'ready called in intervention-effectiveness-comparison'
}
