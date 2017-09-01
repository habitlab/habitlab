window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

{
  inject_into_feed
} = require 'libs_frontend/facebook_utils'

{
  wrap_in_shadow
} = require 'libs_frontend/frontend_libs'

$ = require 'jquery'

require_component('positive-site-trigger-v2')

component_generator = (numitems) ->
  feed-item = $('<positive-site-trigger-v2>')
  feed-item.attr('in_facebook_news_feed', true)
  # feed-item.get(0).customStyle['--trigger-border-style'] = ''
  # feed-item.get(0).customStyle['--trigger-font-family'] = "San Francisco"
  # feed-item.get(0).customStyle['--trigger-bg-color'] = '#ffffff'

  # shadow = $('<div>')
  # shadow.css({
  #   "height": "1px", 
  #   "background-color": "\#1d2129", 
  #   "opacity": 0.2
  # })
  # gray-space = $('<div>')
  # gray-space.css({
  #   "background-color": "\#e9ebee", 
  #   "height": "12px", 
  #   "margin-left": "-1px", 
  #   "margin-right": "-1px"})

  # feed-item.append(shadow)
  # feed-item.append(gray-space)

  return wrap_in_shadow(feed-item)

inject_into_feed(component_generator, 0, 8)

window.on_intervention_disabled = ->
  $('positive-site-trigger-v2').remove()
  window.feed_injection_active = false
  clearInterval(window.firststartprocess)

window.debugeval = -> eval(it)



