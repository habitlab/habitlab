window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'
window.feed_injection_active = true

{
  inject_into_feed
} = require 'libs_frontend/facebook_utils'

{
  wrap_in_shadow,
  append_to_body_shadow
} = require 'libs_frontend/frontend_libs'

$ = require 'jquery'
require('jquery.isinview')($)
require('jquery-inview')($)

require_component 'duolingo-lesson-widget'

duolingo-lesson = $('<duolingo-lesson-widget></duolingo-lesson-widget>')
duolingo-lesson-div = $(append_to_body_shadow(duolingo-lesson, {
  zIndex: 0,
  position: 'absolute',
  width: '500px'
}))
duolingo-lesson.css('visibility', 'hidden')
duolingo-lesson.css('width', '100%')
duolingo-lesson[0].style.setProperty('--lesson-container-width', '500px')

$current-injected-div = null

reposition-lesson = ->
  if $current-injected-div?
    offset = $current-injected-div.offset()
    duolingo-lesson-div.offset(offset)

$(window).resize ->
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(reposition-lesson, 100)


# $current-injected-div = $('<div>')
# $(window).scroll ->
#   if $current-injected-div?
#     offset = $current-injected-div.offset()
#     console.log(offset)
#     duolingo-lesson-div.offset(offset)
#     #.style.left = offset.left
#     #duolingo-lesson-div.style.top = offset.top

component_generator = (numitems) ->
  feed-item = $('<div class="duolingo-lesson-container" style="height: 645px; width: 500px; position: relative;"></div>')
  feed-item.attr('items', window.itemsseen)
  view-trigger-top = $('<div style="width: 1px; height: 1px">')
  feed-item.append(view-trigger-top)
  view-trigger-top.on('inview', (event, isInView) ->
    $placeholder = $(this).parent()
    console.log 'In view: ' + isInView
    if isInView && window.feed_injection_active
      offset = $placeholder.offset()
      duolingo-lesson-div.offset(offset)
      $current-injected-div := $placeholder
      duolingo-lesson.css('visibility', 'visible')
    # else
    #   duolingo-lesson.css('visibility', 'hidden')
  )

  view-trigger-bottom = $('<div style="width: 1px; height: 1px; position: absolute; top: 99%">')
  feed-item.append(view-trigger-bottom)
  view-trigger-bottom.on('inview', (event, isInView) ->
    $placeholder = $(this).parent()
    console.log 'In view: ' + isInView
    if isInView && window.feed_injection_active
      offset = $placeholder.offset()
      duolingo-lesson-div.offset(offset)
      $current-injected-div := $placeholder
      duolingo-lesson.css('visibility', 'visible')
    # else
    #   duolingo-lesson.css('visibility', 'hidden')
  )
  # feed-item.on('inview', (event, isInView) ->
  #   if !isInView
  #     duolingo-lesson.css('visibility', 'hidden')

  return feed-item
  #return wrap_in_shadow(feed-item)

inject_into_feed(component_generator)

window.on_intervention_disabled = ->
  $('duolingo-lesson-widget').remove()
  window.feed_injection_active = false
  clearInterval(window.firststartprocess)

window.debugeval = -> eval(it)