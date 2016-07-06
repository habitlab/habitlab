
  Polymer({
    is: 'ssn-validator',

    behaviors: [
      Polymer.IronValidatorBehavior
    ],

    validate: function(value) {
      // this regex validates incomplete ssn's (by design)
      return !value || value.match(/^[0-9]{0,3}-[0-9]{0,2}-[0-9]{0,4}$/);
    }
  });
