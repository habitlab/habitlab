
    (function() {
      Polymer({
        is: 'iron-doc-property',

        properties: {
          /**
           * The [Hydrolysis](https://github.com/PolymerLabs/hydrolysis)-generated
           * element descriptor to display details for.
           *
           * Alternatively, the element descriptor can be provided as JSON via the text content
           * of this element.
           *
           * @type {hydrolysis.PropertyDescriptor}
           */
          descriptor: {
            type:     Object,
            observer: '_descriptorChanged',
          },

          /**
           * Whether the property should show a one-liner, or full summary.
           *
           * Note that this property _is_ reflected as an attribute, but we perform
           * the reflection manually. In order to support the CSS transitions, we
           * must calculate the element height before setting the attribute.
           */
          collapsed: {
            type:     Boolean,
            value:    false,
            observer: '_collapsedChanged',
          },

          /**
           * Unique anchor ID for deep-linking.
           */
          anchorId: {
            type: String,
            reflectToAttribute: true,
          },

          _paramText: String,
        },

        listeners: {
          'transitionEnd':       '_onTransitionEnd',
          'webkitTransitionEnd': '_onTransitionEnd',
        },

        ready: function() {
          this._isReady = true;
        },

        /**
         * Resets any state that was set up for transitions.
         *
         * We are careful to reset our explicit heights after a transition
         * completes, so that the property doesn't clip values if the user resizes
         * their viewport.
         */
        _onTransitionEnd: function(event) {
          if (event.path[0] !== this.$.transitionMask) return;
          this.$.transitionMask.style.height = '';
        },

        _descriptorChanged: function() {
          this.toggleAttribute('private',       this.descriptor.private);
          this.toggleAttribute('configuration', this.descriptor.configuration);
          this.toggleAttribute('function',      this.descriptor.function);
          this._paramText = (this.descriptor.params || []).map(function(param) {
            return param.name;
          }).join(', ');
        },

        /**
         * Reflects `collapsed` as the `_collapsed` attribute.
         *
         * "Why not use `reflectToAttribute: true`?", you ask? A fine question!
         *
         * We avoid simple reflection purely because there is no purely declarative
         * way of transitioning to/from `height: auto`. This callback manages
         * setting explicit heights for the property so that CSS can interpolate it.
         *
         * @see #_onTransitionEnd
         */
        _collapsedChanged: function() {
          if (!this._isReady) {
            this.toggleAttribute('_collapsed', this.collapsed);
            return;
          }

          var container = this.$.transitionMask;
          var collapsed = this.collapsed;

          // Measure `height: auto`, which we will need regardless of transition
          // direction. We assume that the collapsed state has an explicit height
          // set via CSS rules; so we do not bother measuring that.
          container.style.height = 'auto';
          var fullHeight = container.offsetHeight;

          // Then, we reset to the start state. Changing directions mid-transition
          // is _not_ supported!
          if (this.collapsed) {
            container.style.height = fullHeight + 'px'; // Height 'auto'.
          } else {
            container.style.height = ''; // Height specified by CSS rule.
          }

          // We must wait a frame so that the transition engine has a chance to know
          // that something actually changed.
          requestAnimationFrame(function() {
            this.toggleAttribute('_collapsed', collapsed);
            if (this.collapsed) {
              container.style.height = ''; // Height specified by CSS rule.
            } else {
              container.style.height = fullHeight + 'px'; // Height 'auto'.
            }
          }.bind(this));
        },

        // hidden if no type and no defaults
        _computeHideMeta: function(descriptor) {
          return descriptor.type === undefined &&  descriptor.default === undefined;
        },

        // hidden if no params, and no return value
        _computeHideParams: function(descriptor,ret) {
          return (!descriptor.params || descriptor.params.length === 0) && !ret;
        },

        _computeHideDefault: function(def) {
          return def === undefined;
        },

        _computeDefaultDisplay: function(def) {
          if (def === '')
            return "''";
          return def;
        },

        _getAnnotation: function(descriptor) {
          var annotations = [];

          if (descriptor['default'] !== undefined) {
            annotations.push('Default: ' + descriptor['default']);
          }
          if (descriptor.readOnly) {
            annotations.push('readOnly');
          }
          if (descriptor.notify) {
            annotations.push('notifies');
          }
          return annotations.join(' – ');
        }
      });
    })();
  