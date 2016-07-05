
    Polymer.XPOverlayInjector = {

        /**
         * Injects the overlay.
         *
         * @method inject
         * @param {Element | string} element
         * @param {*} [data]
         * @param {Element} [host]
         */
        inject: function (element, data, host) {

            // Asserting
            XP.assertArgument(XP.isElement(element) || XP.isString(element, true), 1, 'Element or string');
            XP.assertArgument(XP.isVoid(host) || XP.isElement(host), 3, 'Element');

            // Vars
            var self     = this,
                shell    = XP.findParentElement(self, '.shell') || document.body,
                post     = XP.isString(element) ? document.createElement(element = element.toLowerCase()) : element,
                pre      = XP.isString(element) ? Polymer.dom(shell.root || shell).querySelector(element) : null,
                listener = XP.debounce(function () { return !post.showed && Polymer.dom(Polymer.dom(post).parentNode).removeChild(XP.unlisten(post, 'showed-changed', listener)); }, 500);

            // Hiding
            if (pre && pre !== post) { pre.hide(); }

            // Appending
            if (pre !== post) { Polymer.dom(shell.root || shell).appendChild(post); }

            // Listening
            if (pre !== post) { XP.listen(post, 'showed-changed', listener); }

            // Showing
            requestAnimationFrame(function () { requestAnimationFrame(post.show.bind(post, self, data || self.data)); });

            return post;
        }
    };
