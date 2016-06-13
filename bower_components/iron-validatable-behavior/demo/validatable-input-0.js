

  Polymer({

    is: 'validatable-input',

    extends: 'input',

    properties: {

      invalid: {
        notify: true,
        type: Boolean,
        value: false
      }

    },

    behaviors: [
      Polymer.IronValidatableBehavior
    ],

    listeners: {
      'input': '_onInput'
    },

    _onInput: function(event) {
      this.invalid = !this.validate(event.target.value);
    }

  });

