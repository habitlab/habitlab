window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

if (typeof(window.wrap) != 'function')
  window.wrap = null

{
  log_action
} = require 'libs_frontend/intervention_log_utils'

{
  append_to_body_shadow
  once_body_available
} = require 'libs_frontend/common_libs'

$ = require 'jquery'


require('enable-webcomponents-in-content-scripts')
#require('components_skate/fb-scroll-block-display')
require('components/fb-scroll-block-display.deps')

window.scrolling_allowed = true
nscrolls = 0
NSCROLLS_THRESHOLD = intervention.params.scrollevents.value

window.onwheel = (evt) ->
  if !window.intervention_disabled
    nscrolls := nscrolls+1
    if nscrolls % NSCROLLS_THRESHOLD == 0
      disable_scrolling_and_show_scroll_block()
    return window.scrolling_allowed



enable_scrolling_and_hide_scroll_block = ->
  
  window.scrolling_allowed = true
  $("body").css('overflow', 'scroll')
  scroll_block_display.hide()



disable_scrolling_and_show_scroll_block = ->
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
shadow_div = null
once_body_available ->
  append_to_body_shadow(scroll_block_display)

enable_scrolling_and_hide_scroll_block!
disable_scrolling_and_show_scroll_block!


# when the scroll block display fires the continue_scrolling event, hide it and enable scrolling for 5 seconds
scroll_block_display[0].addEventListener 'continue_scrolling', ->
  log_action {'negative':'Remained on Facebook.'}
  nscrolls := 0
  enable_scrolling_and_hide_scroll_block!

window.on_intervention_disabled = ->
  enable_scrolling_and_hide_scroll_block()
  $(shadow_div).remove()

window.debugeval = -> eval(it)
