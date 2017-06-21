Polymer({
  is: 'sidebar-suggestions-removed',
  properties: {
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed'
    },
    domain: {
      type: String,
      value: (function() {
        if (window.location.protocol == 'chrome-extension:')
          return 'www.iqiyi.com'
        else
          return window.location.host
      })()
    },
    sitename_printable: {
      type: String,
      value: 'Iqiyi'
    }
  },
  show_sidebar_button_clicked: function(evt) {
    this.fire('show_sidebar_clicked', {})
    console.log('show sidebar button was clicked')
  },
  isdemo_changed: function(isdemo) {
    console.log('isdemo_changed called')
    console.log(isdemo)
    if (isdemo) {
      this.style.height = '410px';
      this.style.width = '680px';
    }
  }
})
