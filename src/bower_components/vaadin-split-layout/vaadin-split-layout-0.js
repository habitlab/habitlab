
    Polymer({

      is: 'vaadin-split-layout',

      behaviors: [
        Polymer.IronResizableBehavior
      ],

      properties: {
        /**
         * Change the split layout to vertical
         */
        vertical: {
          type: Boolean,
          reflectToAttribute: true,
          value: false
        },

        _previousPrimaryPointerEvents: String,
        _previousSecondaryPointerEvents: String
      },

      attached: function() {
        this._observer = Polymer.dom(this).observeNodes(this._processChildren);
      },

      detached: function() {
        Polymer.dom(this).unobserveNodes(this._observer);
      },

      _processChildren: function() {
        var children = this.getEffectiveChildren();
        children.filter(function(child) {
          if (child.classList.contains('splitter-handle')) {
            Polymer.dom(child).setAttribute('slot', 'handle');
            return false;
          }
          return true;
        }).forEach(function(child, i) {
          if (i === 0) {
            this._primaryChild = child;
            Polymer.dom(child).setAttribute('slot', 'primary');
          } else if (i == 1) {
            this._secondaryChild = child;
            Polymer.dom(child).setAttribute('slot', 'secondary');
          } else {
            Polymer.dom(child).removeAttribute('slot');
          }
        }.bind(this));
      },

      _setFlexBasis: function(element, flexBasis, containerSize) {
        flexBasis = Math.max(0, Math.min(flexBasis, containerSize));
        if (flexBasis === 0) {
          // Pure zero does not play well in Safari
          flexBasis = 0.000001;
        }
        element.style.flex = '1 1 ' + flexBasis + 'px';
      },

      _onHandleTrack: function(event) {
        if (!this._primaryChild || !this._secondaryChild) {
          return;
        }

        var size = this.vertical ? 'height' : 'width';
        if (event.detail.state === 'start') {
          this._startSize = {
            container: this.getBoundingClientRect()[size] - this.$.splitter.getBoundingClientRect()[size],
            primary: this._primaryChild.getBoundingClientRect()[size],
            secondary: this._secondaryChild.getBoundingClientRect()[size]
          };

          this._previousPrimaryPointerEvents = this._primaryChild.style.pointerEvents;
          this._previousSecondaryPointerEvents = this._secondaryChild.style.pointerEvents;
          this._primaryChild.style.pointerEvents = 'none';
          this._secondaryChild.style.pointerEvents = 'none';
          return;
        }

        var distance = this.vertical ? event.detail.dy : event.detail.dx;
        this._setFlexBasis(this._primaryChild, this._startSize.primary + distance, this._startSize.container);
        this._setFlexBasis(this._secondaryChild, this._startSize.secondary - distance, this._startSize.container);

        this.notifyResize();

        if (event.detail.state === 'end') {
          delete this._startSize;

          this._primaryChild.style.pointerEvents = this._previousPrimaryPointerEvents;
          this._secondaryChild.style.pointerEvents = this._previousSecondaryPointerEvents;
        }
      },

      _preventDefault: function(event) {
        event.preventDefault();
      }

    });

    /**
     * Fired when the splitter is dragged. Non-bubbing. Fired for the splitter
     * element and any nested elements with `IronResizableBehavior`.
     *
     * @event iron-resize
     */
  