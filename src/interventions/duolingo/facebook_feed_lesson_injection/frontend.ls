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
require 'components/duolingo-lesson-widget.deps'

component_generator = (numitems) ->
  feed-item = $('<duolingo-lesson-widget></duolingo-lesson-widget>')
  feed-item.attr('items', window.itemsseen)
  return wrap_in_shadow(feed-item)

inject_into_feed(component_generator)

window.on_intervention_disabled = ->
  $('duolingo-lesson-widget').remove()
  window.feed_injection_active = false
  clearInterval(window.firststartprocess)

window.debugeval = -> eval(it)