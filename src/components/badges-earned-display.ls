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
  is: 'badges-earned-display'
  properties: {
    badges: {
      type: Array
      value: []
    }
  }
  play: ->
    console.log 'play called on badges-earned-display'
  is_timesaved_badge: (badge) ->
    return badge.type == 'minutes_saved'
  is_intervention_mastered_badge: (badge) ->
    return badge.type == 'intervention_mastered'
  close_button_pressed: ->
    close_selected_tab()
}
