
    Polymer.XPTooltipBehaviorImp = {

        /**
         * Hides the tooltip.
         *
         * @method hide
         * @returns {Element}
         */
        hide: function () {
            var self = this;
            self.showed = false;
            return self;
        },

        /**
         * Shows the tooltip.
         *
         * @method show
         * @returns {Element}
         */
        show: function () {
            var self = this;
            self.showed = true;
            return self;
        },

        /**
         * Toggles the tooltip.
         *
         * @method toggle
         * @returns {Element}
         */
        toggle: function () {
            var self = this;
            self.showed = !self.showed;
            return self;
        },

        /*********************************************************************/

        // LISTENERS
        listeners: {
            'mouseout': 'hide',
            'mouseover': 'show'
        },

        // PROPERTIES
        properties: {

            /**
             * The tooltip's overlay.
             *
             * @attribute overlay
             * @type Element
             * @notifies
             * @readonly
             */
            overlay: {
                notify: true,
                readOnly: true
            },

            /**
             * A self reference.
             *
             * @attribute self
             * @type Element
             * @notifies
             * @readonly
             */
            self: {
                notify: true,
                readOnly: true,
                value: function () { return this; }
            },

            /**
             * If set to true, the tooltip is showed.
             *
             * @attribute showed
             * @type boolean
             * @default false
             * @notifies
             */
            showed: {
                notify: true,
                reflectToAttribute: true,
                type: Boolean,
                value: false
            },

            /**
             * The tooltip's text.
             *
             * @attribute tip
             * @type string
             */
            tip: {
                reflectToAttribute: true,
                type: String
            }
        },

        /*********************************************************************/

        // LISTENER
        created: function () {

            // Classifying
            this.classList.add('tooltip');
        }
    };

    Polymer.XPTooltipBehavior = [
        Polymer.XPTargeterBehavior,
        Polymer.XPTooltipBehaviorImp
    ];
