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

listen_for_eval ((x) -> eval(x))
insert_console ((x) -> eval(x)), {lang: 'livescript'}


window.scrolling_allowed = true

setTimeout ->
  window.scrolling_allowed = false
, 5000

window.onwheel = (evt) ->
  return window.scrolling_allowed

/*
$(window).scroll (evt) ->
  console.log 'wikipedia is scrolling'
  console.log evt
  $(this).scrollTop(0)
  evt.preventDefault()
  evt.stopPropagation()
  #evt.originalEvent.preventDefault()
  return false
*/