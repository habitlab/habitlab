"use strict";

const $ = require('jquery')

const {close_selected_tab} = require('libs_frontend/tab_utils')

const {
  once_available,
  run_only_one_at_a_time,
  on_url_change,
} = require('libs_frontend/common_libs')

const {
  get_seconds_spent_on_current_domain_today,
  get_seconds_spent_on_domain_today,
} = require('libs_common/time_spent_utils')

const {
  log_impression,
  log_action,
} = require('libs_common/log_utils')

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')
require('components/reward-display.deps')
require('bower_components/paper-button/paper-button.deps')

const reward_display = $('<reward-display>')
reward_display[0].addEventListener('reward_done', function() {
  close_selected_tab()
})
document.body.appendChild(reward_display[0])
//console.log('youtube prompt before watch loaded frontend')

//Initially pauses the video when the page is loaded
function pauseVideo() {
	const overlayBox = document.querySelector('video');
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
  const $a = $('<div class="whiteOverlay">').css({'position': 'absolute'});
	$a.width($('video').width());
	$a.height($('video').height());
	$a.css({'background-color': 'white'});
	$a.css('z-index', 30);
	$a.text();
	$(document.body).append($a);
	const b = $a[0];
	b.style.left = $('video').offset().left + 'px';
	b.style.top = $('video').offset().top + 'px';
	b.style.opacity = 0.9;

	//Centered container for text in the white box
	const $contentContainer = $('<div class="contentContainer">').css({
    'position': 'absolute',
    'top': '50%',
    'left': '50%',
    'transform': 'translateX(-50%) translateY(-50%)',
    'text-align': 'center'
  });

  $contentContainer.append('<habitlab-logo>')
  $contentContainer.append('<br><br>')

	//Message to user
	const $text1 = $('<h1>');
	if (status === 'begin') {
    const wait = setInterval(() => {
      const getEmails = document.querySelector('video');
      const duration = Math.round($('video')[0].duration)
      if (!isNaN(duration) ) {
        const minutes = Math.floor(duration / 60)
        const seconds = (duration % 60)
        $text1.html("This video is " + minutes + " minutes and " + seconds + " seconds long. <br>Are you sure you want to play it?");
        clearInterval(wait);
      }
    }, 100);
	} else { //status === 'end'
      get_seconds_spent_on_domain_today('www.youtube.com', function(secondsSpent) {
          const mins = Math.floor(secondsSpent/60)
          const secs = secondsSpent % 60
          $text1.html("You've spent " + mins + " minutes and " + secs + " seconds on Youtube today. <br>Are you sure you want to continue watching videos?");
      })
	}
	$contentContainer.append($text1);
	$contentContainer.append($('<br>'));

	//Close tab button
	const $button1 = $('<paper-button>');
	$button1.text("Close Tab");
	$button1.css({
    'cursor': 'pointer',
    'background-color': '#8bc34a',
    'color': 'white',
  });
	$button1.click(() => {
    log_action('youtube/prompt_before_watch', {'positive': 'closedYoutube'})
		reward_display[0].play();
		$button1.hide();
	})
	$contentContainer.append($button1);

	//Continue watching video button
	const $button2 = $('<paper-button>');
	$button2.text("Watch Video");
	$button2.css({
    'cursor': 'pointer',
    'background-color': 'red',
    'color': 'white',
  });
	$button2.click(() => {
    log_action('youtube/prompt_before_watch', {'negative': 'remainedOnYoutube'})
		removeDivAndPlay();
		$button2.hide();
	})
	$contentContainer.append($button2);

	//Adds text into the white box
	$('.whiteOverlay').append($contentContainer);

  //Logs impression
  log_impression('youtube/prompt_before_watch');
}

//Remove the white div
function removeDivAndPlay() {
	$('.whiteOverlay').remove();
	const play = document.querySelector('video');
	play.play();
}

//Remove the white div
function removeDiv() {
	$('.whiteOverlay').remove();
}

function endWarning() {
  // $('video').on('ended', function() {
  // 	console.log("executing");
  // 	divOverVideoEnd();
  // });
	const overlayBox = document.querySelector('video');
	if ((overlayBox.currentTime > (overlayBox.duration - 0.15)) && !overlayBox.paused) {
    clearInterval(end_pauser)
    pauseVideo()
		divOverVideo("end")
	}
}

let video_pauser = null
let end_pauser = null //new
//All method calls
function main() {
  console.log('main called');
  removeDiv();
	divOverVideo("begin");
  if (video_pauser == null) {
    video_pauser = setInterval(() => {
      pauseVideo();
      console.log('video pauser running')
      const video_elem = document.querySelector('video')
      if (video_elem && video_elem.paused) {
        clearInterval(video_pauser);
      }
    }, 250);
  }
  end_pauser = setInterval(() => {
    endWarning()
  }, 150); //Loop to test the status of the video until near the end
}

//Link to Fix: http://stackoverflow.com/questions/18397962/chrome-extension-is-not-loading-on-browser-navigation-at-youtube
function afterNavigate() {
  console.log('afterNavigate')
  if ('/watch' === location.pathname) {
    console.log('youtube watch page')
    if (video_pauser) {
      clearInterval(video_pauser);
      video_pauser = null;
    }
    console.log('right before main gets called')
    //$(document).ready(main);
    main();
  } else {
    removeDiv();
  }
}

//Youtube specific call for displaying the white div/message when the red top slider transitions
//(Solution from link above)
(document.body || document.documentElement).addEventListener('transitionend',
  (event) => {
    if (event.propertyName === 'width' && event.target.id === 'progress') {
        afterNavigate();
    }
}, true);

$(document).ready(main);
//main()

//Executed after page load
//afterNavigate();

