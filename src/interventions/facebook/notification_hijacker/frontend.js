(() => {

if (window.notification_hijacker) {
  return
}
window.notification_hijacker = true

const $ = require('jquery')

const {
  once_available,
} = require('libs_frontend/common_libs')

setTimeout(() => {

const messages = ["You've spent a questionable amount of time on Facebook.",
                  "Please get off facebook. I'm begging you.",
                  "You really shouldn't be spending time on Facebook.",
                  "Get off Facebook. There are children starving in Africa.",
                  "You know this is a waste of time, right?",
                  "Why are you still on Facebook.",
                  "An innocent animal dies every minute you spend on Facebook.",
                  "Shouldn't you be doing something productive?",
                  "Money isn't going to make itself! Get off Facebook!",
                  "WHY ARE YOU STILL HERE. PLEASE LEAVE.",
                  "Einstein didn't ever use Facebook, and he won a Nobel Prize.",
                  ":( Why are you still here :("]

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
  console.log("Inserting notification...");
  //Retrieves white message box and adds one new notification
  $('.uiToggle._4962._1z4y').addClass('hasNew');
  //Retrieves amt. of messages the user currently has  
  let amountOfMessages = parseInt($('.uiToggle._4962._1z4y').find('#mercurymessagesCountValue').text());
  //Adds one more new message (our notification) and makes message count viewable
  $('.uiToggle._4962._1z4y').find('#mercurymessagesCountValue').text(amountOfMessages + 1);
  $('.uiToggle._4962._1z4y').find('#mercurymessagesCountValue').removeClass('hidden_elem');
  insertClickNotification();
}

//Injects a message from Habitlab when the message button is clicked only the first time
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
          $messageClone.addClass('jewelItemNew'); //Notification highlighted blue ('new')
          $messageClone.find('.author.fixemoji').text('HabitLab'); //Changes notification sender
          const rand = Math.floor((Math.random() * messages.length));
          $messageClone.find('.snippet.preview').text(messages[rand]); //Changes text
          $messageClone.find('.time').text('Just Now'); //Changes time sent
          $messageClone.find('._55lt').html('<img src="https://i.imgur.com/4G2qKQV.png" width="50" height="50" alt="" class="img">'); //Changes icon
          $messageClone.find('a[href]').attr('href', 'https://habitlab.github.io'); //redirects link to [link in 2nd arg of attr]

          //Adds the new message to the notifications list
          $($messages[1]).parent().prepend($messageClone);
          
          selected = true;
          console.log("First Time Selected- Notification Injected");
          clearInterval(wait);
        }
      }, 250);
    } else {
      //Already been selected; do nothing
    }
  });
}

function main() {
  if (decideToInject(10)) { //Injects notifications every x minutes
      begin();
  }
}

$(document).ready(main());

}, 3000)

})()
