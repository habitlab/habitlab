
    Polymer({
      is: 'paper-checkbox',

      behaviors: [
        Polymer.PaperCheckedElementBehavior
      ],

      hostAttributes: {
        role: 'checkbox',
        'aria-checked': false,
        tabindex: 0
      },

      properties: {
        /**
         * Fired when the checked state changes due to user interaction.
         *
         * @event change
         */

        /**
         * Fired when the checked state changes.
         *
         * @event iron-change
         */
        ariaActiveAttribute: {
          type: String,
          value: 'aria-checked'
        }
      },

      attached: function() {
        // Wait until styles have resolved to check for the default sentinel.
        // See polymer#4009 for more details.
        Polymer.RenderStatus.afterNextRender(this, function() {
          var inkSize = this.getComputedStyleValue('--calculated-paper-checkbox-ink-size').trim();
          // If unset, compute and set the default `--paper-checkbox-ink-size`.
          if (inkSize === '-1px') {
            var checkboxSizeText = this.getComputedStyleValue('--calculated-paper-checkbox-size').trim();

            var units = checkboxSizeText.match(/[A-Za-z]+$/)[0] || 'px';
            var checkboxSize = parseFloat(checkboxSizeText, 10);
            var defaultInkSize = (8 / 3) * checkboxSize;

            if (units === 'px') {
              defaultInkSize = Math.floor(defaultInkSize);

              // The checkbox and ripple need to have the same parity so that their
              // centers align.
              if (defaultInkSize % 2 !== checkboxSize % 2) {
                defaultInkSize++;
              }
            }

            this.updateStyles({
              '--paper-checkbox-ink-size': defaultInkSize + units,
            });
          }
        });
      },

      _computeCheckboxClass: function(checked, invalid) {
        var className = '';
        if (checked) {
          className += 'checked ';
        }
        if (invalid) {
          className += 'invalid';
        }
        return className;
      },

      _computeCheckmarkClass: function(checked) {
        return checked ? '' : 'hidden';
      },

      // create ripple inside the checkboxContainer
      _createRipple: function() {
        this._rippleContainer = this.$.checkboxContainer;
        return Polymer.PaperInkyFocusBehaviorImpl._createRipple.call(this);
      }

    });
  