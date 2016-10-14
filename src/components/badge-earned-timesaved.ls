{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

$ = require 'jquery'

{
  cfy
} = require 'cfy'

{
  get_minutes_saved_to_badges
} = require 'libs_common/badges_utils'

{
  get_intervention
} = require 'libs_common/intervention_info'

polymer_ext {
  is: 'badge-earned-timesaved'
  properties: {
    minutes_saved: {
      type: Number
      value: 15
    }
    badge_details: {
      type: Object
      computed: 'compute_badge_details(minutes_saved)'
    }
  }
  compute_badge_details: (minutes_saved) ->
    minutes_saved_to_badges = get_minutes_saved_to_badges()
    return minutes_saved_to_badges[minutes_saved]
  play: ->
    console.log 'play called on badge-earned-timesaved'
}
