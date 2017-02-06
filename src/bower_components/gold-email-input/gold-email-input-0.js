
  (function() {
    Polymer({

      is: 'gold-email-input',

      behaviors: [
        Polymer.PaperInputBehavior,
        Polymer.IronFormElementBehavior
      ],

      properties: {
        /**
         * The label for this input.
         */
        label: {
          type: String,
          value: "Email"
        },

        /**
         * The regular expression used to validate the email. By default, the
         * input is of type=email and uses the native input regex, as defined in
         * the spec: http://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single.
         * You can override this if you want your email to be validated against
         * a custom regex. If the empty string, then no validation will be applied.
         */
        regex: {
          type: String,
          value: null
        },

        value: {
          type: String,
          observer: '_onValueChanged'
        }
      },

      observers: [
        '_onFocusedChanged(focused)'
      ],

      ready: function() {
        // If there's an initial input, validate it.
        if (this.value)
          this._handleAutoValidate();
      },

      /**
       * A handler that is called on input
       */
      _onValueChanged: function(value, oldValue) {
        // The initial property assignment is handled by `ready`.
        if (oldValue == undefined)
          return;

        this._handleAutoValidate();
      },

      /**
       * Returns true if the element has a valid value, and sets the visual error
       * state.
       *
       * @return {boolean} Whether the input is currently valid or not.
       */
      validate: function() {

        var valid;

        // Empty, non-required input is valid.
        if (!this.required && this.value == '') {
          valid = true;
        } else if (this.regex === null) {
          // If the regex isn't set, then use the native validator.
          valid = this.$.input.validate();
        } else {
          // A blank regex means everything is valid. Else, check value against regex.
          valid = new RegExp(this.regex, "i").test(this.value);
        }

        // Check if validity has changed
        if (valid == this.invalid) {
          // Update `this.invalid` since it's data-bound to container
          this.invalid = !valid;

          // Update container's addons (i.e. the custom error-message).
          this.$.container.updateAddons({
            inputElement: this.$.input,
            value: this.value,
            invalid: !valid
          });
        }

        return valid;
      },

      /**
       * Overidden from Polymer.IronControlState.
       */
      _onFocusedChanged: function(focused) {
        if (!focused) {
          this._handleAutoValidate();
        }
      }
    })

  })();

  