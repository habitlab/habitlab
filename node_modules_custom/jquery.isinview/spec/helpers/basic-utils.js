function isNumber ( value ) {
    // Done as in the Lodash compatibility build, but rejecting NaN as a number.
    var isNumeric = typeof value === 'number' || value && typeof value === 'object' && Object.prototype.toString.call( value ) === '[object Number]' || false;

    // Reject NaN before returning
    return isNumeric && value === +value;
}

function isString ( value ) {
    // Done as in the Lodash compatibility build
    return typeof value === 'string' || value && typeof value === 'object' && Object.prototype.toString.call(value) === '[object String]' || false;
}

function isUndefined( value ) {
    return typeof  value === "undefined";
}

function varExists ( variable ) {
    return !isUndefined( variable );
}


function getTimestamp () {
    return Date.now && Date.now() || +new Date();
}


function log ( message ) {
    "use strict";
    if ( typeof console !== "undefined" && console.log ) console.log( message );
}

function warn ( message ) {
    "use strict";
    if ( typeof console !== "undefined" ) console.warn ? console.warn( message ) : log( "WARN " + message );
}


/**
 * Makes sure a string ends in a semicolon, unless the string is empty. Useful for cssText strings.
 *
 * @param   {string} cssString
 * @returns {string}
 */
function ensureTrailingSemicolon ( cssString ) {
    if ( cssString.length && cssString.slice( -1 ) !== ";" ) cssString += ";";
    return cssString;
}
