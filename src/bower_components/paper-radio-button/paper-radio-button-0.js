
    Polymer({
      is: 'paper-radio-button',

      behaviors: [
        Polymer.PaperCheckedElementBehavior
      ],

      hostAttributes: {
        role: 'radio',
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

      ready: function() {
        this._rippleContainer = this.$.radioContainer;
      },

      attached: function() {
        // Wait until styles have resolved to check for the default sentinel.
        // See polymer#4009 for more details.
        Polymer.RenderStatus.afterNextRender(this, function() {
          var inkSize = this.getComputedStyleValue('--calculated-paper-radio-button-ink-size').trim();
          // If unset, compute and set the default `--paper-radio-button-ink-size`.
          if (inkSize === '-1px') {
            var size = parseFloat(this.getComputedStyleValue('--calculated-paper-radio-button-size').trim());
            var defaultInkSize = Math.floor(3 * size);

            // The button and ripple need to have the same parity so that their
            // centers align.
            if (defaultInkSize % 2 !== size % 2) {
              defaultInkSize++;
            }

            this.updateStyles({
              '--paper-radio-button-ink-size': defaultInkSize + 'px',
            });
          }
        });
      },
    })
  