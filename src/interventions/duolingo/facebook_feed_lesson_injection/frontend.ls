window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

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

$('.feedlearnquiz').inViewport()

require 'enable-webcomponents-in-content-scripts'
require 'components/duolingo-lesson-widget.deps'

duolingo-lesson = $('<duolingo-lesson-widget></duolingo-lesson-widget>')
duolingo-lesson-div = append_to_body_shadow(duolingo-lesson)
duolingo-lesson-div.attr('visibility', 'hidden')

$('.duolingo-lesson-container').on('inview', function(event, isInView) {
  if (isInView && window.feed_injection_active) {
    duolingo-lesson-div.attr('visibility', 'visible')
    let $this = $(this)
    $this.append(duolingo-lesson)
  }
})

component_generator = (numitems) ->
  feed-item = $('<div class="duolingo-lesson-container"></div>')
  feed-item.attr('items', window.itemsseen)
  return wrap_in_shadow(feed-item)

inject_into_feed(component_generator)

window.on_intervention_disabled = ->
  $('duolingo-lesson-widget').remove()
  window.feed_injection_active = false
  clearInterval(window.firststartprocess)

window.debugeval = -> eval(it)