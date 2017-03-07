{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

$ = require 'jquery'

{
  cfy
} = require 'cfy'

{
  close_tab_with_id
  get_selected_tab_id
} = require 'libs_common/tab_utils'

{
  get_intervention
} = require 'libs_common/intervention_info'

polymer_ext {
  is: 'reward-display-playgif'
  properties: {
    img_url: {
      type: String
    }
    query: {
      type: String
      value: 'good job'
      observer: 'query_changed'
    }
    autoplay: {
      type: Boolean
      value: false
      observer: 'autoplay_changed'
    }
    seconds_saved: {
      type: Number
      value: 120
    }
    times_intervention_used: {
      type: Number
      value: 0
    }
    stars_to_display: {
      type: Number
      computed: 'compute_stars_to_display(times_intervention_used)'
    }
    times_used_until_level_up: {
      type: Number
      computed: 'compute_times_used_until_level_up(times_intervention_used)'
    }
    time_saved_message: {
      type: String
      computed: 'compute_time_saved_message(seconds_saved)'
    }
    no_autoclose: {
      type: Boolean
    }
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
    intervention_name: {
      type: String
      value: get_intervention().displayname
    }
    is_intervention_mastered: {
      type: Boolean
      computed: 'compute_is_intervention_mastered(times_intervention_used)'
    }
    tab_id: {
      type: Number
    }
  }
  compute_is_intervention_mastered: (times_intervention_used) ->
    return times_intervention_used >= 10
  isdemo_changed: (isdemo) ->
    if isdemo
      this.no_autoclose = true
      this.autoplay = true
  compute_stars_to_display: (times_intervention_used) ->
    return Math.min(10, times_intervention_used)
  compute_times_used_until_level_up: (times_intervention_used) ->
    return Math.max(0, 10 - times_intervention_used)
  autoplay_changed: ->
    if this.autoplay
      this.play()
  compute_time_saved_message: (seconds_saved) ->
    if seconds_saved < 60
      seconds_saved = Math.round(seconds_saved)
      if seconds_saved == 1
        return "1 second"
      return "#{seconds_saved} seconds"
    minutes_saved = Math.floor(seconds_saved / 60)
    if minutes_saved == 1
      return "1 minute"
    return "#{minutes_saved} minutes"
  ready: cfy ->*
    if tab_id?
      this.tab_id = tab_id
    else
      this.tab_id = yield get_selected_tab_id()
  play: cfy ->*
    console.log 'reward-display play called'
    self = this
    video = this.$$('#rewardvideo')
    this.style.display = 'block'
    this.style.opacity = 1
    video.style.display = 'block'
    video.style.opacity = 1
    if video.readyState == 4
      video.play()
    else
      video.oncanplay = ->
        video.oncanplay = null
        video.play()
    setTimeout ->
      if not video.paused
        if self.no_autoclose
          self.fire 'reward_done', {finished_playing: false}
        else
          close_tab_with_id(self.tab_id)
    , 2500
    #, 3000
  video_ended: ->
    console.log 'video_ended called'
    if this.no_autoclose
      this.fire 'reward_done', {finished_playing: true}
    else
      close_tab_with_id(this.tab_id)
  query_changed: cfy ->*
    results = yield $.get 'https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + this.query
    #results = yield $.get 'http://api.giphy.com/v1/gifs/translate?s=' + this.query + '&api_key=dc6zaTOxFJmzC'
    #console.log results
    #console.log results.data.image_url
    #this.img_url = results.data.image_url
    if results.data.image_mp4_url.startsWith('http:')
      results.data.image_mp4_url = results.data.image_mp4_url.replace(/^http:/, 'https:')
    this.video_url = results.data.image_mp4_url
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'is_not'
  ]
}
