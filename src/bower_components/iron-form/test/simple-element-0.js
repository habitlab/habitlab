

  Polymer({

    is: 'simple-element',

    behaviors: [
      Polymer.IronFormElementBehavior
    ],

    properties: {
      invalid: {
        type: Boolean,
        value: false
      }
    },

    validate: function() {
      var valid = this.value ? this.value != '' : false;
      this.invalid = !valid;
      return valid;
    }

  });

