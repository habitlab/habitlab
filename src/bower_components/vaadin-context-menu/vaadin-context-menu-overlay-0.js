
    Polymer({
      is: 'vaadin-context-menu-overlay',

      observers: [
        '_positionChanged(x, y)', '_phoneChanged(phone)'
      ],

      properties: {
        /**
         * Position of the overlay on horizontal axis.
         */
        x: {
          type: Number,
          value: 0
        },

        /**
         * Position of the overlay on vertical axis.
         */
        y: {
          type: Number,
          value: 0
        },

        /**
         * When `true` overlay is optimized for a small touch screen.
         * When `false`, overlay position and size is optimized for a desktop/tablet screen.
         */
        phone: {
          type: Boolean,
          reflectToAttribute: true
        }
      },

      _phoneChanged: function(phone) {
        if (!phone) {
          this.backdropElement.style.opacity = 0;
        }
      },

      // monkey patching iron-overlay-behavior to cancel overriding transform styles.
      _preparePositioning: function() {
        this.style.display = '';
      },

      // monkey patching iron-overlay-behavior to cancel overriding transform styles.
      _finishPositioning: function() {
        this.style.display = '';
      },

      _positionChanged: function(x, y) {
        this.translate3d(x + 'px', y + 'px', 0);
      },

      behaviors: [
        Polymer.IronOverlayBehavior
      ]
    });
  