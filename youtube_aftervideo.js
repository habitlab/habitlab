//TODO: Add eventlistener for onhashchange
//http://stackoverflow.com/questions/32884909/my-chrome-extension-will-not-load-untill-i-reload-refresh-the-same-youtube-video

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

//Places a white box over the video and pauses the video
function divOverVideoBegin() {
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

	//Container for text in the white box
	var $contentContainer = $('<div class="contentContainer">').css({
							'position': 'absolute',							
							'top': '50%',
							'left': '50%',
							'transform': 'translateX(-50%) translateY(-50%)'});
	var $text1 = $('<h1>');	
	$text1.text("Are you sure you want to play the video?");
	$contentContainer.append($text1);
	$contentContainer.append($('<p>'));

	//Close tab button
	var $button1 = $('<button>');
	$button1.text("Close Tab");
	$button1.css({'cursor': 'pointer'});
	$button1.click(function() {
		removeDiv();
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

//TODO: Close current tab
function divOverVideoEnd() {
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

	var $button1 = $('<button>');
	$button1.text("Close Tab");
	$button1.css({'cursor': 'pointer'});
	$button1.click(function() {
		closeTab();
	})	
	$('.whiteOverlay').append($button1);
}

function removeDiv() {
	$('.whiteOverlay').remove();
	var play = document.querySelector('video');
	play.play();	
}

function closeTab() {

}

//TODO: Make event listener for end of video instead of checking every second if the video is finished
function endWarning() {
	var overlayBox = document.querySelector('video');
	
	console.log(overlayBox.currentTime);
	console.log(overlayBox.duration);
	if ((overlayBox.currentTime > (overlayBox.duration - 1)) && !overlayBox.paused) {
		divOverVideoEnd();
		overlayBox.pause();
	}
}

function main() {
	removeSidebar();
	divOverVideoBegin();
	setTimeout(pauseVideo, 200); //Sets timeout, since video takes a little time to load
	setInterval(endWarning, 1000); //Loop every second to test the status of the video until near the end
}

$(document).ready(main);