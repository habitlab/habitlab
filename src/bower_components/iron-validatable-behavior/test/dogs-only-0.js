

  Polymer({

    is: 'dogs-only',

    behaviors: [
      Polymer.IronValidatorBehavior
    ],

    validate: function(value) {
      return value === 'dogs';
    }

  });

