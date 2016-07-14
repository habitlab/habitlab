// Checks that 'bower install' has been run in the demo dir if demo/bower.json isn't empty.

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +                                                                                          +
// + This is a blocking script, triggering _synchronous_ http subrequests. Use locally only.  +
// +                                                                                          +
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

( function ( window ) {
    "use strict";

    var BOWER_DEMO_COMPONENTS_DIR = "/demo/bower_demo_components",

        msg = "<div class='panel callout row'>" +
              "<p>Bower components for the demo seem to be missing. Install them first:</p>" +
              "<ul>" +
              "<li>Open a command prompt <i>in the demo directory</i> of the project.</li>" +
              "<li>Run <code>bower install</code></li>" +
              "</ul>" +
              "<p>If this is a false positive and the packages are in fact in place, " +
              "disable the check by removing bower-check.js at the top of the &lt;body&gt;.</p>" +
              "</div>";

    getJSON( "/demo/bower.json", false, function ( data ) {

        var i, j, depNames,
            exists = false,
            files = [
                'bower.json', 'package.json',
                'readme.md', 'Readme.md', 'README.md', 'README',
                'license.txt', 'LICENSE.txt', 'LICENSE',
                'Gruntfile.js',
                'composer.json', 'component.json'
            ];

        if ( data && data.dependencies ) {

            depNames = Object.keys( data.dependencies );

            // Bower packages don't necessarily have a bower.json. file. The only file guaranteed to be there after
            // install is `.bower.json` (note the leading dot), but it is hidden and won't be served over http.
            //
            // So instead, we are looking for a bunch of files which are very likely to be there. If none of them is,
            // for none of the projects, the dependencies are most likely not installed.
            for ( i = 0; i < depNames.length; i++ ) {
                for ( j = 0; j < files.length; j++ ) {

                    get(
                        BOWER_DEMO_COMPONENTS_DIR + "/" + depNames[i] + "/" + files[j], false,
                        function ( data ) {
                            exists = !!data;
                        }
                    );

                    if ( exists ) return;

                }
            }

            window.document.write( msg );
        }

    } );


    // Helper functions in the absence of a library like jQuery (not loaded at this point)
    function get ( url, async, cb, cbError ) {
        var data,
            request = new XMLHttpRequest;

        request.open( 'GET', url, async );

        request.onload = function () {
            if ( this.status >= 200 && this.status < 400 ) {
                // Success!
                data = this.response;
            } else {
                // We reached our target server, but it returned an error. Most likely, the bower.json file is missing.
                // We just return undefined here.
                data = undefined;
            }
            cb( data );
        };

        request.onerror = function ( err ) {
            // There was a connection error of some sort.
            if ( cbError ) cbError( err );
        };

        request.send();
    }

    function getJSON ( url, async, cb, cbError ) {
        get( url, async, function ( data ) {

            if ( data ) data = JSON.parse( data );
            cb( data );

        }, cbError );
    }

}( window ));