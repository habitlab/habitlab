{
  inject_into_feed
} = require 'libs_frontend/facebook_feed_injection'

{
  wrap_in_shadow
} = require 'libs_frontend/common_libs'

$ = require 'jquery'

require 'components/feed-item-timer-polymer.deps'

component_generator = (numitems) ->
  feed-item = $('<feed-item-timer-polymer>')
  feed-item.attr('items', window.itemsseen)
  return wrap_in_shadow(feed-item)

inject_into_feed(component_generator)

window.on_intervention_disabled = ->
  $('feed-item-timer-polymer').remove()
  window.feed_injection_active = false
  clearInterval(window.firststartprocess)
