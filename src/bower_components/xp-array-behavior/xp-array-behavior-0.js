
    Polymer.XPArrayBehavior = {

        /**
         * Adds a value at the end of an array, if it doesn't already exist,
         * and returns the passed element.
         *
         * @method append
         * @param {string} path
         * @param {*} value
         * @returns {*}
         */
        append: function (path, value) {

            // Asserting
            XP.assertArgument(XP.isString(path, true), 1, 'string');
            XP.assertOption(XP.isArray(this.get(path)), path, 'Array');

            // Vars
            var self  = this,
                array = self.get(path);

            // Appending
            if (array.indexOf(value) < 0) { self.push(path, value); }

            return value;
        },

        /**
         * Substitutes all items of `array` with ones from `other`, and returns the modified `array`.
         * The substitution happens only if necessary.
         *
         * @method overwrite
         * @param {string} path
         * @param {Array} other
         * @returns {Array}
         */
        overwrite: function (path, other) {

            // Asserting
            XP.assertArgument(XP.isString(path, true), 1, 'string');
            XP.assertArgument(XP.isArrayable(other), 2, 'Arrayable');
            XP.assertOption(XP.isArray(this.get(path)), path, 'Array');

            // Vars
            var self    = this,
                array   = self.get(path),
                differs = array.length !== other.length || XP.reduce(array, function (differs, val, i) { return differs || val !== other[i]; });

            // Overwriting
            if (differs) { self.splice.apply(self, XP.concat([path, 0, array.length], other)); }

            return array;
        },

        /**
         * Removes all instances of `value` from `array`.
         *
         * @method pull
         * @param {string} path
         * @param {*} [value]
         * @returns {Array}
         */
        pull: function (path, value) {

            // Asserting
            XP.assertArgument(XP.isString(path, true), 1, 'string');
            XP.assertOption(XP.isArray(this.get(path)), path, 'Array');

            // Vars
            var self  = this,
                array = self.get(path);

            // Pulling
            XP.forEachRight(array, function (val, i) { if (value === val) { self.splice(path, i, 1); } });

            return array;
        },

        /**
         * Removes an element from `array` corresponding to the given index and returns it.
         *
         * @method pullAt
         * @param {string} path
         * @param {number} index
         * @returns {*}
         */
        pullAt: function (path, index) {

            // Asserting
            XP.assertArgument(XP.isString(path, true), 1, 'string');
            XP.assertArgument(XP.isVoid(index) || XP.isIndex(index), 2, 'number');
            XP.assertOption(XP.isArray(this.get(path)), path, 'Array');

            // Vars
            var self  = this,
                array = self.get(path);

            // Pulling
            return index < array.length ? self.splice(path, index, 1)[0] : undefined;
        }
    };
