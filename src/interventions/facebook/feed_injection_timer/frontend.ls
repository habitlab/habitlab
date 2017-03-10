window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

{
  log_impression,
  log_action,
} = require 'libs_common/log_utils'

{
  inject_into_feed
} = require 'libs_frontend/facebook_feed_injection'

{
  wrap_in_shadow
} = require 'libs_frontend/common_libs'

$ = require 'jquery'

require 'enable-webcomponents-in-content-scripts'
require 'components/feed-item-timer-polymer.deps'

component_generator = (numitems) ->
  log_impression intervention.name
  feed-item = $('<feed-item-timer-polymer>')
  feed-item.attr('items', window.itemsseen)
  return wrap_in_shadow(feed-item)

inject_into_feed(component_generator)

document.body.addEventListener 'disable_intervention', (evt) ->
  $('feed-item-timer-polymer').remove()
  window.active = false
  clearInterval(window.firststartprocess)

window.debugeval = -> eval(it)



