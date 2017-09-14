
    Polymer({
      is: 'validatable-input',
      properties: {
        invalid: {
          reflectToAttribute: true,
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

      _onInput: function() {
        this.invalid = !this.validate(this.$.input.value);
      }
    });
  