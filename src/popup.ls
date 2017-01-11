<- (-> it!)

window.global_exports = {}

window.addEventListener "unhandledrejection", (evt) ->
  throw evt.reason

dlog = window.dlog = (...args) ->
  if localStorage.getItem('display_dlog') == 'true'
    console.log(...args)

require 'libs_common/systemjs'

if window.location.pathname == '/popup.html'
  require 'components/popup-view.deps'
  document.querySelector('#index_body').appendChild(document.createElement('popup-view'))
  require 'libs_common/global_exports_post'
  return
