// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Depends on basic-utils.js
// Depends on dom-utils.js > basic-utils.js
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function describe_noPhantom () {
    describeUnless.apply( undefined, [
        isPhantomJs(),
        "Skipping tests in PhantomJS. Use another browser to run the full suite."
    ].concat( Array.prototype.slice.call( arguments ) ) );
}

function it_noPhantom () {
    itUnless.apply( undefined, [
        isPhantomJs(),
        "Skipping test in PhantomJS. Use another browser to run the full suite."
    ].concat( Array.prototype.slice.call( arguments ) ) );
}

/**
 * Conditional describe. The condition can be a boolean, or a function which returns a boolean. Pass an optional warning
 * after the condition, before the suite description.
 *
 * Works for Mocha and Jasmine. Syntax:
 *
 * - without warning: describeIf( !isIE(), "My suite name", function () { ... } );
 * - with warning:    describeIf( !isIE(), "Skipping tests in IE.", "My suite name", function () { ... } );
 */
function describeIf ( condition, warning ) {
    _conditionalSpec( {
        runFunc: describe,
        skipFunc: describe.skip || xdescribe,
        invertCondition: false,
        defaultWarning: "Skipping tests conditionally.",
        args: Array.prototype.slice.call( arguments )
    } );
}

/**
 * Conditional describe. See describeIf.
 */
function describeUnless ( condition, warning ) {
    _conditionalSpec( {
        runFunc: describe,
        skipFunc: describe.skip || xdescribe,
        invertCondition: true,
        defaultWarning: "Skipping tests conditionally.",
        args: Array.prototype.slice.call( arguments )
    } );
}

/**
 * Conditional spec. The condition can be a boolean, or a function which returns a boolean. Pass an optional warning
 * after the condition, before the spec description.
 *
 * Works for Mocha and Jasmine. Syntax:
 *
 * - without warning: itIf( !isIE(), "My spec name", function () { ... } );
 * - with warning:    itIf( !isIE(), "Skipping tests in IE.", "My spec name", function () { ... } );
 */
function itIf ( condition, warning ) {
    _conditionalSpec( {
        runFunc: it,
        skipFunc: it.skip || xit,
        invertCondition: false,
        defaultWarning: "Skipping test conditionally.",
        args: Array.prototype.slice.call( arguments )
    } );
}

/**
 * Conditional spec. See itIf.
 */
function itUnless ( condition, warning ) {
    _conditionalSpec( {
        runFunc: it,
        skipFunc: it.skip || xit,
        invertCondition: true,
        defaultWarning: "Skipping test conditionally.",
        args: Array.prototype.slice.call( arguments )
    } );
}

/**
 * @private
 */
function _conditionalSpec( call ) {
    var originalArgs = call.args,
        condition = originalArgs[0],
        hasWarning = typeof originalArgs[2] === "string",
        warning = hasWarning ? originalArgs[1] : call.defaultWarning,
        specArgs = hasWarning ? originalArgs.slice( 2 ) : originalArgs.slice( 1 );

    if ( typeof condition === "function" ) condition = condition();
    if ( call.invertCondition ) condition = !condition;

    if ( condition ) {
        call.runFunc.apply( undefined, specArgs );
    } else {
        warn( warning );
        call.skipFunc.apply( undefined, specArgs );
    }
}


