/**
 * Code lifted from Leche because I didn't get it to work with Karma.
 *
 * See https://github.com/box/leche#mocha-data-provider for usage instructions.
 *
 * LIMITATION:
 *
 * - You can't use data in your dataSets which is created or populated in an outer before() or beforeEach() hook. The
 *   hooks run _after_ withData() has been invoked.
 *
 *   Tests contained in the withData callback are executed in order, though, so you can use data from outer before() and
 *   beforeEach() hooks in there.
 *
 *   To clarify the execution order, consider this setup:
 *
 *       var foo=0;
 *
 *       beforeEach( function () { foo = 10 } );
 *
 *       withData( [foo], function ( importedFoo ) {
 *
 *           console.log( foo );                    // => prints 0, beforeEach hasn't run yet
 *           console.log( importedFoo );            // => prints 0, beforeEach hadn't run when the data set for withData
 *                                                  //    was created
 *
 *           describe( "a suite", function () {
 *
 *               console.log( foo );                // => prints 0, beforeEach hasn't run yet
 *
 *               beforeEach( function () {
 *                   console.log( foo );            // => prints 10, beforeEach has run
 *               } );
 *
 *               it( "is a test", function () {
 *                   console.log( foo );            // => prints 10, beforeEach has run
 *               } );
 *
 *           } );
 *
 *       } );
 *
 *   tldr; before/beforeEach cannot be used for withData itself, or its data sets. Refer to it only inside tests or
 *   hooks.
 *
 *   Legal
 *   -----
 *
 *   Original file available at https://github.com/box/leche
 *
 *   Copyright
 *   (c) 2014 Box, Inc.
 *   (c) 2015-2016 Michael Heim, Zeilenwechsel.de
 *
 *   All rights reserved. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 *   except in compliance with the License. You may obtain a copy of the License at
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 *   an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 *   specific language governing permissions and limitations under the License.
 */

/**
 * A data provider for use with Mocha. Use this around a call to it() to run the test over a series of data.
 *
 * @throws {Error}                      if dataset is missing or an empty array
 * @param  {Object|Array} dataset       the data to test
 * @param  {Function}     testFunction  the function to call for each piece of data
 */
function withData ( dataset, testFunction ) {

    // check for missing or null argument
    if ( typeof dataset !== 'object' || dataset === null ) {
        throw new Error( 'First argument must be an object or non-empty array.' );
    }

    /*
     * The dataset needs to be normalized so it looks like:
     * {
     *      "name1": [ "data1", "data2" ],
     *      "name2": [ "data3", "data4" ],
     * }
     */
    var namedDataset = dataset;
    if ( dataset instanceof Array ) {

        // arrays must have at least one item
        if ( dataset.length ) {
            namedDataset = createNamedDataset( dataset );
        } else {
            throw new Error( 'First argument must be an object or non-empty array.' );
        }
    }

    /*
     * For each name, create a new describe() block containing the name.
     * This causes the dataset info to be output into the console, making
     * it easier to determine which dataset caused a problem when there's an
     * error.
     */
    for ( var name in namedDataset ) {
        if ( namedDataset.hasOwnProperty( name ) ) {
            //jshint loopfunc:true

            describe( 'with ' + name, (function ( name ) {
                return function () {

                    var args = namedDataset[name];

                    if ( !(args instanceof Array) ) {
                        args = [args];
                    }

                    testFunction.apply( this, args );
                };
            }( name )) );
        }
    }
}

/**
 * Converts an array into an object whose keys are a string representation of the each array item and whose values are
 * each array item. This is to normalize the information into an object so that other operations can assume objects are
 * always used. For an array like this:
 *
 *        [ "foo", "bar" ]
 *
 * It creates an object like this:
 *
 *        { "foo": "foo", "bar": "bar" }
 *
 * If there are duplicate values in the array, only the last value is represented in the resulting object.
 *
 * @param   {Array}  array  the array to convert
 * @returns {Object}        an object representing the array
 * @private
 */
function createNamedDataset ( array ) {
    var result = {};

    for ( var i = 0, len = array.length; i < len; i++ ) {
        result[array[i].toString()] = array[i];
    }

    return result;
}


