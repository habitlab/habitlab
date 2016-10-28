// const {polymer_ext} = require('libs_frontend/polymer_utils');

//var

require('enable-webcomponents-in-content-scripts')
require('bower_components/paper-button/paper-button.deps')

const $ = require('jquery')

$('body').append($('<paper-button style="position: fixed; top: 0px; left: 0px; z-index: 9999999">click me please</paper-button>'))

alert('close_tab_message running')
