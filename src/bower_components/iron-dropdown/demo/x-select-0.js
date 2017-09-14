
    Polymer({
      is: 'x-select',

      properties: {
        verticalAlign: String,
        horizontalAlign: String,
        disabled: Boolean,
        openAnimationConfig: {
          type: Array,
          value: function() {
            return [{
              name: 'fade-in-animation',
              timing: {
                delay: 150,
                duration: 50
              }
            }, {
              name: 'expand-animation',
              timing: {
                delay: 150,
                duration: 200
              }
            }];
          }
        },

        closeAnimationConfig: {
          type: Array,
          value: function() {
            return [{
              name: 'fade-out-animation',
              timing: {
                duration: 200
              }
            }];
          }
        }
      },

      open: function() {
        this.$.dropdown.open();
      }
    });
  