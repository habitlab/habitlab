var $ = require('jquery');
const {wrap_in_shadow} = require('libs_frontend/frontend_libs')

require_component('habitlab-logo')
require_component('call-to-action-button')
require_component('paper-button')

function removeSidebar() {
  if (window.intervention_disabled) {
    return
  }
  if ($('.habitlab_inserted_div').length > 0) {
    return
  }
$('#player_sidebar').css('opacity', 0)
let habitlab_inserted_div = $('<div style="width: 100%; text-align: center">')
  habitlab_inserted_div.append($('<habitlab-logo>'))
  habitlab_inserted_div.append($('<br>'))
  let show_sidebar_button = $('<paper-button style="background-color: #415D67; color: white; -webkit-font-smoothing: antialiased; font-size: 14px; box-shadow: 2px 2px 2px #888888; margin-top: 10px">Show Sidebar</paper-button>')
  show_sidebar_button.click(function() {
    disable_intervention()
  })
  show_sidebar_button.appendTo(habitlab_inserted_div)
  let habitlab_inserted_div_wrapper = $(wrap_in_shadow(habitlab_inserted_div)).addClass('habitlab_inserted_div')
  $('#player_sidebar').prepend(habitlab_inserted_div_wrapper)
}

function disable_intervention() {
  $('.habitlab_inserted_div').remove()
  $('#player_sidebar').css('opacity', 1)
}

removeSidebar()

window.on_intervention_disabled = () => {
  disable_intervention()
}

