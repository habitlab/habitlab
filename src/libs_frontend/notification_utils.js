const {
  make_notification_backend,
  close_notification_backend
} = require('libs_common/notification_utils_backend');

const {
  get_tab_id
} = require('libs_common/intervention_info');

async function make_notification(info) {
  let tab_id = get_tab_id();
  return await make_notification_backend(info, tab_id);
}

let notification_id_to_callback = {};
let notification_listener_active = false;

function notification_onclick(notification_id, callback) {
  notification_id_to_callback[notification_id] = callback;
  if (!notification_listener_active) {
    notification_listener_active = true;
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      let {type, data} = request;
      if (type == 'notification_onclick' && data && data.notification_id) {
        if (notification_id_to_callback[data.notification_id]) {
          notification_id_to_callback[data.notification_id]();
        }
      }
    });
  }
}

let close_notification = close_notification_backend;

module.exports = {
  make_notification: make_notification,
  close_notification: close_notification,
  notification_onclick: notification_onclick,
}