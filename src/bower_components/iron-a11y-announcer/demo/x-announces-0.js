
    Polymer({
      is: 'x-announces',

      attached: function() {
        Polymer.IronA11yAnnouncer.requestAvailability();
      },

      _onTapAnnounce: function() {
        this.fire('iron-announce', {
          text: this.$.content.textContent.trim()
        }, {
          bubbles: true
        });
      }
    });
  