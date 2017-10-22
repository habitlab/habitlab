/**
 * @fileoverview Module for loading rules from files and directories.
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs"),
    path = require("path");

const rulesDirCache = {};

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Load all rule modules from specified directory.
 * @param {string} [rulesDir] Path to rules directory, may be relative. Defaults to `lib/rules`.
 * @param {string} cwd Current working directory
 * @returns {Object} Loaded rule modules by rule ids (file names).
 */
module.exports = function(rulesDir, cwd) {
    let rule_filenames = require("./rules_filenames")
    let rules = {}
    for (let rule_filename of rule_filenames) {
        rules[rule_filename.slice(0, -3)] = rule_filename
    }
    return rules;
};
