
  Polymer({
    is: 'cats-only',

    behaviors: [
      Polymer.IronValidatorBehavior
    ],

    validate: function(value) {
      return value === 'cat'
    }
  });
