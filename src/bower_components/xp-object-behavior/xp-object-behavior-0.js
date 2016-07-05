
    Polymer.XPObjectBehavior = {

        /**
         * Set `value` at the specified `path`, creating it if not exists.
         *
         * @method enforce
         * @param {string} path
         * @param {*} value
         * @returns {*}
         */
        enforce: function (path, value) {

            // Asserting
            XP.assertArgument(XP.isString(path, true), 1, 'string');

            // Vars
            var self    = this,
                current = self,
                force   = false,
                parts   = XP.split(path, '.');

            // Enforcing
            parts.forEach(function (part, i) {
                force   = !current[part] || typeof current[part] !== 'object';
                current = current[part] = i + 1 === parts.length ? value : (force ? {} : current[part]);
            });

            // Notifying
            self.notifyPath(path, value);

            return value;
        }
    };
