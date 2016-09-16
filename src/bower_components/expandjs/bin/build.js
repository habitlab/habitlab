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

    // STEP 1
    (function () {

        // Vars
        var fs     = require('fs'),
            groups = require(__dirname + '/groups');

        // Indexing
        groups.forEach(function (group) {

            // Vars
            var files = fs.readdirSync(__dirname + '/../lib/' + group),
                text  = '';

            // Splicing
            files.splice(files.indexOf('index.js'), 1);

            // Appending
            text += 'module.exports = {';
            files.forEach(function (file, i) { text += '\n    ' + (file  = file.substr(0, file.lastIndexOf('.'))) + ': require("./' + file + '")' + (i < files.length - 1 ? ',' : ''); });
            text += '\n};';

            // Writing
            fs.writeFileSync(__dirname + '/../lib/' + group + '/index.js', text);
        });

        // Logging
        console.log('STEP 1: complete!');
    }());

    // STEP 2
    (function () {

        // Vars
        var fs      = require('fs'),
            methods = require(__dirname + '/../lib'),
            keys    = Object.keys(methods).sort(),
            text    = '/*jslint browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */\n';

        // Build: header
        text += '\n';
        text += '(function (global, browser) {\n';
        text += '    "use strict";\n';
        text += '\n';
        text += '    // Vars\n';
        text += '    var ';

        // Build: declaration
        keys.forEach(function (name) {
            text += name + ', ';
        });

        // Build: vars
        text += '\n';
        text += '        forms  = require("html-json-forms"),\n';
        text += '        lodash = require("lodash"),\n';
        text += '        url    = require("url"),\n';
        text += '        UUID   = require("uuid"),\n';
        text += '        _      = global._  = global._ || lodash,\n';
        text += '        exp    = global.XP = module.exports;\n';

        // Build: methods
        keys.forEach(function (name) {
            text += '\n';
            text += '    // ' + name.toUpperCase() + '\n';
            text += '    exp.' + name + ' = ' + name + ' = ' + methods[name].toString() + ';\n';
        });

        // Build: footer
        text += '\n';
        text += '}(typeof window !== "undefined" ? window : global, typeof window !== "undefined"));\n';

        // Writing
        fs.writeFileSync(__dirname + '/index.js', text);

        // Logging
        console.log('STEP 2: complete!');
    }());

}());
