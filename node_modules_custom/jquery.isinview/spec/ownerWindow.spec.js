/*global describe, it, $ */
(function () {
    "use strict";

    describe( '$.fn.ownerWindow', function () {

        // Exclusions in IE10:
        //
        // IE10 behaves erratically when running the test suite as a whole.
        //
        // - Some particular tests near the end of the suite fail for no reason.
        // - When the affected test files are run in isolation, the tests pass.
        // - When the complete suite is run while the F12 dev tools are open, the tests pass.
        //
        // It has been impossible to trace or fix the problem. In any event, the browser bug at play here has no
        // relevance for the tested methods (they can be proven to work by running the tests in isolation). In order to
        // prevent unwarranted failures, the tests triggering the bug have been excluded from execution in IE10.
        //
        // (For the record, IE9 and IE11 are not affected. IE10 has been fully patched when tested.)

        var messageIE10 = "Skipped in IE10 because of erratic behaviour of the test suite, see note at the top of ownerWindow.spec.js",
            $testElem;

        afterEach( function () {
            try {
                if ( $testElem ) $testElem.remove();
            } catch ( e ) {
                // The test element has been created in a child window which is in the process of closing. This error
                // happens in IE only. No action required.
            }

        } );

        describe( 'In the global window, ownerWindow', function () {

            it( 'returns the window when called on the window', function () {
                expect( $( window ).ownerWindow() ).to.equal( window );
            } );

            it( 'returns the window when called on the document', function () {
                expect( $( document ).ownerWindow() ).to.equal( window );
            } );

            it( 'returns the window when called on an attached HTML element', function () {
                $testElem = $( "<div/>" ).appendTo( "body" );
                expect( $testElem.ownerWindow() ).to.equal( window );
            } );

            it( 'returns the window when called on a set of HTML elements', function () {
                $testElem = $( "<div/><div/><div/>" ).appendTo( "body" );
                expect( $testElem.ownerWindow() ).to.equal( window );
            } );

            it( 'returns the window when called on a document fragment', function () {
                // ...presuming the document fragment is created in the context of that window.
                $testElem = $( document.createDocumentFragment() );
                expect( $testElem.ownerWindow() ).to.equal( window );
            } );

            it( 'returns the window when called on a detached HTML element', function () {
                // ...presuming the detached HTML element is created in the context of that window.
                $testElem = $( "<div/>" );
                expect( $testElem.ownerWindow() ).to.equal( window );
            } );

            it( 'returns undefined when called on an empty jQuery set', function () {
                expect( $().ownerWindow() ).to.be.undefined;
            } );

        } );

        describe( 'In an iframe, ownerWindow', function () {

            var $iframe, iframe;

            beforeEach( function () {
                // NB The default document content (e.g., the body) in an iframe only gets created after the iframe is
                // added to the DOM.
                iframe = createIframe();
                $iframe = $( iframe );
                if ( !iframe.contentWindow || !iframe.contentDocument || !iframe.contentDocument.body ) throw new Error( "Failed to set up iframe tests. Can't access the content of the iframe" );
            } );

            afterEach( function () {
                if ( $iframe ) $iframe.remove();
            } );


            it( 'returns the parent window of the iframe when called on the iframe element itself', function () {
                expect( $iframe.ownerWindow() ).to.equal( window );
            } );

            it( 'returns the iframe window when called on the window', function () {
                expect( $( iframe.contentWindow ).ownerWindow() ).to.equal( iframe.contentWindow );
            } );

            it( 'returns the iframe window when called on the document', function () {
                expect( $( iframe.contentDocument ).ownerWindow() ).to.equal( iframe.contentWindow );
            } );

            it( 'returns the iframe window when called on an attached HTML element', function () {
                var $body = $( "body", iframe.contentDocument );
                $testElem = $( "<div/>", iframe.contentDocument ).appendTo( $body );
                expect( $testElem.ownerWindow() ).to.equal( iframe.contentWindow );
            } );

            it( 'returns the iframe window when called on a set of HTML elements', function () {
                var $body = $( "body", iframe.contentDocument );
                $testElem = $( "<div/><div/><div/>", iframe.contentDocument ).appendTo( $body );
                expect( $testElem.ownerWindow() ).to.equal( iframe.contentWindow );
            } );

            it( 'returns the iframe window when called on a document fragment', function () {
                // ...presuming the document fragment is created in the context of that window.
                $testElem = $( iframe.contentDocument.createDocumentFragment() );
                expect( $testElem.ownerWindow() ).to.equal( iframe.contentWindow );
            } );

            it( 'returns the iframe window when called on a detached HTML element', function () {
                // ...presuming the detached HTML element is created in the context of that window.
                $testElem = $( "<div/>", iframe.contentDocument );
                expect( $testElem.ownerWindow() ).to.equal( iframe.contentWindow );
            } );

            itUnless( isIE( { eq: 10 } ), messageIE10, 'returns undefined when called on an empty jQuery set', function () {
                expect( $( "#nonexistent", iframe.contentDocument ).ownerWindow() ).to.be.undefined;
            } );

        } );

        describe( 'In a child window, ownerWindow', function () {

            var childWindow;

            // Increase timeout to allow ample time for child window creation. Make it long enough to dismiss modal
            // warning dialogs in iOS, too, which must be done manually.
            this.timeout( 64000 );

            before( function () {
                childWindow = createChildWindow();
                if ( !childWindow ) throw new Error( "Can't create child window for tests. Please check if a pop-up blocker is preventing it" );
            } );

            after( function () {
                if ( childWindow ) childWindow.close();
            } );

            it( 'returns the window when called on the window', function () {
                expect( $( childWindow ).ownerWindow() ).to.equal( childWindow );
            } );

            it( 'returns the window when called on the document', function () {
                expect( $( childWindow.document ).ownerWindow() ).to.equal( childWindow );
            } );

            itUnless( isIE( { eq: 10 } ), messageIE10, 'returns the window when called on an attached HTML element', function () {
                var $body = $( "body", childWindow.document );
                $testElem = $( "<div/>", childWindow.document ).appendTo( $body );
                expect( $testElem.ownerWindow() ).to.equal( childWindow );
            } );

            itUnless( isIE( { eq: 10 } ), messageIE10, 'returns the window when called on a set of HTML elements', function () {
                var $body = $( "body", childWindow.document );
                $testElem = $( "<div/><div/><div/>", childWindow.document ).appendTo( $body );
                expect( $testElem.ownerWindow() ).to.equal( childWindow );
            } );

            it( 'returns the window when called on a document fragment', function () {
                // ...presuming the document fragment is created in the context of that window.
                $testElem = $( childWindow.document.createDocumentFragment() );
                expect( $testElem.ownerWindow() ).to.equal( childWindow );
            } );

            it( 'returns the window when called on a detached HTML element', function () {
                // ...presuming the detached HTML element is created in the context of that window.
                $testElem = $( "<div/>", childWindow.document );
                expect( $testElem.ownerWindow() ).to.equal( childWindow );
            } );

            itUnless( isIE( { eq: 10 } ), messageIE10, 'returns undefined when called on an empty jQuery set', function () {
                expect( $( "#nonexistent", childWindow.document ).ownerWindow() ).to.be.undefined;
            } );

        } );

        describe( 'The method does not rely on the exposed plugin API. When all other public methods of the plugin are deleted from jQuery', function () {

            var deletedApi;

            beforeEach( function () {
                deletedApi = deletePluginApiExcept( "ownerWindow" );
            } );

            afterEach( function () {
                restorePluginApi( deletedApi );
            } );

            itUnless( isIE( { eq: 10 } ), messageIE10, 'it works correctly and returns the appropriate owner window', function () {
                $testElem = $( "<div/>" ).appendTo( "body" );
                expect( $testElem.ownerWindow() ).to.equal( window );
            } );

        } );

    } );

})();