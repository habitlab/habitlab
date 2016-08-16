const {
  log_impression,
  log_action,
} = require('libs_common/log_utils')


var myNotifId = null;

//Displays a rich notification to the user
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
  if (request.type === "chrome-notification") {
    chrome.notifications.create('chrome-notification', {
      type: 'basic',
      iconUrl: chrome.extension.getURL("interventions/facebook/rich_notifications/rich_notif_icon.png"),
      title: "Whoa there!",
      message: "You've already spent " + request.timeSpent + " minutes on Facebook today.",
      requireInteraction: false,
      buttons: [
        { title: 'Close Facebook', iconUrl: chrome.extension.getURL('interventions/facebook/rich_notifications/close_tab.png')},
        { title: 'Dismiss', iconUrl: chrome.extension.getURL('interventions/facebook/rich_notifications/dismiss.png')}
      ]
    }, function callback(id) {      
      myNotifId = id;
    });
  }

});

chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
  if (notifId === myNotifId) {
    if (btnIdx === 0) {
      //Log the action: the user closed the facebook tab
      log_action('facebook/rich_notifications', {'positive': 'User closed Facebook.'})
      closeTab();
      closeNotif(notifId);      
    } else if (btnIdx === 1) {
      //Log the action: the user did not close the facebook tab
      log_action('facebook/rich_notifications', {'negative': 'User remained on Facebook'});
      closeNotif(notifId);
    }
  } 
  
});

function closeTab() {
    chrome.tabs.getSelected(function(tab) {
    chrome.tabs.remove(tab.id);
  });
}

function closeNotif(notifId) {
  chrome.notifications.clear(notifId, function callback(wasCleared) {        
  });  
}