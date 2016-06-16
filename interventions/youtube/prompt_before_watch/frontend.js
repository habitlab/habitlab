console.log('youtube prompt before watch loaded frontend')

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
  if ($('video').length == 0) {
    return
  }
  if (window.location.href.indexOf('watch') == -1) {
    return
  }
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

	//Message to user
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
		removeDivAndPlay();
		$button2.hide();
	})
	$contentContainer.append($button2);

	//Adds text into the white box
	$('.whiteOverlay').append($contentContainer);
}

//Remove the white div
function removeDivAndPlay() {
	$('.whiteOverlay').remove();
	var play = document.querySelector('video');
	play.play();
}

//Remove the white div
function removeDiv() {
	$('.whiteOverlay').remove();
}

//Close the current tab
function closeTab() {
	chrome.runtime.sendMessage({greeting: "closeTab"}, function(response) {});
}

//TODO: Make event listener for end of video instead of checking every second if the video is finished
function endWarning() {
	/*
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

video_pauser = null

//All method calls
function main() {
  console.log('main called')
  removeDiv();
	divOverVideo("begin");
  if (video_pauser == null) {
    video_pauser = setInterval(() => {
      pauseVideo();
      console.log('video pauser running')
      var video_elem = document.querySelector('video')
      if (video_elem && video_elem.paused) {
        clearInterval(video_pauser)
      }
    }, 250);
  }
	//pauseVideo();
	//endWarning();
	setInterval(endWarning, 250); //Loop every second to test the status of the video until near the end
}

//Link to Fix: http://stackoverflow.com/questions/18397962/chrome-extension-is-not-loading-on-browser-navigation-at-youtube
function afterNavigate() {
    if ('/watch' === location.pathname) {
        if (video_pauser) {
          clearInterval(video_pauser)
          video_pauser = null
        }
        //$(document).ready(main);
        main()
    } else {
      removeDiv();
    }
}

//Youtube specific call for displaying the white div/message when the red top slider transitions
//(Solution from link above)
(document.body || document.documentElement).addEventListener('transitionend',
  function(/*TransitionEvent*/ event) {
    if (event.propertyName === 'width' && event.target.id === 'progress') {
        afterNavigate();
    }
}, true);

$(document).ready(main);

//Executed after page load
//afterNavigate();
