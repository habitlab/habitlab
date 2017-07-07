
    Polymer({
      is: 'vaadin-date-picker',

      behaviors: [
        vaadin.elements.datepicker.DatePickerBehavior
      ],

      properties: {
        /**
         * Set to true to auto-validate the input value.
         */
        autoValidate: {
          type: Boolean,
          value: false
        },

        /**
         * Set to true to disable this element.
         */
        disabled: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        },

        /**
         * Set to true to make this element read-only.
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        },

        /**
         * A placeholder string in addition to the label. If this is set, the label will always float.
         */
        placeholder: String,

        /**
         * The error message to display when the input is invalid.
         */
        errorMessage: String,

        _userInputValue: String
      },

      observers: [
        '_userInputValueChanged(_userInputValue)'
      ],

      // TODO: revisit this in order to use validatable-behavior for both the full and
      // the light component. Consider auto-validate, and validate(value) signature.
      /**
       * Override the IronValidatableBehavior._getValidity implementation, replacing
       * it with the iron-input validation.
       */
      _getValidity: function() {
        var inputValid = !this._inputValue || (this._selectedDate && this._inputValue === this.i18n.formatDate(this._selectedDate));
        var minMaxValid = !this._selectedDate ||
            vaadin.elements.datepicker.DatePickerHelper._dateAllowed(this._selectedDate, this._minDate, this._maxDate);
        return this.inputElement.validate() && inputValid && minMaxValid;
      },

      _clear: function(e) {
        e.stopPropagation();
        this.value = '';
        this.close();
      },

      _toggle: function(e) {
        e.stopPropagation();
        this[this.$.dropdown.opened ? 'close' : 'open']();
      },

      _input: function() {
        return this.$.input;
      },

      /**
       * label and placeholder will go on top of each other if always-float-label isn't set
       * This is the similar behavior as paper-input has:
       * PolymerElements/paper-input/blob/d248dad17af3ee46a0701a664e0f304c1619770d/paper-input-behavior.html#L502
       */
      _computeAlwaysFloatLabel: function(placeholder) {
        return Boolean(placeholder);
      },

      set _inputValue(value) {
        this.inputElement.bindValue = value;
      },

      get _inputValue() {
        return this.inputElement.bindValue;
      },

      _getAriaExpanded: function(opened) {
        return Boolean(opened).toString();
      }
    });
  