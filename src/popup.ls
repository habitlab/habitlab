window.addEventListener "unhandledrejection", (evt) ->
  throw evt.reason

require('components/popup-view.deps')
