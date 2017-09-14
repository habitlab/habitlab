
  (function() {

    Polymer({

      is: 'test-overlay',

      properties: {
        animated: {
          type: Boolean,
          reflectToAttribute: true
        }
      },

      behaviors: [
        Polymer.IronOverlayBehavior
      ],

      listeners: {
        'transitionend': '__onTransitionEnd'
      },

      _renderOpened: function() {
        if (this.animated) {
          if (this.withBackdrop) {
            this.backdropElement.open();
          }
          this.classList.add('opened');
          this.fire('simple-overlay-open-animation-start');
        } else {
          Polymer.IronOverlayBehaviorImpl._renderOpened.apply(this, arguments);
        }
      },

      _renderClosed: function() {
        if (this.animated) {
          if (this.withBackdrop) {
            this.backdropElement.close();
          }
          this.classList.remove('opened');
          this.fire('simple-overlay-close-animation-start');
        } else {
          Polymer.IronOverlayBehaviorImpl._renderClosed.apply(this, arguments);
        }
      },

      __onTransitionEnd: function(e) {
        if (e && e.target === this) {
          if (this.opened) {
            this._finishRenderOpened();
          } else {
            this._finishRenderClosed();
          }
        }
      },

    });

  })();
