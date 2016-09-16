/*jslint browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */

/**
 * @license
 * Copyright (c) 2015 The ExpandJS authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */
(function (global) {
    "use strict";

    var assertArgument        = require('../assert/assertArgument'),
        getBoundings          = require('../dom/getBoundings'),
        getHeight             = require('../dom/getHeight'),
        getMargin             = require('../dom/getMargin'),
        getWidth              = require('../dom/getWidth'),
        isElement             = require('../tester/isElement'),
        isString              = require('../tester/isString'),
        isVoid                = require('../tester/isVoid'),
        setStyles             = require('../dom/setStyles'),
        willBleedBottom       = require('../dom/willBleedBottom'),
        willBleedHorizontally = require('../dom/willBleedHorizontally'),
        willBleedLeft         = require('../dom/willBleedLeft'),
        willBleedRight        = require('../dom/willBleedRight'),
        willBleedTop          = require('../dom/willBleedTop');

    /**
     * Aligns an element relative to a target element. A third parameter can be passed
     * with the position's beharious, if the element need to be positioned
     * on the side, at the baseline of the target or over the target. A forth parameter
     * can be passed if the element needs to be centered on its axis.
     *
     * @function align
     * @param {Element} [element] The element to be positioned
     * @param {Element} [target] The relative target of the position
     * @param {string} [position = "over"] The position's behaviour
     * @param {boolean} [autoCenter = false] Flag for autocentering of the element
     * @returns {Element | undefined} Returns the new positioned element
     * @hot
     */
    module.exports = function alignElement(element, target, position, autoCenter) {

        // Asserting
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(target) || isElement(target), 2, 'Element');
        assertArgument(isVoid(position) || isString(position), 3, 'string');

        // Checking
        if (!element) { return; }

        // Styling
        setStyles(element, {position: 'fixed', bottom: null, left: 0, right: null, top: 0});

        // Vars
        var domHeight       = getHeight(),
            domWidth        = getWidth(),
            margin          = getMargin(element),
            boundings       = getBoundings(element),
            targetBoundings = getBoundings(target || global.document.documentElement),
            newBoundings;

        // Calculating
        boundings.left = targetBoundings.left + (position === 'aside' ? targetBoundings.width : (autoCenter || !target ? (targetBoundings.width / 2) - (boundings.width / 2) : 0)) - margin.left;
        boundings.top  = targetBoundings.top + (position === 'baseline' ? targetBoundings.height : (!target ? (targetBoundings.height / 2) - (boundings.height / 2) : 0)) - margin.top;

        // Recalculating
        if (willBleedRight(boundings, margin)) { boundings.left = position === 'aside' ? boundings.left - (targetBoundings.width + boundings.width) : domWidth - (margin.left + boundings.width + margin.right); }
        if (willBleedLeft(boundings, margin)) { boundings.left = position === 'aside' && !willBleedHorizontally(boundings, margin) ? domWidth - (margin.left + boundings.width + margin.right) : 0; }
        if (willBleedBottom(boundings, margin)) { boundings.top = domHeight - (margin.top + boundings.height + margin.bottom); }
        if (willBleedTop(boundings, margin)) { boundings.top = 0; }

        // Styling
        setStyles(element, {left: boundings.left + 'px', right: willBleedRight(boundings, margin) ? '0px' : null});
        setStyles(element, {top: boundings.top + 'px', bottom: willBleedBottom(boundings, margin) ? '0px' : null});

        // Getting
        newBoundings = getBoundings(element);

        // Fixing ("position: fixed" bug)
        if ((newBoundings.left -= margin.left) !== boundings.left) { setStyles(element, {left: ((boundings.left * 2) - newBoundings.left) + 'px', right: willBleedRight(boundings, margin) ? (boundings.left - newBoundings.left) + 'px' : null}); }
        if ((newBoundings.top -= margin.top) !== boundings.top) { setStyles(element, {top: ((boundings.top * 2) - newBoundings.top) + 'px', bottom: willBleedBottom(boundings, margin) ? (boundings.top - newBoundings.top) + 'px' : null}); }

        return element;
    };

}(typeof window !== "undefined" ? window : global));
