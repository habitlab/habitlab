/*global describe, it, $ */
(function () {
    "use strict";

    describe( '$.scrollbarWidth', function () {

        var messageIE10 = "Skipped in IE10 because of erratic behaviour of the test suite, see note at the top of ownerWindow.spec.js",
            $hasScrollbars;

        afterEach( function () {
            if ( $hasScrollbars ) $hasScrollbars.remove();
        } );

        it( 'is a number', function () {
            expect( $.scrollbarWidth() ).to.be.a.number;
        } );

        it( 'is >=0', function () {
            expect( $.scrollbarWidth() ).to.be.at.least( 0 );
        } );

        it( 'is < 30 (assuming that a scrollbar can never be that big)', function () {
            expect( $.scrollbarWidth() ).to.be.below( 30 );
        } );

        itUnless( isIE( { eq: 10 } ), messageIE10, 'matches the scrollbar width measured on a visible, scrolling element', function () {
            var $inner = $( "<div/>" ).css( { width: "100px", height: "100px" } );
            $hasScrollbars = $ ( '<div/>' )
                .css( { width: "50px", height: "50px", overflow: "scroll", margin: 0, padding: 0, borderStyle: "none" } )
                .append( $inner )
                .appendTo( document.body );

            expect( $.scrollbarWidth() ).to.equal( 50 - $hasScrollbars[0].clientWidth );
        } );

        itUnless( isIE( { eq: 10 } ), messageIE10, 'matches the scrollbar width established according to the Alman method', function () {
            // Here, we detect the size (width) of scroll bars for a given browser with the method used in Ben Alman's
            // scrollbarWidth plugin. It is used as a reference because it is a well-established, battle-tested method.
            // (But it is a little more roundabout than the one used in jQuery.isInView.)
            //
            // See
            // - http://benalman.com/projects/jquery-misc-
            // - http://jsbin.com/zeliy/1

            var scrollbarWidthAlman, $detectionOuter, $detectionInner;
            $detectionInner = $( document.createElement( "div" ) ).css( { margin: 0, padding: 0, borderStyle: "none" } );
            $detectionOuter = $( document.createElement( "div" ) )
                .css( {
                    width: "100px", height: "100px", overflow: "auto",
                    position: "absolute", top: "-500px", left: "-500px",
                    margin: 0, padding: 0, borderStyle: "none"
                } )
                .append( $detectionInner )
                .appendTo( document.body );

            scrollbarWidthAlman = $detectionInner.innerWidth() - $detectionInner.height( 150 ).innerWidth();
            $detectionOuter.remove();

            expect( $.scrollbarWidth() ).to.equal( scrollbarWidthAlman );
        } );

        describe( 'The method does not rely on the exposed plugin API. When all other public methods of the plugin are deleted from jQuery', function () {

            var globalScrollBarWidth, deletedApi;

            beforeEach( function () {
                globalScrollBarWidth = $.scrollbarWidth();
                deletedApi = deletePluginApiExcept( "scrollbarWidth", true );
            } );

            afterEach( function () {
                restorePluginApi( deletedApi );
            } );

            it( 'it works correctly and returns the global scroll bar width', function () {
                expect( $.scrollbarWidth() ).to.equal( globalScrollBarWidth );
            } );

        } );
    } );

})();