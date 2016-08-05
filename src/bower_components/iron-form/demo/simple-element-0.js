

  Polymer({

    is: 'simple-element',

    behaviors: [
      Polymer.IronFormElementBehavior,
      Polymer.IronValidatableBehavior
    ],

    listeners: {
      'input': '_onInput'
    },

    _onInput: function() {
      this.value = this.$.input.value;
    },

    // Overidden from Polymer.IronValidatableBehavior. Will set the `invalid`
    // attribute automatically, which should be used for styling.
    _getValidity: function() {
      return !!this.value;
    }

  });

