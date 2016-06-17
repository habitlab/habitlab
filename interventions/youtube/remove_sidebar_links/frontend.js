"use strict";

(() => {

console.log('youtube remove sidebar links loaded frontend')
//Nukes links on the sidebar
function removeSidebar() {
	//remove the links on the sidebar
	const sidebarLink = document.querySelectorAll('.watch-sidebar-section');
	for (let link of sidebarLink) {
		link.parentNode.removeChild(link)
	}
}

const removeSidebarOnceAvailable = runOnlyOneAtATime(() => {
  once_available('.watch-sidebar-section', removeSidebar)
})

removeSidebarOnceAvailable()

/*
(document.body || document.documentElement).addEventListener('transitionend',
  function(event) {
    if (event.propertyName === 'width' && event.target.id === 'progress') {
        main();
    }
}, true);
*/

let prev_url = window.location.href
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const {type, data} = msg
  if (type == 'navigation_occurred') {
    console.log('received navigation_occurred in remove_sidebar_links')
    if (data.url != prev_url) {
      prev_url = data.url
      removeSidebarOnceAvailable()
    }
  }
})

})()
