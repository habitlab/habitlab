{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

$ = require 'jquery'

{
  cfy
} = require 'cfy'

{
  baseline_time_per_session_for_domain
  record_seconds_saved_and_get_rewards
} = require 'libs_common/gamification_utils'

{
  get_intervention
} = require 'libs_common/intervention_info'

polymer_ext {
  is: 'reward-display'
  properties: {
    autoplay: {
      type: Boolean
      value: false
      observer: 'autoplay_changed'
    }
    time_inserted: {
      type: Number
      value: Date.now()
    }
    domain: {
      type: String
      value: window.location.host
    }
    intervention_name: {
      type: String
      value: get_intervention().displayname
    }
  }
  autoplay_changed: ->
    if this.autoplay
      this.play()
  play: cfy ->*
    seconds_spent = (Date.now() - this.time_inserted) / 1000
    baseline_seconds_spent = yield baseline_time_per_session_for_domain(this.domain)
    seconds_saved = baseline_seconds_spent - seconds_spent
    this.$$('#playgif').seconds_saved = seconds_saved
    rewards_to_display = []
    if seconds_saved > 0
      rewards_to_display = yield record_seconds_saved_and_get_rewards seconds_saved, this.intervention_name, this.domain
    this.playgif()
  playgif: ->
    this.style.opacity = 1
    this.style.display = 'block'
    this.$$('#playgif').play()
}
