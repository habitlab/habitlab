const {
  show_toast
} = require('libs_frontend/toast_utils')

Polymer({
  is: 'toast-test-widget',
  ready: function() {
    /*
    let self = this
    //console.log('toast-test-widget ready')
    this.$.sample_toast.show()
    this.$.sample_toast_close_button.addEventListener('click', function() {
      self.$.sample_toast.hide()
    })
    */
    show_toast('foobar')
  }
})
