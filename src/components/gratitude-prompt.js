const {polymer_ext} = require('libs_frontend/polymer_utils');

polymer_ext({
  is: 'gratitude-prompt',
  doc: 'Asks for one thing you are grateful for, and saves it for future reference',
  properties: {
    gratitude_entry: {
      type: String,
      value: ''
    }
  },
  input_keyup: function(evt) {
    if (evt.keyCode == 13) {
      this.submit()
    }
  },
  // ok_clicked: function(evt) {
  //   this.submit()
  // },
  submit: function() {
    console.log(this.gratitude_entry)
  },
  // submitIsDisabled: function() {
  //   return this.gratitude_entry.length === 0
  // }
})
