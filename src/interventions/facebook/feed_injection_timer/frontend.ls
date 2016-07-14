<- (-> it!)

if window.facebook_feed_injection_timer
  return
window.facebook_feed_injection_timer = true

{
  log_impression,
  log_action,
} = require 'libs_common/log_utils'

{
  inject_into_feed
} = require 'libs_frontend/facebook_feed_injection'

$ = require 'jquery'

require 'enable-webcomponents-in-content-scripts'
require 'components_skate/feed-item-timer'
require 'components/feed-item-timer-polymer.deps'

component_generator = ->
  log_impression intervention.name
  return $('<feed-item-timer-polymer>')

inject_into_feed(component_generator)

