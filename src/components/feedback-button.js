const {polymer_ext} = require('libs_frontend/polymer_utils');
const {cfy} = require('cfy');
const screenshot_utils = require('libs_common/screenshot_utils');

polymer_ext({
  is: 'feedback-button',
  properties: {
    width: {
      type: String,
      value: '38px',
    },
    height: {
      type: String,
      value: '38px',
    },
  },
  get_img_style: function() {
    return `width: ${this.width}; height: ${this.height};`
  },
  feedback_button_clicked: cfy(function*() {
    //var screenshot_utils = yield SystemJS.import('libs_common/screenshot_utils');
    var screenshot = yield screenshot_utils.get_screenshot_as_base64();
    var data = yield screenshot_utils.get_data_for_feedback();
    var feedback_form = document.createElement('feedback-form')
    document.body.appendChild(feedback_form);
    feedback_form.screenshot = screenshot;
    feedback_form.other = data;
    feedback_form.open();
    /*
    SystemJS.import('bugmuncher/bugmuncher').then(function() {
      window.open_bugmuncher()
    })
    */
  }),
  get_url: function() {
    return chrome.extension.getURL('icons/feedback_icon.svg');
  },
});
