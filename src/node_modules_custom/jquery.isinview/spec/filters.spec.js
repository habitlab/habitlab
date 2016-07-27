/*global describe, it, $ */
(function () {
    "use strict";

    describe( 'Element filters: .inView(), :inViewport', function () {

        var $testStage, $container, $el, $elOut;

        beforeEach( function () {
            $el = $( '<div/>' ).contentBox( 50, 50 ).contentOnly();
            $elOut = $( '<div/>' ).contentBox( 50, 50 ).contentOnly().positionAt( -100, -100 );
            $container = $( '<div/>' ).append( $el ).contentOnly();
            $testStage = $( '<div id="' + "testStage_" + getTimestamp() + '"/>' ).append( $container ).prependTo( 'body' ).contentOnly();

            $( "body, html" ).contentOnly();
        } );

        afterEach( function () {
            if ( $testStage ) $testStage.remove();
        } );

        describe( 'inView', function () {

            describe( 'When the element selection', function () {

                it( 'is empty, inView returns an empty jQuery set', function () {
                    expect( $().inView() ).to.eql( $() );
                } );

                it( 'consists of two elements, the first being in view, the second out of view, inView returns the first element', function () {
                    $elOut.insertAfter( $el );
                    expect( $container.children().inView() ).to.eql( $el );
                } );

                it( 'consists of two elements, the first being out of view, the second in view, inView returns the second element', function () {
                    $elOut.insertBefore( $el );
                    expect( $container.children().inView() ).to.eql( $el );
                } );

            } );

            describe( 'The method does not rely on the exposed plugin API. When all other public methods of the plugin are deleted from jQuery', function () {

                var deletedApi;

                beforeEach( function () {
                    deletedApi = deletePluginApiExcept( "inView" );
                } );

                afterEach( function () {
                    restorePluginApi( deletedApi );
                } );

                it( 'it works correctly for a window container. When the element is in view in the global window, $.fn.inView returns the element', function () {
                    expect( $el.inView() ).to.eql( $el );
                } );

                it( 'it works correctly for a an HTMLElement container. When the element is in view in another element set to overflow:auto, $.fn.inView returns the element', function () {
                    $container
                        .contentBox( 200, 200 )
                        .overflow ( "auto" );

                    expect( $el.inView( $container ) ).to.eql( $el );
                } );

            } );

        } );

        describe( ':inViewport', function () {

            describe( 'When the element selection', function () {

                // NB Filters return a jQuery object which contains additional information (such as the set of elements
                // before filtering, in a prevObject property). Therefore, the results object can't be compared to "normal"
                // jQuery selections directly, as they won't be deeply equal. Instead, we compare the underlying array of
                // DOM nodes, with .get().

                it( 'is empty, :inViewport returns an empty jQuery set', function () {
                    expect( $().filter( ':inViewport' ).get() ).to.eql( $().get() );
                } );

                it( 'consists of two elements, the first being in view, the second out of view, :inViewport returns the first element', function () {
                    // We test the selector in two notations: on its own (':inViewport'), and appended to another selector
                    // ('div:inViewport').
                    $elOut.insertAfter( $el );
                    expect( $container.children().filter( ':inViewport' ).get() ).to.eql( $el.get() );
                    expect( $container.children().filter( 'div:inViewport' ).get() ).to.eql( $el.get() );
                } );

                it( 'consists of two elements, the first being out of view, the second in view, :inViewport returns the second element', function () {
                    // We test the selector in two notations: on its own (':inViewport'), and appended to another selector
                    // ('div:inViewport').
                    $elOut.insertBefore( $el );
                    expect( $container.children().filter( ':inViewport' ).get() ).to.eql( $el.get() );
                    expect( $container.children().filter( 'div:inViewport' ).get() ).to.eql( $el.get() );
                } );

            } );

            describe( 'The filter does not rely on the exposed plugin API. When all public methods of the plugin, except the filter, are deleted from jQuery', function () {

                var deletedApi;

                beforeEach( function () {
                    deletedApi = deletePluginApi();
                } );

                afterEach( function () {
                    restorePluginApi( deletedApi );
                } );

                it( 'it works correctly. When the element is in view in the global window, :inViewport returns the element', function () {
                    expect( $el.filter( ':inViewport' ).get() ).to.eql( $el.get() );
                } );

            } );

        } );

    } );

})();