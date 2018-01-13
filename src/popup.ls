<- (-> it!)

window.global_exports = {}

window.addEventListener "unhandledrejection", (evt) ->
  throw evt.reason

dlog = window.dlog = (...args) ->
  if localStorage.getItem('display_dlog') == 'true'
    console.log(...args)

require 'libs_backend/systemjs'

{
  log_pageview
} = require 'libs_backend/log_utils'

if window.location.pathname == '/popup.html'
  require 'components/popup-view.deps'
  require 'libs_common/global_exports_post'
  log_pageview({to: 'popup'})
  return
