/*jslint browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */

/**
 * @license
 * Copyright (c) 2015 The ExpandJS authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */
(function () {
    "use strict";

    var assertArgument = require('../assert/assertArgument'),
        isEvent        = require('../tester/isEvent'),
        isVoid         = require('../tester/isVoid');

    /**
     * Cancels the event if it is cancelable, without stopping further propagation of the event.
     *
     * ```html
     *  <a id="target" href="http://expandjs.com">Go to ExpandJS</a>
     *
     *  <script>
     *      // Preventing the default action of the anchor tag, which is, changing the host's URL.
     *      var el = document.querySelector('#target');
     *
     *      function stopDefault(event) {
     *          XP.preventDefault(event);
     *          ...other stuff
     *      }
     *
     *      el.addEventListener('click', stopDefault, false);
     *  </script>
     * ```
     *
     * @function preventDefault
     * @param {Event} [event] The event to be stopped
     * @returns {Event | undefined} Returns the stopped event
     */
    module.exports = function preventDefault(event) {
        assertArgument(isVoid(event) || isEvent(event), 1, 'Event');
        event.preventDefault();
        return event;
    };

}());