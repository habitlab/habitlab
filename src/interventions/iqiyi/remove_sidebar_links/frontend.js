window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

var $ = require('jquery');

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')
require('components/close-tab-button.deps')
require('bower_components/paper-button/paper-button.deps')

function removeSidebar() {
  if (window.intervention_disabled) {
    return
  }
  if ($('.habitlab_inserted_div').length > 0) {
    return
  }
$('#jujiPlayListRight').css('opacity', 0)
let habitlab_inserted_div = $('<div style="width: 100%; text-align: center">')
  habitlab_inserted_div.append($('<habitlab-logo>'))
  habitlab_inserted_div.append($('<br>'))
  let show_sidebar_button = $('<paper-button style="background-color: #415D67; color: white; -webkit-font-smoothing: antialiased; font-size: 14px; box-shadow: 2px 2px 2px #888888; margin-top: 10px">Show Sidebar</paper-button>')
  show_sidebar_button.click(function() {
    disable_intervention()
  })
  show_sidebar_button.appendTo(habitlab_inserted_div)
  let habitlab_inserted_div_wrapper = $(wrap_in_shadow(habitlab_inserted_div)).addClass('habitlab_inserted_div')
  $('#jujiPlayListRight').prepend(habitlab_inserted_div_wrapper)
}

function disable_intervention() {
  $('.habitlab_inserted_div').remove()
  $('#jujiPlayListRight').css('opacity', 1)
}

removeSidebar()

window.on_intervention_disabled = () => {
  disable_intervention()
}

window.debugeval = x => eval(x);


