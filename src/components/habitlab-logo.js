const {polymer_ext} = require('libs_frontend/polymer_utils');
const {cfy} = require('cfy');

polymer_ext({
  is: 'habitlab-logo',
  properties: {
    width: {
      type: String,
      value: '40px',
    },
    height: {
      type: String,
      value: '40px',
    },
    unclickable: {
      type: Boolean,
      value: false
    },
  },
  get_img_style: function() {
    return `width: ${this.width}; height: ${this.height};`
  },
  ready: function() {
    if (this.unclickable) {
      this.style.cursor = "default";
    }
    SystemJS.import('libs_common/screenshot_utils');
  },
  habitlab_button_clicked: cfy(function*() {
    var screenshot_utils = yield SystemJS.import('libs_common/screenshot_utils');
    var screenshot = yield screenshot_utils.get_screenshot_as_base64();
    const habitlab_options_popup = document.createElement('habitlab-options-popup');
    habitlab_options_popup.screenshot = screenshot;
    document.body.appendChild(habitlab_options_popup);
    habitlab_options_popup.open();
  }),
  get_url: function() {
    return chrome.extension.getURL('icons/habitlab_gear_with_text.svg');
  },
});
