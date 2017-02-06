const {polymer_ext} = require('libs_frontend/polymer_utils');
const {cfy} = require('cfy');
const _ = require('underscore');
const ajax_utils = require('libs_common/ajax_utils');
const $ = require('jquery');

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
    },
    screenshot: {
      type: String,
      value: null
    },
    wait_dialog_html: {
      type: String,
      value: `
        <h2>Submitting feedback</h2>
        <div>Please wait</div>
      `
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
  },
  submit_feedback: cfy(function*() {
    var data = {
      message: this.feedback
    };
    if (this.submit_screenshot) {
      data.screenshot = this.screenshot;
    }
    if (this.submit_to_gitter) {
      data.gitter = true;
    }
    if (this.submit_to_github) {
      data.github = true;
    }
    if (this.email && this.email.length > 0) {
      data.email = this.email;
    }
    data.other = {};
    this.$$('#feedback_dialog').close();
    this.$$('#submitting_wait_dialog').open();
    try {
      var response = yield ajax_utils.ajax({
        type: 'POST',
        url: 'http://habitlab-reportbug.herokuapp.com/report_bug',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data)
      });
      this.wait_dialog_html = `
        <h2>Thanks for your feedback!</h2>
        <div>
        ${response.message}
        </div>
      `;
      this.$$('#submitting_wait_dialog').notifyResize();
    } catch (err) {
      var message_html = $('<span>').text(data.message).html().split('\n').join('<br>');
      this.wait_dialog_html = `
        <h2>Sorry, our server is having issues</h2>
        <div>
        Could you please email your feedback to us at <a href="mailto:${this.mailing_list}" target="_blank">${this.mailing_list}</a><br><br>
        ${message_html}
        </div>
      `;
      this.$$('#submitting_wait_dialog').notifyResize();
    }
  })
});
