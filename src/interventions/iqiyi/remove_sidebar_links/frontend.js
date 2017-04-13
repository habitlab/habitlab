window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

var $ = require('jquery');

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')
require('components/close-tab-button.deps')
require('bower_components/paper-button/paper-button.deps')


$('#widget-tab-0').css('opacity', 0)

window.debugeval = x => eval(x);

