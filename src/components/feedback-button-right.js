const {polymer_ext} = require('libs_frontend/polymer_utils');

polymer_ext({
  is: 'feedback-button-right',
  feedback_button_clicked: function() {
    System.import('bugmuncher/bugmuncher').then(function() {
      window.open_bugmuncher()
    })
  },
});
