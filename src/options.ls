window.addEventListener "unhandledrejection", (evt) ->
  throw evt.reason

require 'webcomponentsjs-custom-element-v0'
require 'components/options-view.deps'
{load_css_file} = require 'libs_common/content_script_utils'
{cfy} = require 'cfy'

window.addEventListener 'WebComponentsReady', cfy ->*
  hash = window.location.hash
  if not hash? or hash == ''
    hash = '#results'
    window.location.hash = '#results'
  if hash.startsWith('#')
    hash = hash.substr(1)
  options_view = document.querySelector('#options_view')
  if hash == 'introduction'
    options_view.selected_tab_idx = -1
    yield options_view.icon_clicked()
  options_view.set_selected_tab_by_name(hash)
  options_view.addEventListener 'options_selected_tab_changed', (evt) ->
    window.location.hash = evt.detail.selected_tab_name
  #  options_view
  return
