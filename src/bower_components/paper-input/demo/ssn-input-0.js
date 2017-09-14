
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
          type: String,
          value: ''
        },

        _ssn2: {
          type: String,
          value: ''
        },

        _ssn3: {
          type: String,
          value: ''
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
      },

      beforeRegister: function() {
        var template = Polymer.DomModule.import('ssn-input', 'template');
        var version = Polymer.Element ? 'v1' : 'v0';
        var inputTemplate = Polymer.DomModule.import('ssn-input', 'template#' + version);
        var inputPlaceholder = template.content.querySelector('#template-placeholder');
        inputPlaceholder.parentNode.replaceChild(inputTemplate.content, inputPlaceholder);
      },
    });
  