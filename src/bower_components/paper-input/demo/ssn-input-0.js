
  Polymer({
    is: 'ssn-input',

    behaviors: [
      Polymer.IronValidatableBehavior
    ],

    properties: {
      value: {
        notify: true,
        type: String
      },

      _ssn1: {
        type: String
      },

      _ssn2: {
        type: String
      },

      _ssn3: {
        type: String
      },

      validator: {
        type: String,
        value: 'ssn-validator'
      }
    },

    observers: [
      '_computeValue(_ssn1,_ssn2,_ssn3)'
    ],

    _computeValue: function(ssn1, ssn2, ssn3) {
      this.value = ssn1.trim() + '-' + ssn2.trim() + '-' + ssn3.trim();
    }
  });
