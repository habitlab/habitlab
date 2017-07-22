const {
  make_notification_backend,
  close_notification_backend
} = require('libs_common/notification_utils_backend')

const {
  get_tab_id
} = require('libs_common/intervention_info')

/**
 * Creates a notification and returns the notification id
 * @param {Object} info - info for creating the notification
 * @param {string} info.title - title for the notification
 * @param {string} info.icon - path to the icon for the notification
 * @param {string} info.body - body of the notification message
 * @return {Promise.<number>} notification id of the created notification
 */
async function make_notification(info) {
  let tab_id = get_tab_id();
  return await make_notification_backend(info, tab_id);
}

let notification_id_to_callback = {};
let notification_listener_active = false;

/**
 * Adds a callback that should be called when the notification is clicked
 * @param {number} notification_id - The notification id that the callback should be attached to
 * @param {function} callback - Callback that will be called when the notification is clicked
 */
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

/**
 * Closes the notification with the specified id
 * @name close_notification
 * @function
 * @param {number} notification_id - Notification id of the notification to close
*/

module.exports = {
  make_notification,
  notification_onclick,
  close_notification: close_notification_backend
}