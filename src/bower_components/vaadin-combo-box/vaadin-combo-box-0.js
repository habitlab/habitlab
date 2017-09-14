
  Polymer({
    is: 'vaadin-combo-box',

    behaviors: [
      Polymer.IronValidatableBehavior,
      vaadin.elements.combobox.ComboBoxBehavior
    ],

    properties: {
      /**
       * The label for this element.
       */
      label: {
        type: String,
        reflectToAttribute: true
      },

      /**
       * Set to true to disable the floating label.
       */
      noLabelFloat: {
        type: Boolean,
        value: false
      },

      /**
       * Set to true to always float the label.
       */
      alwaysFloatLabel: {
        type: Boolean,
        value: false
      },

      /**
       * Set to true to auto-validate the input value.
       */
      autoValidate: {
        type: Boolean,
        value: false
      },

      /**
       * Set to true to disable this input.
       */
      disabled: {
        type: Boolean,
        value: false
      },

      /**
       * Set to true to prevent the user from entering invalid input.
       */
      preventInvalidInput: {
        type: Boolean
      },

      /**
       * Set this to specify the pattern allowed by `preventInvalidInput`.
       */
      allowedPattern: {
        type: String
      },

      /**
       * A pattern to validate the `input` with.
       */
      pattern: {
        type: String
      },

      /**
       * Set to true to mark the input as required.
       */
      required: {
        type: Boolean,
        value: false
      },

      /**
       * The error message to display when the input is invalid.
       */
      errorMessage: {
        type: String
      },

      autofocus: {
        type: Boolean
      },

      inputmode: {
        type: String
      },

      name: {
        type: String
      },

      /**
       * A placeholder string in addition to the label. If this is set, the label will always float.
       */
      placeholder: {
        type: String,
        // need to set a default so _computeAlwaysFloatLabel is run
        value: ''
      },

      readonly: {
        type: Boolean,
        value: false
      },

      size: {
        type: Number
      },

      /**
       * True when the input field has focus.
       */
      focused: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true,
        notify: true
      }
    },

    attributeChanged: function(name, type) {
      // Safari has an issue with repainting shadow root element styles when a host attribute changes.
      // Need this workaround (toggle any inline css property on and off) until the issue gets fixed.
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isSafari && this.root) {
        Array.prototype.forEach.call(this.root.querySelectorAll('*'), function(el) {
          el.style['-webkit-backface-visibility'] = 'visible';
          el.style['-webkit-backface-visibility'] = '';
        });
      }
    },

    ready: function() {
      // 2.0 does not support nested syntax for listeners
      this.$.inputContainer.addEventListener('focused-changed', this._onInputContainerFocusedChanged.bind(this));

      this._setInputElement(this.$.input);
      this._bindableInput = this.$.ironinput;
    },

    attached: function() {
      // Use the default toggle/clear or one replaced in light DOM.
      this._toggleElement = Polymer.dom(this).querySelector('[slot=toggle-button]') || this.$.toggleIcon;
      this._clearElement = Polymer.dom(this).querySelector('[slot=clear-button]') || this.$.clearIcon;
      this._preventInputBlur();
    },

    detached: function() {
      this._restoreInputBlur();
    },

    _computeAlwaysFloatLabel: function(alwaysFloatLabel, placeholder) {
      return placeholder || alwaysFloatLabel;
    },

    _getPositionTarget: function() {
      return this.$.inputContainer;
    },

    _getAriaExpanded: function(value) {
      return value.toString();
    },

    /**
     * Sets focus on the input field.
     */
    focus: function() {
      this.inputElement.focus();
    },

    /**
     * Removes focus from the input field.
     */
    blur: function() {
      this.inputElement.blur();
    },

    _onInputContainerFocusedChanged: function(e) {
      this._setFocused(e.detail.value);
    }
  });

