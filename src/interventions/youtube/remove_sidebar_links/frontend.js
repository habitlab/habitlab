const {
  once_available_fast,
  on_url_change,
  wrap_in_shadow,
} = require('libs_frontend/frontend_libs')

require_component('habitlab-logo-v2')
require_component('paper-button')

const $ = require('jquery')

const {
  run_only_one_at_a_time
} = require('libs_common/common_libs')

const removeSidebarOnceAvailable = run_only_one_at_a_time((callback) => {
  if (window.intervention_disabled) {
    return
  }
  once_available_fast('.watch-sidebar-section', () => {
    // old youtube
    removeSidebarOld('#watch7-sidebar-contents')
    callback()
  })
  once_available_fast('#related', () => {
    removeSidebar('#related')
    callback()
  })
})

//Nukes links on the sidebar
function removeSidebar(sidebar_selector) {
  console.log('new youtube');
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
  for (let sidebar of $(sidebar_selector)) {
    for (let child of $(sidebar).children()) {
      $(child).css({display: 'none', opacity: 0})
    }
  }
  let habitlab_inserted_div = $('<div style="width: 100%; text-align: center">')
  habitlab_inserted_div.append($('<habitlab-logo-v2>'))
  habitlab_inserted_div.append($('<br>'))
  let show_sidebar_button = $('<paper-button style="background-color: #415D67; color: white; -webkit-font-smoothing: antialiased; font-size: 14px; box-shadow: 2px 2px 2px #888888; margin-top: 10px">Show Sidebar</paper-button>')
  show_sidebar_button.click(function() {
    disable_intervention()
  })
  show_sidebar_button.appendTo(habitlab_inserted_div)
  let habitlab_inserted_div_wrapper = $(wrap_in_shadow(habitlab_inserted_div)).addClass('habitlab_inserted_div')
  $(sidebar_selector).prepend(habitlab_inserted_div_wrapper)
}

//Nukes links on the sidebar
function removeSidebarOld(sidebar_selector) {
  console.log('old youtube');
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
  for (let sidebar of $(sidebar_selector)) {
    for (let child of $(sidebar).children()) {
      $(child).css({display: 'none', opacity: 0})
    }
  }
  let habitlab_inserted_div = $('<div style="width: 100%; text-align: center">')
  habitlab_inserted_div.append($('<habitlab-logo-v2>'))
  habitlab_inserted_div.append($('<br>'))
  let show_sidebar_button = $('<paper-button style="background-color: #415D67; color: white; -webkit-font-smoothing: antialiased; font-size: 14px; box-shadow: 2px 2px 2px #888888; margin-top: 10px">Show Sidebar</paper-button>')
  show_sidebar_button.click(function() {
    disable_intervention()
  })
  show_sidebar_button.appendTo(habitlab_inserted_div)
  let habitlab_inserted_div_wrapper = $(wrap_in_shadow(habitlab_inserted_div)).addClass('habitlab_inserted_div')
  $(sidebar_selector).prepend(habitlab_inserted_div_wrapper)
}

removeSidebarOnceAvailable()

on_url_change(() => {
  removeSidebarOnceAvailable()
})

function disable_intervention() {
  $('.habitlab_inserted_div').remove()
  for (let sidebar of $('#watch7-sidebar-contents')) {
    for (let child of $(sidebar).children()) {
      $(child).css({display: 'block', opacity: 1})
    }
  }
  for (let sidebar of $('#related')) {
    for (let child of $(sidebar).children()) {
      $(child).css({display: 'block', opacity: 1})
    }
  }
}

window.on_intervention_disabled = () => {
  disable_intervention()
}

/*
(document.body || document.documentElement).addEventListener('transitionend',
  function(event) {
    if (event.propertyName === 'width' && event.target.id === 'progress') {
        main();
    }
}, true);
*/
