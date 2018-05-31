set_default_parameters({
  scrollevents: 750 # The amount of scroll events until the notification appears again
})

{
  log_action
} = require 'libs_frontend/intervention_log_utils'

{
  append_to_body_shadow
  once_body_available
  sleep
} = require 'libs_frontend/frontend_libs'

$= require 'jquery'
attr= require 'jquery'


require_component('fb-scroll-block-display')


window.scrolling_allowed = true
nscrolls = 0
NSCROLLS_THRESHOLD = parameters.scrollevents
keyIsDown = 0;

window.onwheel = (evt) ->
  if !window.intervention_disabled
    if !window.scrolling_allowed
      scroll_block_display.attr('clr', 'rgb(255, 102, 102);')
    nscrolls := nscrolls+1
    if nscrolls % NSCROLLS_THRESHOLD == 0
      disable_scrolling_and_show_scroll_block()
    return window.scrolling_allowed


changeColorBack = (e) -> 
  if (!window.scrolling_allowed)
      scroll_block_display.attr('clr', 'rgb(149, 203, 238);')   
    

window.setInterval(changeColorBack, 750)

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
  if (e.keyCode == 38) or (e.keyCode == 40)
    scroll_block_display.attr('clr', 'rgb(255, 102, 102);')
    keyIsDown = 1;
    console.log 'key blocked'
    return false

scroll_block_display = $('<fb-scroll-block-display clr="#95CBEE">')
shadow_div = null

enable_scrolling_and_hide_scroll_block()

# when the scroll block display fires the continue_scrolling event, hide it and enable scrolling for 5 seconds
scroll_block_display[0].addEventListener 'continue_scrolling', ->
  log_action {'negative':'Remained on Facebook.'}
  nscrolls := 0
  enable_scrolling_and_hide_scroll_block()

once_body_available ->
  disable_scrolling_and_show_scroll_block()
  shadow_div := append_to_body_shadow(scroll_block_display)

window.on_intervention_disabled = ->
  enable_scrolling_and_hide_scroll_block()
  $(shadow_div).remove()
