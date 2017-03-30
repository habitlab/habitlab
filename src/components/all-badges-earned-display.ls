{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

{
  get_all_badges_earned_for_minutes_saved
} = require 'libs_common/badges_utils'

{
  get_time_saved_total
} = require 'libs_common/gamification_utils'

polymer_ext {
  is: 'all-badges-earned-display'
  properties: {
    badges: {
      type: Array
    }
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
    minutes_saved: {
      type: Number
    }
  }
  ready: ->>
    time_saved = await get_time_saved_total()
    minutes_saved = time_saved / 60
    if this.minutes_saved?
      minutes_saved = this.minutes_saved
    this.badges = get_all_badges_earned_for_minutes_saved(minutes_saved)
  isdemo_changed: (isdemo) ->
    if isdemo
      this.minutes_saved = 300
}

