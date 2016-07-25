<- (-> it!)

if window.facebook_scroll_blocker
  return
window.facebook_scroll_blocker = true

console.log 'scroll_blocker injected'

{
  listen_for_eval
  insert_console
} = require 'libs_frontend/content_script_debug'

{
  log_impression
  log_action
} = require 'libs_common/log_utils'

$ = require 'jquery'


require('enable-webcomponents-in-content-scripts')
#require('components_skate/fb-scroll-block-display')
require('components/fb-scroll-block-display.deps')

window.scrolling_allowed = true
nscrolls = 0
NSCROLLS_THRESHOLD = intervention.params.scrollevents.value
disabled = false

window.onwheel = (evt) ->
  if !disabled
    nscrolls := nscrolls+1
    if nscrolls % NSCROLLS_THRESHOLD == 0
      disable_scrolling_and_show_scroll_block()
    return window.scrolling_allowed



enable_scrolling_and_hide_scroll_block = ->
  
  window.scrolling_allowed = true
  $("body").css('overflow', 'scroll')
  scroll_block_display.hide()



disable_scrolling_and_show_scroll_block = ->
  log_impression intervention.name
  window.scrolling_allowed = false
  $("body").css('overflow', 'hidden')
  scroll_block_display.show()
  document.body.addEventListener('keydown', block_arrows)
    

block_arrows = (e) ->
  console.log 'trying out key blocked'
  if (e.keyCode == 38) or (e.keyCode == 40)
    console.log 'key blocked'
    return false

scroll_block_display = $('<fb-scroll-block-display intervention="facebook/scroll_blocker" --width="10px" --height="10px" onclick="this.clicked()">')
$('body').append(scroll_block_display)

enable_scrolling_and_hide_scroll_block!
disable_scrolling_and_show_scroll_block!


# when the scroll block display fires the continue_scrolling event, hide it and enable scrolling for 5 seconds
scroll_block_display[0].addEventListener 'continue_scrolling', ->
  
  log_action 'facebook/scroll_blocker', {'negative':'Remained on Facebook.'}
  console.log 'got continue_scrolling event'
  nscrolls := 0
  enable_scrolling_and_hide_scroll_block!

scroll_block_display[0].addEventListener 'disable_intervention' ->
  console.log 'intervention disabled inside the frontend'
  console.log scroll_block_display
  enable_scrolling_and_hide_scroll_block!
  $(scroll_block_display).remove()
  disabled := true
  console.log 'intervention disabled'

# these insert the debugging console at the bottom-right
listen_for_eval ((x) -> eval(x))
if intervention.params.debug.value
  insert_console ((x) -> eval(x)), {lang: 'livescript'}
