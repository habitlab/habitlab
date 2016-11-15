<- (-> it!)

if window.google_logo_display_example
  return
window.google_logo_display_example = true

require('enable-webcomponents-in-content-scripts')

require 'components_skate/habitlab-logo'

#$ = require 'jquery'

/*
logo = $('<habitlab-logo>').prop {
  position: 'absolute'
  top: '50px'
  left: '50px'
  width: '100px'
  height: '100px'
}
logo.appendTo $('body')
*/

logo = document.createElement('habitlab-logo')
logo.position = 'absolute'
logo.top = '50px'
logo.left = '50px'
logo.width = '100px'
logo.height = '100px'
document.body.appendChild(logo)
