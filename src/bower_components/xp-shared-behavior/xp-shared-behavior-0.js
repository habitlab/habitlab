
    (function () {

        // Vars
        var shared = {};

        // Prototype
        Polymer.XPSharedBehaviorImp = {

            /**
             * Share `value` with others.
             *
             * @method share
             * @param {string} path
             * @param {*} value
             * @returns {*}
             */
            share: function (path, value) {

                // Asserting
                XP.assertArgument(XP.isString(path, true), 1, 'string');

                // Vars
                var self = this;

                // Enforcing
                self.enforce('shared.' + path, value);

                // Notifying
                self.notifyOthers('sharers', 'shared.' + path, value);

                return value;
            },

            /*********************************************************************/

            // PROPERTIES
            properties: {

                /**
                 * The shared data.
                 *
                 * @attribute shared
                 * @type Object
                 * @default {}
                 * @notifies
                 * @readonly
                 */
                shared: {
                    notify: true,
                    readOnly: true,
                    value: shared
                }
            },

            /**
             * The list of sharers.
             *
             * @property sharers
             * @type Array
             * @default []
             * @readonly
             */
            sharers: [],

            /*********************************************************************/

            // LISTENER
            ready: function () {

                // Appending
                this.append('sharers', this);
            }
        };

        Polymer.XPSharedBehavior = [
            Polymer.XPArrayBehavior,
            Polymer.XPObjectBehavior,
            Polymer.XPRefirerBehavior,
            Polymer.XPSharedBehaviorImp
        ];
    }());
