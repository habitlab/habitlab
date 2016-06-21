(() => {

if (window.notification_hijacker) {
  return
}
window.notification_hijacker = true

const $ = require('jquery')

const {
  once_available,
} = require('libs_frontend/common_libs')


//TODO: Sometimes the notification disappears X_____X
var beginVar = null;
function begin() {
  //For some reason the once-available function doesn't work?

  //once_available('audio', function() {
  //  showAlert();
  //})
  
  if (beginVar == null) {
      const wait = setInterval(() => {
      var getEmails = document.querySelector('audio'); //Last tag to be loaded      
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
    console.log("Clicked");

    //Only adds message if message has never previously been added
    if (!selected) {
      const wait = setInterval(() => {
        const $messages = $('.jewelContent').find('li'); //Messages are loaded
        if ($messages.length > 1) {
          console.log($messages);

          //hopefully users have more than 1 message so that we can clone a message 
          var $messageClone = $($messages[1]).clone();

          $messageClone.find('.author.fixemoji').text('HabitLab'); //Changes notification 
          $messageClone.find('.snippet.preview').text('You\'ve spent a questionable amount of time on facebook.');
          $messageClone.find('.time').text('Just Now');
          //TODO: Change picture shown to that of the beaker
          //TODO: Change link that the messageClone directs to to nothing/another link

          //Adds the new message as a notification
          $($messages[1]).prepend($messageClone);
          
          selected = true;
          console.log("First Time Selected- Notification Injected");
          clearInterval(wait);
        }
      }, 250);
    } else {
      console.log("Already been selected");
    }     
  });
}

function main() {
  begin();
}

$(document).ready(main());

})()
