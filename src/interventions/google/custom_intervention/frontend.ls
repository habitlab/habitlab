console.log 'custom intervention running'

require 'libs_common/systemjs'

require! co

{
  listen_for_eval
  insert_console
} = require 'libs_frontend/content_script_debug'

/*
systemjs_require <- System.import('libs_common/systemjs_require').then()
require <- systemjs_require.make_require_frontend().then()
*/

if intervention.params.debug.value
  listen_for_eval ((x) -> eval(x))
  insert_console ((x) -> eval(x)), {lang: 'livescript'}

console.log 'starting eval in custom intervention'
jscode_updated = """
co(function*() {
  #{intervention.params.jscode.value}
});
"""
eval(jscode_updated)
console.log 'finishing eval in custom intervention'
