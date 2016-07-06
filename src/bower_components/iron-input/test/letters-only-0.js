

  Polymer({

    is: 'letters-only',

    behaviors: [
      Polymer.IronValidatorBehavior
    ],

    validate: function(value) {
      return !value || value.match(/^[a-zA-Z]*$/) !== null;
    }

  });

