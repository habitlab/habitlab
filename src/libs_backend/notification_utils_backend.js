let notification_id_to_notification = {};

async function make_notification_backend(info, tab_id) {
  let title = info.title;
  if (title) {
    delete info.title;
  }
  let notification = new Notification(title, info);
  let notification_id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  notification_id_to_notification[notification_id] = notification;
  if (typeof tab_id !== "undefined" && tab_id !== null) {
    notification_onclick_backend(notification_id, function() {
      chrome.tabs.sendMessage(tab_id, {
        type: 'notification_onclick',
        data: {notification_id: notification_id}
      });
    });
  }
  return notification_id;
}

function notification_onclick_backend(notification_id, callback) {
  let notification = notification_id_to_notification[notification_id];
  notification.onclick = callback;
}

function close_notification_backend(notification_id) {
  let notification = notification_id_to_notification[notification_id];
  let close_notification_func = notification.close.bind(notification);
  close_notification_func();
  delete notification_id_to_notification[notification_id];
}

module.exports = {
  make_notification_backend,
  notification_onclick_backend,
  close_notification_backend
}