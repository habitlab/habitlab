console.log('youtube remove sidebar links loaded frontend')
//Nukes links on the sidebar
function removeSidebar() {
	//remove the links on the sidebar
	var sidebarLink = document.querySelectorAll('.watch-sidebar-section');
	for (var i = 0; i < sidebarLink.length; i++) {
		var link = sidebarLink[i];
		link.parentNode.removeChild(link);
	}
}

function main() {
  removeSidebar()
}

$(document).ready(main);
