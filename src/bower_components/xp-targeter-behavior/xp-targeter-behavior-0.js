
    Polymer.XPTargeterBehavior = {

        /**
         * Finds the targeted element.
         *
         * @method findTarget
         * @returns {Element}
         */
        findTarget: function () {

            // Vars
            var self = this,
                root = self.domHost && Polymer.dom(self.domHost.root);

            // Finding
            if (XP.isElement(self.target)) { return self.target; }
            if (XP.isString(self.target, true) && root) { return root.querySelector('#' + self.target) || null; }
            if (XP.isString(self.target, true)) { return document.getElementById(self.target) || null; }

            return null;
        },

        /*********************************************************************/

        // PROPERTIES
        properties: {

            /**
             * The element's target.
             *
             * @attribute target
             * @type Element | string
             * @notifies
             */
            target: {
                notify: true,
                value: null
            }
        }
    };
