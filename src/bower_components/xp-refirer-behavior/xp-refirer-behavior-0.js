
    Polymer.XPRefirerBehavior = {

        /**
         * Notifies everyone in array.
         *
         * @method notifyAll
         * @param {string} pathAll
         * @param {string} path
         * @param {*} value
         */
        notifyAll: function (pathAll, path, value) {

            // Asserting
            XP.assertArgument(XP.isString(pathAll, true), 1, 'string');
            XP.assertArgument(XP.isString(path, true), 2, 'string');
            XP.assertOption(XP.isArray(this.get(pathAll)), pathAll, 'Array');

            // Vars
            var self     = this,
                elements = self.get(pathAll);

            // Notifying
            elements.forEach(function (element) { element.notifyPath(path, value); });
        },

        /**
         * Notifies a change event.
         *
         * @method notifyChange
         * @param {Event} event
         */
        notifyChange: function (event) {

            // Asserting
            XP.assertArgument(XP.isEvent(event), 1, 'Event');

            // Vars
            var self  = this,
                path  = event.detail.path,
                type  = event.detail.type,
                value = event.detail.value;

            // Notifying
            self.notifyPath(path ? path.replace(/\.#/g, '.', '.') : type.replace(/-changed$/, ''), value);
        },

        /**
         * Notifies everyone besides itself in array.
         *
         * @method notifyOthers
         * @param {string} pathOthers
         * @param {string} path
         * @param {*} value
         */
        notifyOthers: function (pathOthers, path, value) {

            // Asserting
            XP.assertArgument(XP.isString(pathOthers, true), 1, 'string');
            XP.assertArgument(XP.isString(path, true), 2, 'string');
            XP.assertOption(XP.isArray(this.get(pathOthers)), pathOthers, 'Array');

            // Vars
            var self     = this,
                elements = self.get(pathOthers);

            // Notifying
            elements.forEach(function (element) { return element !== self ? element.notifyPath(path, value) : undefined; });
        },

        /**
         * Refires an event.
         *
         * @method refire
         * @param {Event} event
         * @param {string} [type]
         * @param {Object} [detail]
         * @returns {Event}
         */
        refire: function (event, type, detail) {

            // Asserting
            XP.assertArgument(XP.isEvent(event), 1, 'Event');
            XP.assertArgument(XP.isVoid(type) || XP.isString(type, true), 2, 'string');
            XP.assertArgument(XP.isVoid(detail) || XP.isObject(detail), 3, 'Object');

            // Stopping
            event.stopPropagation();

            // Vars
            var fired = this.fire(type || event.type, XP.assign({}, event.detail, detail), {cancelable: event.cancelable});

            // Preventing
            if (fired.defaultPrevented) { event.preventDefault(); }

            return fired;
        }
    };
