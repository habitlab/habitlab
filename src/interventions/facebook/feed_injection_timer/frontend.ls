<- (-> it!)

if window.facebook_feed_injection_timer
  return
window.facebook_feed_injection_timer = true

{
  inject_into_feed
} = require 'libs_frontend/facebook_feed_injection'

$ = require 'jquery'

require 'enable-webcomponents-in-content-scripts'
require 'components_skate/feed-item-timer'

component_generator = ->
  return $('<feed-item-timer>')

inject_into_feed(component_generator)
