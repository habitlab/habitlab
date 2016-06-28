
console.log 'scroll_blocker injected'

$ = require 'jquery'

console.log 'scroll_blocker loaded'

scrolling_allowed = true

setTimeout ->
  scrolling_allowed := false
, 5000

window.onwheel = (evt) ->
  return scrolling_allowed

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