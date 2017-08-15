const $ = require('jquery');

const {wrap_in_shadow} = require('libs_frontend/frontend_libs');

require_component('sidebar-suggestions-removed')

function removeSidebar() {
  if (window.intervention_disabled) {
    return
  }
  if ($('.habitlab_inserted_div').length > 0) {
    return
  }
}

function clear_div(div){
  for (let child of div.children()) {
    $(child).css({
      opacity: 0,
      display: 'none',
    })
  }
}

function disable_intervention() {
  console.log("intervention disabled")
  for (let child of $('#jujiPlayListRight').children()) {
    $(child).css({
      opacity: 1,
      display: 'block'
    })
  }
  $('sidebar-suggestions-removed').remove()
}

clear_div($('#jujiPlayListRight'))
clear_div($('#wrapper-right'))
console.log("sidebar removed")
let inserted_div = $('<sidebar-suggestions-removed>')
$('#jujiPlayListRight').prepend(inserted_div)
inserted_div.on('show_sidebar_clicked',disable_intervention)

removeSidebar()

window.on_intervention_disabled = () => {
  disable_intervention()
}
