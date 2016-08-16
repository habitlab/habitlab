<- (-> it!)

if window.wikipedia_scroll_blocker
  return
window.wikipedia_scroll_blocker = true


console.log 'scroll_blocker injected'

$ = require 'jquery'

console.log 'scroll_blocker loaded'

require('enable-webcomponents-in-content-scripts')

require('components_skate/scroll-block-display-example')

$ = require 'jquery'

window.scrolling_allowed = true

window.onwheel = (evt) ->
  return window.scrolling_allowed

scroll_block_display = $('<scroll-block-display-example>')
$('body').append(scroll_block_display)

enable_scrolling_and_hide_scroll_block = ->
  window.scrolling_allowed = true
  scroll_block_display.hide()

disable_scrolling_and_show_scroll_block = ->
  window.scrolling_allowed = false
  scroll_block_display.show()

enable_scrolling_and_hide_scroll_block()
setTimeout disable_scrolling_and_show_scroll_block, 5000

# when the scroll block display fires the continue_scrolling event, hide it and enable scrolling for 5 seconds
scroll_block_display[0].addEventListener 'continue_scrolling', ->
  console.log 'got continue_scrolling event'
  enable_scrolling_and_hide_scroll_block()
  setTimeout disable_scrolling_and_show_scroll_block, 5000
