Polymer({
  is: 'toast-test-widget',
  ready: function() {
    console.log('toast-test-widget ready')
    this.$.sample_toast.show()
  }
})