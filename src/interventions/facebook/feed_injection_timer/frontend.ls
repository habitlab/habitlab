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
require 'components/feed-item-timer-polymer'

component_generator = ->
  console.log $('<feed-item-timer-polymer>')
  return $('<feed-item-timer-polymer>')

inject_into_feed(component_generator)
