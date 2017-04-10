<- (-> it!)

window.global_exports = {}

window.addEventListener "unhandledrejection", (evt) ->
  throw evt.reason

dlog = window.dlog = (...args) ->
  if localStorage.getItem('display_dlog') == 'true'
    console.log(...args)

require 'libs_backend/systemjs'

if window.location.pathname == '/popup.html'
  document.getElementById('loading_message').remove()
  require 'components/popup-view.deps'
  require 'libs_common/global_exports_post'
  return
