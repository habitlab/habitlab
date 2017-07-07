
    Polymer({
      is: 'vaadin-device-detector',

      properties: {
        /*
         * `true`, when running in a phone.
         */
        phone: {
          type: Boolean,
          computed: '_phone(wide, touch)',
          notify: true
        },

        /*
         * `true`, when running in a touch device.
         * @default false
         */
        touch: {
          type: Boolean,
          notify: true,
          value: function() {
            try {
              document.createEvent('TouchEvent');
              return true;
            } catch (err) {
              return false;
            }
          }
        },

        /*
         * `true`, when running in a tablet/desktop device.
         */
        wide: {
          type: Boolean,
          notify: true
        }
      },

      _phone: function(wide, touch) {
        return !wide && touch;
      }
    });
  