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
  get_num_times_intervention_used
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
      #observer: 'autoplay_changed'
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
  #autoplay_changed: ->
  #  if this.autoplay
  #    this.play()
  ready: cfy ->*
    seconds_spent = (Date.now() - this.time_inserted) / 1000
    baseline_seconds_spent = yield baseline_time_per_session_for_domain(this.domain)
    seconds_saved = baseline_seconds_spent - seconds_spent
    this.seconds_saved = seconds_saved
    this.$$('#playgif').seconds_saved = seconds_saved
    this.$$('#playgif').times_intervention_used = yield get_num_times_intervention_used this.intervention_name
    if this.autoplay
      this.play()
  play: cfy ->*
    rewards_to_display = []
    if this.seconds_saved > 0
      rewards_to_display = yield record_seconds_saved_and_get_rewards this.seconds_saved, this.intervention_name, this.domain
      console.log 'rewards_to_display is'
      console.log rewards_to_display
      if rewards_to_display.length > 0
        this.$$('#showbadge').badges = rewards_to_display
        this.showbadge()
      else
        this.$$('#playgif').times_intervention_used += 1
        this.playgif()
  showbadge: ->
    this.$$('#showbadge').style.opacity = 1
    this.$$('#showbadge').style.display = 'block'
    this.style.opacity = 1
    this.style.display = 'block'
    this.$$('#showbadge').play()
  playgif: ->
    this.$$('#playgif').style.opacity = 1
    this.$$('#playgif').style.display = 'block'
    this.style.opacity = 1
    this.style.display = 'block'
    this.$$('#playgif').play()
}
