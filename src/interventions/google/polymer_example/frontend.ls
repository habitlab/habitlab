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
#document.registerElement = null
#require('webcomponents.js/CustomElements.js')
#require('./webcomponents-lite.js')
#require('webcomponentsjs/lite')
#require('webcomponentsjs-custom-element-v1')

{import_dom_modules} = require 'libs_frontend/dom_utils'

require('components_skate/time-spent-display')

require('bower_components/polymer/polymer-micro-0.js')
require('bower_components/polymer/polymer-mini-0.js')
require('bower_components/polymer/polymer-0.js')

import_dom_modules(require('html!components/hello-world-example.html'))

require('components/hello-world-example')

hello_world_example = $('<hello-world-example>')
$('body').append(hello_world_example)

display_timespent_div = $('<time-spent-display>')
$('body').append(display_timespent_div)
