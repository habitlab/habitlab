
    Polymer.XPOverlayWrapperImp = {

        /**
         * Fired on hide.
         *
         * @event xp-hide
         * @param {Element} firer
         */

        /**
         * Fired on show.
         * @event xp-show
         * @param {Element} firer
         */

        /*********************************************************************/

        /**
         * Hides the overlay.
         *
         * @method hide
         * @returns {Element}
         */
        hide: function () {
            var self = this;
            if (self.overlay) { self.overlay.hide(); }
            return self;
        },

        /**
         * Shows the overlay.
         *
         * @method show
         * @param {Element | string} target
         * @param {*} [data]
         * @returns {Element}
         */
        show: function (target, data) {
            var self = this;
            if (self.overlay) { self.overlay.show(target, data); }
            return self;
        },

        /**
         * Toggles the overlay.
         *
         * @method toggle
         * @param {Element | string} target
         * @param {*} [data]
         * @returns {Element}
         */
        toggle: function (target, data) {
            var self = this;
            if (self.overlay) { self.overlay.toggle(target, data); }
            return self;
        },

        /*********************************************************************/

        // PROPERTIES
        properties: {

            /**
             * The overlay's data.
             *
             * @attribute data
             * @type *
             * @notifies
             * @readonly
             */
            data: {
                notify: true,
                readOnly: true
            },

            /**
             * The overlay element.
             *
             * @attribute overlay
             * @type Element
             * @notifies
             * @readonly
             */
            overlay: {
                notify: true,
                observer: '_wrappedObserver',
                readOnly: true
            },

            /**
             * If set to true, the overlay is showed.
             *
             * @attribute showed
             * @type boolean
             * @default false
             * @notifies
             * @readonly
             */
            showed: {
                notify: true,
                observer: '_showedObserver',
                readOnly: true,
                reflectToAttribute: true,
                type: Boolean,
                value: false
            },

            /**
             * The overlay's target.
             *
             * @attribute target
             * @type Element
             * @notifies
             * @readonly
             */
            target: {
                notify: true,
                readOnly: true
            }
        },

        /*********************************************************************/

        // OBSERVER
        _showedObserver: function () {

            // Firing
            if (this.isAttached) { this.fire(this.showed ? 'xp-show' : 'xp-hide', {firer: this}); }
        },

        /*********************************************************************/

        // LISTENER
        ready: function () {

            // Mapping
            this.attributesMap.overlay = ['data', 'showed', 'target'];
        }
    };

    Polymer.XPOverlayWrapper = [
        Polymer.XPWrapperBehavior,
        Polymer.XPOverlayWrapperImp
    ];
