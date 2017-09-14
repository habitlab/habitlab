
  Polymer({
    is: 'vaadin-combo-box-light',

    behaviors: [
      Polymer.IronA11yKeysBehavior,
      vaadin.elements.combobox.ComboBoxBehavior
    ],

    properties: {
      /**
       * Name of the two-way data-bindable property representing the
       * value of the custom input field.
       */
      attrForValue: {
        type: String,
        value: 'bind-value'
      },

      /**
       * Number of pixels used as the vertical offset in positioning of
       * the dropdown.
       */
      overlayVerticalOffset: {
        type: Number,
        value: 0
      }
    },

    attached: function() {
      this._setInputElement(Polymer.dom(this).querySelector('input[is="iron-input"],paper-input,.paper-input-input,.input'));
      this._toggleElement = Polymer.dom(this).querySelector('.toggle-button');
      this._clearElement = Polymer.dom(this).querySelector('.clear-button');

      this._revertInputValue();
      this.listen(this.inputElement, 'input', '_inputValueChanged');
      this.listen(this.inputElement, 'blur', '_onBlur');
      this._preventInputBlur();
    },

    detached: function() {
      this.unlisten(this.inputElement, 'input', '_inputValueChanged');
      this.unlisten(this.inputElement, 'blur', '_onBlur');
      this._restoreInputBlur();
    },

    get _propertyForValue() {
      return Polymer.CaseMap.dashToCamelCase(this.attrForValue);
    },

    get _inputElementValue() {
      return this.inputElement && this.inputElement[this._propertyForValue];
    },

    set _inputElementValue(value) {
      if (this.inputElement) {
        this.inputElement[this._propertyForValue] = value;
      }
    }
  });
