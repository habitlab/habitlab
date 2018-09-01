const {polymer_ext} = require('libs_frontend/polymer_utils');
const _ = require('underscore');
const ajax_utils = require('libs_common/ajax_utils');
const {escape_as_html} = require('libs_common/html_utils')

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
    },
    other: {
      type: Object,
      value: {}
    }
  },
  isdemo_changed: function() {
    if (this.isdemo) {
      this.open();
    }
  },
  textarea_keydown: function(evt) {
    evt.stopImmediatePropagation();
    this.textarea_changed();
  },
  textarea_keyup: function(evt) {
    evt.stopImmediatePropagation();
  },
  textarea_keypress: function(evt) {
    evt.stopImmediatePropagation();
  },
  textarea_changed: _.throttle(function() {
    this.$$('#feedback_dialog').notifyResize();
    this.save_feedback();
  }, 300),
  save_feedback: _.throttle(function() {
    localStorage.setItem('feedback_form_feedback', this.feedback);
  }, 1000),
  email_changed_keydown: function(evt) {
    evt.stopImmediatePropagation();
    this.save_email()
  },
  email_changed_keyup: function(evt) {
    evt.stopImmediatePropagation();
  },
  email_changed_keypress: function(evt) {
    evt.stopImmediatePropagation();
  },

  save_email: _.throttle(function() {
    localStorage.setItem('feedback_form_email', this.email);
  }, 1000),
  open: function() {
    let self = this
    var saved_feedback = localStorage.getItem('feedback_form_feedback');
    if (saved_feedback && saved_feedback.length > 0) {
      this.feedback = saved_feedback;
    }
    var saved_email = localStorage.getItem('feedback_form_email');
    if (saved_email && saved_email.length > 0) {
      this.email = saved_email;
    }
    let dialog = this.$$('#feedback_dialog')
    dialog.open();
    // setTimeout(function() {
    //   const {make_checkbox_clickable} = require('libs_frontend/frontend_libs');
    //   for (let x of dialog.querySelectorAll('paper-checkbox')) {
    //     make_checkbox_clickable(x)
    //   }
    // }, 1000)
  },
  submit_feedback: async function() {
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
    data.other = this.other;
    this.$$('#feedback_dialog').close();
    this.$$('#submitting_wait_dialog').open();
    try {
      var response = await ajax_utils.post_json('https://habitlab-reportbug.herokuapp.com/report_bug', data)
      this.wait_dialog_html = `
        <h2>Thanks for your feedback!</h2>
        <div>
        ${response.message}
        </div>
      `;
      this.$$('#submitting_wait_dialog').notifyResize();
    } catch (err) {
      var message_html = escape_as_html(data.message)
      this.wait_dialog_html = `
        <h2>Sorry, our server is having issues</h2>
        <div>
        Could you please email your feedback to us at <a href="mailto:${this.mailing_list}" target="_blank">${this.mailing_list}</a><br><br>
        ${message_html}
        </div>
      `;
      this.$$('#submitting_wait_dialog').notifyResize();
    }
  }
});
