//Displays a rich notification to the user
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "chrome-notification") {
    console.log("It's this kind of notification!");
    console.log("Inserting notif...")
    chrome.notifications.create('chrome-notification', {
      type: 'basic',
      iconUrl: chrome.extension.getURL("interventions/facebook/rich_notifications/rich_notif_icon.png"),
      title: "Stop going on facebook!",
      message: "Really.",
      buttons: [
        { title: 'Mark' },
        { title: 'Ignore' }
      ]
    }, function callback(notificationId) {      
    });
  }
});