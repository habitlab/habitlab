window.addEventListener "unhandledrejection", (evt) ->
  throw evt.reason

require 'webcomponentsjs-custom-element-v0'
require 'components/options-view.deps'

window.addEventListener 'WebComponentsReady', ->
  hash = window.location.hash
  if not hash? or hash == ''
    hash = '#goals'
    window.location.hash = '#goals'
  if hash.startsWith('#')
    hash = hash.substr(1)
  options_view = document.querySelector('#options_view')
  options_view.set_selected_tab_by_name(hash)
  options_view.addEventListener 'options_selected_tab_changed', (evt) ->
    window.location.hash = evt.detail.selected_tab_name
  #if hash == '#goals'
  #  options_view
  return
