const {polymer_ext} = require('libs_frontend/polymer_utils');
const {cfy} = require('cfy');
const _ = require('underscore');

polymer_ext({
  is: 'feedback-form',
  properties: {
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed'
    },
    submit_to_github: {
      type: Boolean,
      value: true
    },
    submit_to_gitter: {
      type: Boolean,
      value: true
    },
    submit_screenshot: {
      type: Boolean,
      value: true
    },
    mailing_list: {
      type: String,
      value: [['habitlab', 'support'].join('-'), ['cs', 'stanford', 'edu'].join('.')].join('@')
    },
    feedback: {
      type: String,
      value: ''
    },
    email: {
      type: String,
      value: ''
    }
  },
  isdemo_changed: function() {
    if (this.isdemo) {
      this.open();
    }
  },
  textarea_changed: _.throttle(function() {
    this.$$('#feedback_dialog').notifyResize();
  }, 300),
  feedback_button_clicked: cfy(function*() {
    var screenshot_utils = yield SystemJS.import('libs_common/screenshot_utils');
    var screenshot = yield screenshot_utils.get_screenshot_as_base64();
  }),
  open: function() {
    this.$$('#feedback_dialog').open();
  }
});
