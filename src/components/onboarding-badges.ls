{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

{
  get_all_badges_earned_for_minutes_saved
} = require 'libs_common/badges_utils'

{
  get_time_saved_total
} = require 'libs_common/gamification_utils'

Bounce = require('bounce.js')

polymer_ext {
  is: 'onboarding-badges'
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
    habby_url: {
      type: String,
      value: chrome.extension.getURL('icons/badges/habby.svg')      
    }
    sola_url: {
      type: String,
      value: chrome.extension.getURL('icons/badges/sola.svg')     
    }
    twinkl_url: {
      type: String,
      value: chrome.extension.getURL('icons/badges/twinkl.svg')     
    }
    logo_glow_url: {
      type: String,
      value: chrome.extension.getURL('icons/badges/habitlab_glow.svg')      
    }
    logo_glow_blend_url: {
      type: String,
      value: chrome.extension.getURL('icons/badges/glow_blend.svg')      
    }
    logo_glow_black_url: {
      type: String,
      value: chrome.extension.getURL('icons/badges/habitlab_glow_black.svg')     
    }
    logo_glow_black_bubbles: {
      type: String,
      value: chrome.extension.getURL('icons/badges/habitlab_glow_black_bubbles.svg')     
    }
    logo_offline_url: {
      type: String,
      value: chrome.extension.getURL('icons/badges/logo_offline.svg')     
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

