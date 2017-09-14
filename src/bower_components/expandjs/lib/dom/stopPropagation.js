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
     * Prevents further propagation of up the DOM tree of `event`.
     *
     * ```html
     *  <div id="party" onclick="alert('Watch me dance!');">
     *       <button id="goParty">Click to party!</button>
     *  </div>
     *
     *  <script>
     *      // The party always stops just as you try to get in.
     *      var el = document.querySelector('#goParty');
     *
     *      function stopParty(event) {
     *          XP.stopPropagation(event);
     *          el.innerHTML = 'Sorry, the party is over.'
     *      }
     *
     *      XP.listen(el, 'click', stopParty)
     *      // => <button id="goParty">Click to party!</button>
     *  </script>
     * ```
     *
     * @function stopPropagation
     * @param {Event} [event] The event to be whose propagation to stopped
     * @returns {Event | undefined} Returns the stopped event
     */
    module.exports = function stopPropagation(event) {
        assertArgument(isVoid(event) || isEvent(event), 1, 'Event');
        event.stopPropagation();
        return event;
    };

}());