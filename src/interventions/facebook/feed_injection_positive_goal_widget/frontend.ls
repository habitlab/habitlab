window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

{
  inject_into_feed
} = require 'libs_frontend/facebook_utils'

{
  wrap_in_shadow
} = require 'libs_frontend/frontend_libs'

$ = require 'jquery'

require 'enable-webcomponents-in-content-scripts'
require 'components/positive-site-trigger-v2.deps'

component_generator = (numitems) ->
  feed-item = $('<positive-site-trigger-v2>')
  feed-item.get(0).style.setProperty('--trigger-border-style', '')
  feed-item.get(0).style.setProperty('--trigger-font-family', "San Francisco")
  feed-item.get(0).style.setProperty('--trigger-bg-color', '#ffffff')

  return wrap_in_shadow(feed-item)

inject_into_feed(component_generator)

window.on_intervention_disabled = ->
  $('positive-goal-trigger-v2').remove()
  window.feed_injection_active = false
  clearInterval(window.firststartprocess)

window.debugeval = -> eval(it)



