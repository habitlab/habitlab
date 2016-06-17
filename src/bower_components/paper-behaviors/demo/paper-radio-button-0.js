

    Polymer({

      behaviors: [
        Polymer.PaperCheckedElementBehavior
      ],

      hostAttributes: {
        role: 'radio'
      },

      ready: function() {
        this.toggles = true;
      },

      _createRipple: function() {
        this._rippleContainer = this.$.radioContainer;
        return Polymer.PaperInkyFocusBehaviorImpl._createRipple.call(this);
      }

    });

  