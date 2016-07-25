<- (-> it!)

if window.google_polymer_example
  return
window.google_polymer_example = true

$ = require 'jquery'

require('enable-webcomponents-in-content-scripts')

require('components/hello-world-example.deps')

# {import_dom_modules} = require('libs_frontend/dom_utils')
#import_dom_modules(require('html!./components.vulcanized.html'))
#import_dom_modules(require('html!./components.crisper.html'))
#require('./components.crisper.js')

hello_world_example = $('<hello-world-example>').css({
  'z-index': 9999999
  position: 'absolute'
})
$('body').append(hello_world_example)

if intervention.params.debug.value
  {
    listen_for_eval
    insert_console
  } = require 'libs_frontend/content_script_debug'
  listen_for_eval ((x) -> eval(x))
  insert_console ((x) -> eval(x)), {lang: 'livescript'}