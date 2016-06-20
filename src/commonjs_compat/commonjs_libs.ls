export_window = (list, lib) ->
  for x in list
    window[x] = lib[x]
  return lib

export_window [
  'get_interventions'
  'get_enabled_interventions'
], require('libs_backend/background_common')

export_window [
  'memoizeSingleAsync'
], require('libs_common/memoize')

window.prelude = require('prelude')
window.async = require('async')
window['$'] = window.jQuery = require('jquery')
