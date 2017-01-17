const {
  once_available,
  run_only_one_at_a_time,
  on_url_change,
} = require('libs_frontend/common_libs')

const {
  log_impression,
  log_action,
} = require('libs_common/log_utils')

const $ = require('jquery')
require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')
require('bower_components/paper-button/paper-button.deps')

console.log('youtube remove sidebar links loaded frontend')
//Nukes links on the sidebar
function removeSidebar() {
	//remove the links on the sidebar
	/*
  const sidebarLink = document.querySelectorAll('.watch-sidebar-section');
	for (let link of sidebarLink) {
		link.parentNode.removeChild(link)
	}
  */
  for (let sidebar of $('#watch7-sidebar-contents')) {
    for (let child of $(sidebar).children()) {
      $(child).css({display: 'none', opacity: 0})
    }
  }
  let habitlab_inserted_div = $('<div class="habitlab_inserted_div" style="width: 100%; text-align: center">')
  habitlab_inserted_div.append($('<habitlab-logo>'))
  habitlab_inserted_div.append($('<br>'))
  let show_sidebar_button = $('<paper-button style="background-color: red; color: white">Show Sidebar</paper-button>')
  show_sidebar_button.click(function() {
    disable_intervention()
  })
  show_sidebar_button.appendTo(habitlab_inserted_div)
  $('#watch7-sidebar-contents').prepend(habitlab_inserted_div)
}

var intervention_disabled = false

const removeSidebarOnceAvailable = run_only_one_at_a_time((callback) => {
  if (intervention_disabled) {
    return
  }
  log_impression('youtube/remove_sidebar_links')
  once_available('.watch-sidebar-section', () => {
    removeSidebar()
    callback()
  })
})

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
}

document.body.addEventListener('disable_intervention', function() {
  intervention_disabled = true
  disable_intervention()
})

/*
(document.body || document.documentElement).addEventListener('transitionend',
  function(event) {
    if (event.propertyName === 'width' && event.target.id === 'progress') {
        main();
    }
}, true);
*/

window.debugeval = x => eval(x);
