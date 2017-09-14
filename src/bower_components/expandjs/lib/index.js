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

    // Exporting
    global.XP = module.exports = require('./object/assign')({},
        require('./array'),
        require('./assert'),
        require('./caster'),
        require('./collection'),
        require('./constructors'),
        require('./dom'),
        require('./error'),
        require('./function'),
        require('./number'),
        require('./object'),
        require('./operator'),
        require('./regex'),
        require('./string'),
        require('./tester'));

}(typeof window !== "undefined" ? window : global));