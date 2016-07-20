console.log 'jspm example running'

{
  listen_for_eval
  insert_console
} = require 'libs_frontend/content_script_debug'

require 'libs_common/systemjs'

listen_for_eval ((x) -> eval(x))
insert_console ((x) -> eval(x)), {lang: 'livescript'}
