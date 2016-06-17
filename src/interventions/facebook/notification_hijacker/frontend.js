const $ = require('jquery')

var beginVar = null;
function begin() {
  if (beginVar == null) {
      let wait = setInterval(() => {
      var getEmails = document.querySelector('#feedlearn');
      if (getEmails) {
          console.log("Finished loading!");
          showAlert(); //call once again for when the pages loads
          clickNotification();
            clearInterval(wait);
      }
    }, 250);
  }
}

function showAlert() {
  console.log("Inserting notification...");
  //Retrieves white message box and adds one new notification
  $('.uiToggle._4962._1z4y').addClass('hasNew');
  let amtMessages = parseInt($('.uiToggle._4962._1z4y').find('#mercurymessagesCountValue').text());
  //Adds one more new message (our notification) and makes message count viewable
  $('.uiToggle._4962._1z4y').find('#mercurymessagesCountValue').text(amtMessages + 1);
  $('.uiToggle._4962._1z4y').find('#mercurymessagesCountValue').removeClass('hidden_elem')
}

function clickNotification() {

}

function main() {
  showAlert(); //Show before page has entirely loaded
  begin();
}

$(document).ready(main);
