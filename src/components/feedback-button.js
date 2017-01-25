const {polymer_ext} = require('libs_frontend/polymer_utils');

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
  feedback_button_clicked: function() {
    SystemJS.import('bugmuncher/bugmuncher').then(function() {
      window.open_bugmuncher()
    })
  },
  get_url: function() {
    return chrome.extension.getURL('icons/feedback_icon.svg');
  },
});
