window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

var $ = require('jquery');

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')
require('components/close-tab-button.deps')
require('bower_components/paper-button/paper-button.deps')


setInterval(function() {
  for (let x of $('video')) {
    x.pause();
  }
}, 10000);

window.debugeval = x => eval(x);

