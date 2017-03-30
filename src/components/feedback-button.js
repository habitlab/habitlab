const {polymer_ext} = require('libs_frontend/polymer_utils');
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
    text: {
      type: String,
      value: 'Feedback',
    },
  },
  feedback_button_clicked: async function() {
    //var screenshot_utils = await SystemJS.import('libs_common/screenshot_utils');
    var screenshot = await screenshot_utils.get_screenshot_as_base64();
    var data = await screenshot_utils.get_data_for_feedback();
    var feedback_form = document.createElement('feedback-form')
    document.body.appendChild(feedback_form);
    feedback_form.screenshot = screenshot;
    feedback_form.other = data;
    feedback_form.open();
  },
});
