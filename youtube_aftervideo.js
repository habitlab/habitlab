//Nukes links on the sidebar
function removeSidebar() {
	//remove the links on the sidebar
	var sidebarLink = document.querySelectorAll('.watch-sidebar-section');

	for (var i = 0; i < sidebarLink.length; i++) {
		var link = sidebarLink[i];
		link.parentNode.removeChild(link);
	}
}

//Initially pauses the video when the page is loaded
function pauseVideo() {
	var overlayBox = document.querySelector('video');
	if (!overlayBox.paused) {		
		overlayBox.pause();
	}	
}

//Places a white box over the video with a warning message
function divOverVideo(status) {
	//Constructs white overlay box
	var $a = $('<div class="whiteOverlay">').css({'position': 'absolute'});
	$a.width($('video').width());
	$a.height($('video').height());
	$a.css({'background-color': 'white'});
	$a.css('z-index', 30);	
	$a.text();
	$(body).append($a);
	var b = $a[0];
	b.style.left = $('video').offset().left + 'px';
	b.style.top = $('video').offset().top + 'px';
	b.style.opacity = 0.9;

	//Centered container for text in the white box
	var $contentContainer = $('<div class="contentContainer">').css({
							'position': 'absolute',							
							'top': '50%',
							'left': '50%',
							'transform': 'translateX(-50%) translateY(-50%)'});
	var $text1 = $('<h1>');	

	if (status === 'begin') {
		$text1.text("Are you sure you want to play the video?");
	} else {
		$text1.text("Are you sure you want to continue watching videos?");
	}
	$contentContainer.append($text1);
	$contentContainer.append($('<p>'));

	//Close tab button
	var $button1 = $('<button>');
	$button1.text("Close Tab");
	$button1.css({'cursor': 'pointer'});
	$button1.click(function() {
		closeTab();
		$button1.hide();
	})	
	$contentContainer.append($button1);

	//Continue watching video button
	var $button2 = $('<button>');	
	$button2.text("Watch Video");
	$button2.css({'cursor': 'pointer', 'padding': '10px'});
	$button2.click(function() {
		removeDiv();
		$button2.hide();
	})	
	$contentContainer.append($button2);

	//Adds text into the white box
	$('.whiteOverlay').append($contentContainer);	
}

function removeDiv() {
	$('.whiteOverlay').remove();
	var play = document.querySelector('video');
	play.play();	
}

function closeTab() {
	console.log("hello");
	chrome.tabs.getSelected(function(tab) {
		console.log(tab.id);
		chrome.tabs.remove(tab.id);
	});
}

//TODO: Make event listener for end of video instead of checking every second if the video is finished	
function endWarning() {	
	/*
	console.log('Hello');
	$('video').on('ended', function() {
		console.log("executing");
		divOverVideoEnd();
		
	});
	*/
	overlayBox = document.querySelector('video');
	if ((overlayBox.currentTime > (overlayBox.duration - 0.25)) && !overlayBox.paused) {
		divOverVideo("end");
		//overlayBox.pause();
	}		
}

//Method calls go here
function main() {
	removeSidebar();
	divOverVideo("begin");
	pauseVideo();	
	//endWarning();
	setInterval(endWarning, 250); //Loop every second to test the status of the video until near the end
}

//Link Fix: http://stackoverflow.com/questions/18397962/chrome-extension-is-not-loading-on-browser-navigation-at-youtube
function afterNavigate() {
    if ('/watch' === location.pathname) {
        $(document).ready(main);
    }
}

(document.body || document.documentElement).addEventListener('transitionend',
  function(/*TransitionEvent*/ event) {
    if (event.propertyName === 'width' && event.target.id === 'progress') {
        afterNavigate();
    }
}, true);
// After page load
afterNavigate();