console.log('frontend.ls before listen_for_eval')
{
  listen_for_eval
  insert_console
} = require 'libs_frontend/content_script_debug'
listen_for_eval ((x) -> eval(x))
if intervention.params.debug.value
  insert_console ((x) -> eval(x)), {lang: 'livescript'}
console.log('frontend.ls after listen_for_eval')

foobar = ->
  'hello world'
