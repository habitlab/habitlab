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

    var preventDefault  = require('../dom/preventDefault'),
        stopPropagation = require('../dom/stopPropagation');

    /**
     * Cancels the event if it is cancelable, and stops any further propagation of the event.
     *
     * ```html
     *  <div id="outer" onclick="alert('Welcome to Belize!');">
     *       <a id="belize" href="http://www.google.com/search?q=belize">Go to Belize</a>
     *  </div>
     *
     *  <script>
     *      // Claims to send you to Belize, but will send you to Alaska instead.
     *      var el = document.querySelector('#belize');
     *
     *      function stopEvent(event) {
     *          XP.stop(event);
     *          alert('What about Alaska? Alaska's good.');
     *          location.href = 'http://www.google.com/search?q=alaska';
     *      }
     *
     *      XP.listen(el, 'click', stopEvent)
     *      // => <a id="belize" href="http://www.google.com/search?q=belize">Go to Belize</a>
     *  </script>
     * ```
     *
     * @function stop
     * @param {Event} [event] The event to be stopped
     * @returns {Event | undefined} Returns the stopped event
     */
    module.exports = function stop(event) {
        return stopPropagation(preventDefault(event));
    };

}());
