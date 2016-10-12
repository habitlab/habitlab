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
    time_saved_message: {
      type: String
      computed: 'compute_time_saved_message(seconds_saved)'
    }
    intervention_name: {
      type: String
      value: get_intervention().displayname
    }
  }
  autoplay_changed: ->
    if this.autoplay
      this.play()
  compute_time_saved_message: (seconds_saved) ->
    if seconds_saved < 60
      if seconds_saved == 1
        return "1 second"
      return "#{seconds_saved} seconds"
    minutes_saved = Math.floor(seconds_saved / 60)
    if minutes_saved == 1
      return "1 minute"
    return "#{minutes_saved} minutes"
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
        self.fire 'reward_done', {finished_playing: false}
    , 2500
    #, 3000
  video_ended: ->
    console.log 'video_ended called'
    this.fire 'reward_done', {finished_playing: true}
  query_changed: cfy ->*
    results = yield $.get 'https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + this.query
    #results = yield $.get 'http://api.giphy.com/v1/gifs/translate?s=' + this.query + '&api_key=dc6zaTOxFJmzC'
    #console.log results
    #console.log results.data.image_url
    #this.img_url = results.data.image_url
    this.video_url = results.data.image_mp4_url
}
