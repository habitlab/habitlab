<- (-> it!)

if window.facebook_scroll_blocker
  return
window.facebook_scroll_blocker = true

console.log 'scroll_blocker injected'

{
  listen_for_eval
  insert_console
} = require 'libs_frontend/content_script_debug'

$ = require 'jquery'


require('enable-webcomponents-in-content-scripts')
require('components_skate/fb-scroll-block-display')

window.scrolling_allowed = true
nscrolls = 0
NSCROLLS_THRESHOLD = 51

window.onwheel = (evt) ->
  nscrolls := nscrolls+1
  console.log nscrolls
  if nscrolls % NSCROLLS_THRESHOLD == 0
    disable_scrolling_and_show_scroll_block()
  return window.scrolling_allowed

scroll_block_display = $('<fb-scroll-block-display>')
$('body').append(scroll_block_display)

enable_scrolling_and_hide_scroll_block = ->
  window.scrolling_allowed = true
  scroll_block_display.hide()
  

disable_scrolling_and_show_scroll_block = ->
  window.scrolling_allowed = false
  scroll_block_display.show()
  


enable_scrolling_and_hide_scroll_block()
disable_scrolling_and_show_scroll_block()


# when the scroll block display fires the continue_scrolling event, hide it and enable scrolling for 5 seconds
scroll_block_display[0].addEventListener 'continue_scrolling', ->
  console.log 'got continue_scrolling event'
  nscrolls := 0
  enable_scrolling_and_hide_scroll_block()
  

# these insert the debugging console at the bottom-right
listen_for_eval ((x) -> eval(x))
insert_console ((x) -> eval(x)), {lang: 'livescript'}

