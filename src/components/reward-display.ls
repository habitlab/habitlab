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
    autoplay: {
      type: Boolean
      value: false
    }
  }
  autoplay_changed: ->
    if this.autoplay
      this.play()
  play: ->
    this.style.opacity = 1
    this.style.display = 'block'
    this.$$('#playgif').play()
}
