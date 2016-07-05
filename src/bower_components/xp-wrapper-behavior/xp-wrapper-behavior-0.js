
    Polymer.XPWrapperBehaviorImp = {

        // PROPERTIES
        properties: {

            /**
             * A map used to bind attributes arrays to their respective owner.
             *
             * @attribute attributes-map
             * @type Object
             * @notifies
             * @readonly
             */
            attributesMap: {
                notify: true,
                readOnly: true,
                type: Object,
                value: function () { return {}; }
            }
        },

        /*********************************************************************/

        // OBSERVER
        _wrappedObserver: function (post) {

            // Vars
            var self       = this,
                property   = post && XP.findKey(self.__data__, function (value, key) { return value === post && key.indexOf('.') < 0; }),
                attributes = property && self.attributesMap[property];

            // Setting
            XP.forEach(attributes || [], function (attribute) { if (XP.isDefined(post[attribute])) { self[XP.setter(attribute, true)](post[attribute]); } });

            // Listening
            XP.forEach(attributes || [], function (attribute) { self.listen(post, XP.kebabCase(attribute) + '-changed', '_attributeHandler'); });
        },

        /*********************************************************************/

        // LISTENER
        ready: function () {

            // Vars
            var self = this,
                root = Polymer.dom(self.root);

            // Setting
            self.async(function () { XP.forOwn(self.attributesMap, function (values, key) { return self[key] || self[XP.setter(key, true)](root.querySelector('.' + XP.kebabCase(key))); }); });
        },

        /*********************************************************************/

        // HANDLER
        _attributeHandler: function (event) {

            // Vars
            var self      = this,
                attribute = !event.detail.path && XP.camelCase(event.type.replace(/-changed$/, ''));

            // Notifying
            if (event.detail.path) { return self.notifyChange(event); }

            // Setting
            self[XP.setter(attribute, true)](event.detail.value);
        }
    };

    Polymer.XPWrapperBehavior = [
        Polymer.XPRefirerBehavior,
        Polymer.XPWrapperBehaviorImp
    ];
