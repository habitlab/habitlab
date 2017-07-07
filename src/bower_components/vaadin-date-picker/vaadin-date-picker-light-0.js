
    Polymer({
      is: 'vaadin-date-picker-light',

      behaviors: [
        vaadin.elements.datepicker.DatePickerBehavior
      ],

      properties: {
        /**
         * Name of the two-way data-bindable property representing the
         * value of the custom input field.
         */
        attrForValue: {
          type: String,
          value: 'bind-value'
        }
      },

      listeners: {
        'input': '_userInputValueChanged'
      },

      _input: function() {
        // Using the same selector than in combo-box.
        // TODO: revisit this to decide the selector and document conveniently.
        return Polymer.dom(this).querySelector('input[is="iron-input"],paper-input,.paper-input-input,.input');
      },

      set _inputValue(value) {
        if (this.inputElement) {
          this.inputElement[Polymer.CaseMap.dashToCamelCase(this.attrForValue)] = value;
        }
      },

      get _inputValue() {
        return this.inputElement && this.inputElement[Polymer.CaseMap.dashToCamelCase(this.attrForValue)];
      }
    });
  