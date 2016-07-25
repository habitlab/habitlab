console.log 'jspm example running'

require 'libs_common/systemjs'

systemjs_require <- System.import('libs_common/systemjs_require').then()
require <- systemjs_require.make_require_frontend().then()

if intervention.params.debug.value
  {
    listen_for_eval
    insert_console
  } = require 'libs_frontend/content_script_debug'
  listen_for_eval ((x) -> eval(x))
  insert_console ((x) -> eval(x)), {lang: 'livescript'}
