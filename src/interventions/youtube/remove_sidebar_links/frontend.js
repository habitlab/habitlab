"use strict";

(() => {

const {
  once_available,
  run_only_one_at_a_time,
  on_url_change,
} = require('libs_frontend/common_libs')

const {
  log_impression,
  log_action,
} = require('libs_common/log_utils')

console.log('youtube remove sidebar links loaded frontend')
//Nukes links on the sidebar
function removeSidebar() {
	//remove the links on the sidebar
	const sidebarLink = document.querySelectorAll('.watch-sidebar-section');
	for (let link of sidebarLink) {
		link.parentNode.removeChild(link)
	}
}

const removeSidebarOnceAvailable = run_only_one_at_a_time((callback) => {
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

/*
(document.body || document.documentElement).addEventListener('transitionend',
  function(event) {
    if (event.propertyName === 'width' && event.target.id === 'progress') {
        main();
    }
}, true);
*/

})()
