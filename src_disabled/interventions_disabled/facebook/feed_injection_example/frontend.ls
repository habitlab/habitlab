<- (-> it!)

if window.facebook_feed_injection_example
  return
window.facebook_feed_injection_example = true

{
  inject_into_feed
} = require 'libs_frontend/facebook_feed_injection'

$ = require 'jquery'

require 'enable-webcomponents-in-content-scripts'
require 'components_skate/feed-item-example'

component_generator = ->
  return $('<feed-item-example>')

inject_into_feed(component_generator)
