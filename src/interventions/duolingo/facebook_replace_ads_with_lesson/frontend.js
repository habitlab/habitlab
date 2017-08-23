const {
  once_available_fast,
  on_url_change,
  wrap_in_shadow,
} = require('libs_frontend/frontend_libs')

const $ = require('jquery')

const {
  run_only_one_at_a_time
} = require('libs_common/common_libs')

const removeSidebarOnceAvailable = run_only_one_at_a_time((callback) => {
  if (window.intervention_disabled) {
    return
  }
  once_available_fast('#pagelet_ego_pane', () => {
    console.log('available!')
    removeSidebar()
    callback()
  })
})

console.log('running replacement...')
//Nukes links on the sidebar
function removeSidebar() {
  if (window.intervention_disabled) {
    return
  }
  if ($('.habitlab_inserted_div').length > 0) {
    return
  }
	//remove the links on the sidebar
	/*
  const sidebarLink = document.querySelectorAll('.watch-sidebar-section');
	for (let link of sidebarLink) {
		link.parentNode.removeChild(link)
	}
  */
  for (let sidebar of $('#pagelet_ego_pane')) {
    for (let child of $(sidebar).children()) {
      $(child).css({display: 'none', opacity: 0})
    }
  }
  let lesson_component = $('<duolingo-lesson-widget></duolingo-lesson-widget>')
  let lesson_wrapper = $(wrap_in_shadow(lesson_component)).addClass('habitlab_inserted_div')
  $('#pagelet_ego_pane').prepend(lesson_wrapper)
}

removeSidebarOnceAvailable()

on_url_change(() => {
  removeSidebarOnceAvailable()
})

require_component('habitlab-logo')
require_component('paper-button')
require_component('duolingo-lesson-widget')

function disable_intervention() {
  $('.habitlab_inserted_div').remove()
  for (let sidebar of $('#pagelet_ego_pane')) {
    for (let child of $(sidebar).children()) {
      $(child).css({display: 'block', opacity: 1})
    }
  }
}

window.on_intervention_disabled = () => {
  disable_intervention()
}
