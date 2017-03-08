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
  close_tab_with_id
  get_selected_tab_id
} = require 'libs_common/tab_utils'

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
    seconds_saved: {
      type: Number
    }
    intervention_name: {
      type: String
      value: get_intervention().displayname
    }
    no_autoclose: {
      type: Boolean
    }
    tab_id: {
      type: Number
    }
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
  }
  isdemo_changed: (isdemo) ->
    if isdemo
      this.autoplay = true
      this.no_autoclose = true
  #autoplay_changed: ->
  #  if this.autoplay
  #    this.play()
  ready: cfy ->*
    if tab_id?
      this.tab_id = tab_id
    else
      this.tab_id = yield get_selected_tab_id()
  attached: cfy ->*
    if not this.seconds_saved?
      seconds_spent = (Date.now() - this.time_inserted) / 1000
      baseline_seconds_spent = yield baseline_time_per_session_for_domain(this.domain)
      this.seconds_saved = baseline_seconds_spent - seconds_spent
    this.$$('#playgif').times_intervention_used = yield get_num_times_intervention_used this.intervention_name
    if this.autoplay
      this.play()
  bring_parents_to_top: ->
    this.style.zIndex = Number.MAX_SAFE_INTEGER
    this.style.lineHeight = 1
    parent = this
    while parent?style?
      parent.style.zIndex = Number.MAX_SAFE_INTEGER - 1
      this.style.lineHeight = 1
      if parent.parentElement?
        parent = parent.parentElement
      else if parent?parentNode?host?
        parent = parent.parentNode.host
      else
        break
    return
  play: cfy ->*
    this.bring_parents_to_top()
    rewards_to_display = []
    if this.seconds_saved > 0
      rewards_to_display = yield record_seconds_saved_and_get_rewards this.seconds_saved, this.intervention_name, this.domain
      if rewards_to_display.length > 0
        this.$$('#showbadge').badges = rewards_to_display
        this.showbadge()
      else
        this.$$('#playgif').times_intervention_used += 1
        this.playgif()
    else
      if this.no_autoclose
        this.fire 'reward_done', {finished_playing: true}
      else
        close_tab_with_id(this.tab_id)
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
