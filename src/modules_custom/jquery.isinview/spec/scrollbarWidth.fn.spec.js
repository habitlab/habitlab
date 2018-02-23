/*global describe, it */
(function () {
    "use strict";

    describeUnless(
        isIE( { eq: 10 } ),
        "Skipped in IE10 because of erratic behaviour of the test suite, see note at the top of ownerWindow.spec.js",
        '$.fn.scrollbarWidth', function () {

        // Fixture
        var f;

        beforeEach( function () {
            f = Setup.create( "window", null, { hidePreexistingBodyContent: false } );

            return f.ready.done( function () {
                f.$el.overflow( "auto" );
            } );
        } );

        afterEach( function () {
            f.cleanDom();
        } );

        describe( 'When the element selection', function () {

            it( 'is empty, $.fn.scrollbarWidth returns undefined', function () {
                expect( $().scrollbarWidth() ).to.be.undefined;
            } );

            it( 'consists of more than one element, only the first one is examined and the others are ignored', function () {
                // We test this by
                // (a) creating scroll bars on the second element, and none on the first, and then
                // (b) creating scroll bars on the first element and none on the second
                var $elScroll = $( '<div id="foo"/>' ).contentBox( 50, 50 ).contentOnly().overflow( "auto" );
                forceScrollbar( $elScroll, "vertical" );

                $elScroll.insertAfter( f.$el );
                expect( f.$stage.children().scrollbarWidth() ).to.eql( { horizontal: 0, vertical: 0 } );

                $elScroll.insertBefore( f.$el );
                expect( f.$stage.children().scrollbarWidth() ).to.eql( { horizontal: 0, vertical: $.scrollbarWidth() } );
            } );

        } );

        describe( 'The axis parameter', function () {

            it( 'accepts the value "horizontal"', function () {
                expect( function () { f.$el.scrollbarWidth( "horizontal" ); } ).not.to.throw( Error );
            } );

            it( 'accepts the value "vertical"', function () {
                expect( function () { f.$el.scrollbarWidth( "vertical" ); } ).not.to.throw( Error );
            } );

            it( 'accepts the value "both"', function () {
                expect( function () { f.$el.scrollbarWidth( "both" ); } ).not.to.throw( Error );
            } );

            it( 'throws an error if the value is an unknown string', function () {
                expect( function () { f.$el.scrollbarWidth( "other" ); } ).to.throw( Error );
            } );

            it( 'defaults to "both" if left undefined', function () {
                var result = f.$el.scrollbarWidth();
                expect( result ).to.be.an( "object" );
                expect( result ).to.have.property( "vertical" );
                expect( result ).to.have.property( "horizontal" );
            } );

            it( 'defaults to "both" if it is falsy', function () {
                var result = f.$el.scrollbarWidth( "" );
                expect( result ).to.be.an( "object" );
                expect( result ).to.have.property( "vertical" );
                expect( result ).to.have.property( "horizontal" );
            } );

        } );

        describe( 'The axis is set to "horizontal"', function () {

            it( 'When the element does not have scroll bars, $.fn.scrollbarWidth returns 0', function () {
                expect( f.$el.scrollbarWidth( "horizontal" ) ).to.equal( 0 );
            } );

            it( 'When the element has a vertical scroll bar, and not a horizontal one, $.fn.scrollbarWidth returns 0', function () {
                forceScrollbar( f.$el, "vertical" );
                expect( f.$el.scrollbarWidth( "horizontal" ) ).to.equal( 0 );
            } );

            it( 'When the element has a horizontal scroll bar, and not a vertical one, $.fn.scrollbarWidth returns the global scroll bar width', function () {
                forceScrollbar( f.$el, "horizontal" );
                expect( f.$el.scrollbarWidth( "horizontal" ) ).to.equal( $.scrollbarWidth() );
            } );

        } );

        describe( 'The axis is set to "vertical"', function () {

            it( 'When the element does not have scroll bars, $.fn.scrollbarWidth returns 0', function () {
                expect( f.$el.scrollbarWidth( "vertical" ) ).to.equal( 0 );
            } );

            it( 'When the element has a vertical scroll bar, and not a horizontal one, $.fn.scrollbarWidth returns the global scroll bar width', function () {
                forceScrollbar( f.$el, "vertical" );
                expect( f.$el.scrollbarWidth( "vertical" ) ).to.equal( $.scrollbarWidth() );
            } );

            it( 'When the element has a horizontal scroll bar, and not a vertical one, $.fn.scrollbarWidth returns 0', function () {
                forceScrollbar( f.$el, "horizontal" );
                expect( f.$el.scrollbarWidth( "vertical" ) ).to.equal( 0 );
            } );

        } );

        describe( 'The axis is set to "both"', function () {

            it( 'When the element has a vertical scroll bar, and not a horizontal one, $.fn.scrollbarWidth returns an object representing the state and width of both scroll bars', function () {
                forceScrollbar( f.$el, "vertical" );
                expect( f.$el.scrollbarWidth( "both" ) ).to.eql( { horizontal: 0, vertical: $.scrollbarWidth() } );
            } );

        } );

        describe( 'The method does not rely on the exposed plugin API. When all other public methods of the plugin are deleted from jQuery', function () {

            var globalScrollBarWidth, deletedApi;

            beforeEach( function () {
                globalScrollBarWidth = $.scrollbarWidth();
                deletedApi = deletePluginApiExcept( "scrollbarWidth" );
            } );

            afterEach( function () {
                restorePluginApi( deletedApi );
            } );

            it( 'it works correctly. When the element has a vertical scroll bar, and not a horizontal one, $.fn.scrollbarWidth returns an object representing the state and width of both scroll bars', function () {
                forceScrollbar( f.$el, "vertical" );
                expect( f.$el.scrollbarWidth( "both" ) ).to.eql( { horizontal: 0, vertical: globalScrollBarWidth } );
            } );

        } );

    } );

})();