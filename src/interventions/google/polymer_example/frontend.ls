<- (-> it!)

if window.google_polymer_example
  return
window.google_polymer_example = true

{
  listen_for_eval
  insert_console
} = require 'libs_frontend/content_script_debug'

$ = require 'jquery'

listen_for_eval ((x) -> eval(x))
insert_console ((x) -> eval(x)), {lang: 'livescript'}

require('enable-webcomponents-in-content-scripts')

require('components/hello-world-example.deps')

hello_world_example = $('<hello-world-example>').css({
  'z-index': 9999999
  position: 'absolute'
})
$('body').append(hello_world_example)
