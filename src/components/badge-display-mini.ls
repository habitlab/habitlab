{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

{
  get_minutes_saved_to_badges
} = require 'libs_common/badges_utils'

{
  get_intervention
} = require 'libs_common/intervention_info'

polymer_ext {
  is: 'badge-display-mini'
  docs: 'A boilerplate for badges earned through HabitLab'
  properties: {
    minutes_saved: {
      type: Number
    }
    badge_details: {
      type: Object
      computed: 'compute_badge_details(minutes_saved)'
    }
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
  }
  isdemo_changed: (isdemo) ->
    if isdemo
      this.minutes_saved = 15
  compute_badge_details: (minutes_saved) ->
    minutes_saved_to_badges = get_minutes_saved_to_badges()
    return minutes_saved_to_badges[minutes_saved]
  play: ->
    return
}
