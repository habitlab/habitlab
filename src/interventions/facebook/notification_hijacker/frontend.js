window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

const $ = require('jquery')

const {
  once_available,
  wrap_in_shadow,
} = require('libs_frontend/common_libs')

const {
  close_selected_tab
} = require('libs_common/tab_utils')

const {
  get_random_quote
} = require('libs_frontend/quote_utils')

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')
require('components/reward-display.deps')

//Injects notification into Facebook feed every "minutes" mins
function decideToInject(minutes) {
  if (!localStorage.hasOwnProperty("lastTimeVisited")) {
    localStorage.lastTimeVisited = Math.floor(Date.now() / 1000);
    return false; //Won't inject notification
  } else {
    const mostRecentVisit = parseInt(Math.floor(Date.now() / 1000), 10);
    //60 seconds = 1 minute
    if ((parseInt(localStorage.lastTimeVisited, 10) + (minutes * 60)) > (mostRecentVisit)) {
      return false
    } else {
      //replace most recent time visited
      localStorage.lastTimeVisited = mostRecentVisit
      return true
    }
  }
}

//TODO: Sometimes the notification disappears X_____X
var beginVar = null;
function begin() {
  //For some reason the once-available function doesn't work?
  //once_available('audio', function() {
  //  showAlert();
  //})
  
  if (beginVar == null) {
      const wait = setInterval(() => {
      var getEmails = document.querySelector('._2n_9'); //Tag containing notif element 
      if (getEmails) {
            clearInterval(wait);
            showAlert();
      }
    }, 250);
  }  
}

//Makes the message box turn white and increments the message amount by one
function showAlert() {
  //Retrieves white message box and adds one new notification
  $('.uiToggle._4962._1z4y').addClass('hasNew');
  //Retrieves amt. of messages the user currently has  
  let amountOfMessages = parseInt($('.uiToggle._4962._1z4y').find('#mercurymessagesCountValue').text());
  //Adds one more new message (our notification) and makes message count viewable
  $('.uiToggle._4962._1z4y').find('#mercurymessagesCountValue').text(amountOfMessages + 1);
  $('.uiToggle._4962._1z4y').find('#mercurymessagesCountValue').removeClass('hidden_elem');
  insertClickNotification();
}

const reward_display = $('<reward-display>').addClass('habitlab_inserted')
document.body.appendChild(reward_display[0])
//reward_display[0].addEventListener('reward_done', function(evt) {
//  close_selected_tab()
//})

//Injects a message from HabitLab when the message button is clicked only the first time
function insertClickNotification() {
  var selected = false;

  $('.jewelButton')[1].addEventListener('click', function() {
    //Only adds message if message has never previously been added
    if (!selected) {
      const wait = setInterval(() => {
        const $messages = $('.jewelContent').find('li'); //Messages are loaded
        if ($messages.length > 1) {
          //hopefully users have at least 1 message so that we can clone a message 
          var $messageClone = $($messages[1]).clone();

          //Changes attributes to create the notification
          $messageClone.addClass('habitlab_inserted').addClass('jewelItemNew'); //Notification highlighted blue ('new')
          $messageClone.find('.author.fixemoji').text('HabitLab (Click to Close Facebook)'); //Changes notification sender
          // let quote = get_random_quote()
          // message = quote.source + ": " + quote.text
          let message = "You've been on here a while! Ready to go?"
          $messageClone.find('._1ijj').text(message); //Changes text
          $messageClone.find('.timestamp').text('Just Now'); //Changes time sent
          $messageClone.find('._8o._8s').html('<img src="https://habitlab.github.io/intervention_images/habitlab.png" width="50" height="50" alt="" class="img">'); //Changes icon
          //$messageClone.find('a[href]').attr('href', 'https://habitlab.github.io'); //redirects link to [link in 2nd arg of attr]
          
          $messageClone.find('a[href]').attr('href', '#').click(function() {
            reward_display[0].play()
          })
          const habitlab_logo = $(wrap_in_shadow($('<habitlab-logo>'))).addClass('habitlab_inserted').css({
            position: 'absolute',
            top: '10px',
            right: '5px',
            'z-index': 999999,
            transform: 'scale(0.9, 0.9)',
          })
          $messageClone.append(habitlab_logo)
          
          //Adds the new message to the notifications list
          $($messages[1]).parent().prepend($messageClone);
          
          selected = true;
          console.log("First Time Selected- Notification Injected");
            
          //Log the impression: The user viewed the message from habitlab
          
          clearInterval(wait);
        }
      }, 250);
    } else {
      //Already been selected; do nothing
    }
  });
}

function main() {
  if (decideToInject(intervention.params.minutes.value)) { //Injects notifications every x minutes
      begin()
  } else {
    console.log("Notification not injected")
  }
}

//$(document).ready(main())
setTimeout(begin, 3000);

window.on_intervention_disabled = () => {
  $('.habitlab_inserted').remove()
}

window.debugeval = x => eval(x);
