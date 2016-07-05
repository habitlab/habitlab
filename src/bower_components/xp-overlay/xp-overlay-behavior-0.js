
    Polymer.XPOverlayBehaviorImp = {

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
         * Aligns the overlay.
         *
         * @method align
         * @returns {Element}
         */
        align: function () {

            // Vars
            var self = this, target = self.showed && self.findTarget();

            // Aligning
            if (target) { self.async(XP.alignElement.bind(null, self, target, self.position, self.autoCenter)); } else { self.hide(); }

            return self;
        },

        /**
         * Hides the overlay.
         *
         * @method hide
         * @returns {Element}
         */
        hide: function () {

            // Vars
            var self = this;

            // Setting
            self.showed = false;

            return self;
        },

        /**
         * Shows the overlay.
         *
         * @method show
         * @param {Element | string} [target]
         * @param {*} [data]
         * @returns {Element}
         */
        show: function (target, data) {

            // Asserting
            XP.assertArgument(XP.isVoid(target) || XP.isElement(target) || XP.isString(target), 1, 'Element or string');

            // Vars
            var self = this;

            // Setting
            self.data   = data || self.data;
            self.target = target || self.target;
            self.showed = true;

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

            // Vars
            var self = this;

            // Toggling
            self[self.showed ? 'hide' : 'show'](target, data);

            return self;
        },

        /*********************************************************************/

        // OBSERVERS
        observers: [
            'align(autoCenter, position, showed, target)'
        ],

        // PROPERTIES
        properties: {

            /**
             * If set to true, the overlay is center aligned.
             *
             * @attribute auto-center
             * @type boolean
             * @default false
             */
            autoCenter: {
                reflectToAttribute: true,
                type: Boolean,
                value: false
            },

            /**
             * If set to true, clicking outside will not close the overlay.
             *
             * @attribute auto-hide-disabled
             * @type boolean
             * @default false
             */
            autoHideDisabled: {
                type: Boolean,
                value: false
            },

            /**
             * The overlay's data.
             *
             * @attribute data
             * @type *
             * @notifies
             */
            data: {
                notify: true
            },

            /**
             * The overlay position relative to the target.
             *
             * 'over' is over the target.
             *
             * 'aside' is to the side of the target.
             *
             * 'baseline' is underneath the target.
             *
             * @attribute position
             * @type "aside" | "baseline" | "over"
             * @default "over"
             */
            position: {
                type: String,
                value: "over"
            },

            /**
             * If set to true, the overlay is showed.
             *
             * @attribute showed
             * @type boolean
             * @default false
             * @notifies
             */
            showed: {
                notify: true,
                observer: '_showedObserver',
                reflectToAttribute: true,
                type: Boolean,
                value: false
            }
        },

        /**
         * The list of positions.
         *
         * @property positions
         * @type Array
         * @default ["aside", "baseline", "over"]
         * @readonly
         */
        positions: ['aside', 'baseline', 'over'],

        /*********************************************************************/

        // OBSERVER
        _showedObserver: function () {

            // Vars
            var self   = this,
                method = self.showed ? 'listen' : 'unlisten';

            // Firing
            if (self.isAttached) { self.fire(self.showed ? 'xp-show' : 'xp-hide', {firer: self}); }

            // Frame 1
            requestAnimationFrame(function () {

                // Listening
                self[method](self, 'click', '_pushHandler');
                self[method](window, 'click', '_hideHandler');
                self[method](window, 'keyup', '_hideHandler');
                self[method](window, 'resize', '_resizeHandler');
            });
        },

        /*********************************************************************/

        // LISTENER
        created: function () {

            // Vars
            var self = this;

            // Classifying
            self.classList.add('overlay');

            // Binding
            self._hideHandler   = self._hideHandler.bind(self);
            self._pushHandler   = self._pushHandler.bind(self);
            self._resizeHandler = self._resizeHandler.bind(self);
        },

        /*********************************************************************/

        // HANDLER
        _hideHandler: function (event) {

            // Vars
            var self = this;

            // Frame 2
            requestAnimationFrame(function () {

                // Checking
                if (event.overlays && event.overlays.indexOf(self) >= 0) { return; }
                if (event.keyCode !== 27 && (event.button || event.keyCode || self.autoHideDisabled)) { return; }

                // Unlistening
                self.unlisten(self, 'click', '_pushHandler');
                self.unlisten(window, 'click', '_hideHandler');
                self.unlisten(window, 'keyup', '_hideHandler');
                self.unlisten(window, 'resize', '_resizeHandler');

                // Hiding
                self.hide();
            });
        },

        // HANDLER
        _pushHandler: function (event) {

            // Pushing
            (event.overlays = event.overlays || []).push(this);
        },

        // HANDLER
        _resizeHandler: function () {

            // Aligning
            this.align();
        }
    };

    Polymer.XPOverlayBehavior = [
        Polymer.XPTargeterBehavior,
        Polymer.XPOverlayBehaviorImp
    ];
