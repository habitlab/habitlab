window.addEventListener "unhandledrejection", (evt) ->
  throw evt.reason

System.import('components/popup-view.jspm')
