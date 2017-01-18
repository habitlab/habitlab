const {polymer_ext} = require('libs_frontend/polymer_utils');

polymer_ext({
  is: 'feedback-button-right',
  properties: {
    width: {
      type: String,
      value: '38px',
    },
    height: {
      type: String,
      value: '38px',
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
  },
  habitlab_button_clicked: function() {
    //const habitlab_options_popup = document.createElement('habitlab-options-popup')
    //document.body.appendChild(habitlab_options_popup)
    //habitlab_options_popup.open()
    System.import('bugmuncher/bugmuncher').then(function() {
      window.open_bugmuncher()
    })
  },
  get_url: function() {
    return chrome.extension.getURL('icons/feedback_icon.svg');
  },
});
