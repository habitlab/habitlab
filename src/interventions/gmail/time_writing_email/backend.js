const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

var myNotifId = null;

//Displays a rich notification to the user
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
  if (request.type === "chrome-notification") {
    chrome.notifications.create('chrome-notification', {
      type: 'basic',
      iconUrl: chrome.extension.getURL("interventions/gmail/time_writing_email/rich_notif_icon.png"),
      title: "Whoa there!",
      message: "You've already spent " + request.timeSpent + " minutes composing this email.",
      requireInteraction: false,
      buttons: [
        { title: 'Close Gmail', iconUrl: chrome.extension.getURL('interventions/gmail/time_writing_email/close_tab.png')},
        { title: 'Dismiss', iconUrl: chrome.extension.getURL('interventions/gmail/time_writing_email/dismiss.png')}
      ]
    }, function callback(id) {      
      myNotifId = id;
    });
  }

});

/*
chrome.runtime.onButtonClicked.addListener(function(message, sender, sendResponse) {
  var b = document.getElementsByClassName('T-I J-J5-Ji T-I-KE L3');
  b.addEventListener('click', function() {  
  });    
});
*/

chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
  if (notifId === myNotifId) {
    if (btnIdx === 0) {
      //Log the action: the user closed the facebook tab
      log_action({'positive': 'User closed Facebook.'})
      closeTab();
      closeNotif(notifId);      
    } else if (btnIdx === 1) {
      //Log the action: the user did not close the facebook tab
      log_action({'negative': 'User remained on Facebook'});
      closeNotif(notifId);
    }
  } 
  
});

function closeTab() {
  chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
    for (let tab of tabs) {
      chrome.tabs.remove(tab.id)
    }
  })
}

function closeNotif(notifId) {
  chrome.notifications.clear(notifId, function callback(wasCleared) {        
  });  
}



window.debugeval = x => eval(x);

