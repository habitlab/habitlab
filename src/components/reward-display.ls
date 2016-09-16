{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

$ = require 'jquery'

{
  cfy
} = require 'cfy'

polymer_ext {
  is: 'reward-display'
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
  }
  autoplay_changed: ->
    if this.autoplay
      this.play()
  play: ->
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
    #this.fire 'reward_done', {finished_playing: true}
  query_changed: cfy ->*
    results = yield $.get 'https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + this.query
    #results = yield $.get 'http://api.giphy.com/v1/gifs/translate?s=' + this.query + '&api_key=dc6zaTOxFJmzC'
    #console.log results
    #console.log results.data.image_url
    #this.img_url = results.data.image_url
    this.video_url = results.data.image_mp4_url
}
