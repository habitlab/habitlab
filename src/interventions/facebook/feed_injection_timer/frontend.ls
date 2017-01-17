{
  log_impression,
  log_action,
} = require 'libs_common/log_utils'

{
  inject_into_feed
} = require 'libs_frontend/facebook_feed_injection'

$ = require 'jquery'

require 'enable-webcomponents-in-content-scripts'
require 'components/feed-item-timer-polymer.deps'

component_generator = (numitems) ->
  log_impression intervention.name
  
  feed-item = $('<feed-item-timer-polymer>')
  feed-item.attr('items', window.itemsseen)
  return feed-item


inject_into_feed(component_generator)


document.body.addEventListener 'disable_intervention', (evt) ->
  $('feed-item-timer-polymer').remove()
  console.log window.firststartprocess
  console.log window.active
  console.log \removed!
  window.active = false
  clearInterval(window.firststartprocess)

window.debugeval = -> eval(it)



