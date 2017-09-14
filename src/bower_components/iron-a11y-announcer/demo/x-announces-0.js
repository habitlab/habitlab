
    Polymer({
      is: 'x-announces',

      hostAttributes: {
        'aria-hidden': 'true'
      },

      properties: {
        message: {
          type: String
        }
      },

      attached: function() {
        Polymer.IronA11yAnnouncer.requestAvailability();
      },

      _onTapAnnounce: function() {
        this.fire('iron-announce', {
          text: this.message.trim()
        }, {
          bubbles: true
        });
      }
    });
  