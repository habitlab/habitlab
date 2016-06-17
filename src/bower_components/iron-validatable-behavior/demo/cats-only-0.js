

  Polymer({

    is: 'cats-only',

    behaviors: [
      Polymer.IronValidatorBehavior
    ],

    validateObject: function(obj) {
      var valid = true;
      for (key in obj) {
        if (obj[key] !== 'cats') {
          valid = false;
          break;
        }
      }
      return valid;
    },

    validate: function(values) {
      if (typeof values === 'object') {
        return this.validateObject(values);
      } else {
        var value = Array.isArray(values) ? values.join('') : values;
        return value.match(/^(c|ca|cat|cats)?$/) !== null;
      }
    }

  });

