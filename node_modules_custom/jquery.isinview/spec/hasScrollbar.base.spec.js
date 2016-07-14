/*global describe, it */
(function () {
    "use strict";

    describe( '$.fn.hasScrollbar: Basics', function () {

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

            it( 'is empty, $.fn.hasScrollbar returns undefined', function () {
                expect( $().hasScrollbar() ).to.be.undefined;
            } );

            it( 'consists of more than one element, only the first one is examined and the others are ignored', function () {
                // We test this by
                // (a) creating scroll bars on the second element, and none on the first, and then
                // (b) creating scroll bars on the first element and none on the second
                var $elScroll = $( '<div id="foo"/>' ).contentBox( 50, 50 ).contentOnly().overflow( "auto" );
                forceScrollbar( $elScroll, "vertical" );

                $elScroll.insertAfter( f.$el );
                expect( f.$stage.children().hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );

                $elScroll.insertBefore( f.$el );
                expect( f.$stage.children().hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
            } );

        } );

        describe( 'The axis parameter', function () {

            it( 'accepts the value "horizontal"', function () {
                expect( function () { f.$el.hasScrollbar( "horizontal" ); } ).not.to.throw( Error );
            } );

            it( 'accepts the value "vertical"', function () {
                expect( function () { f.$el.hasScrollbar( "vertical" ); } ).not.to.throw( Error );
            } );

            it( 'accepts the value "both"', function () {
                expect( function () { f.$el.hasScrollbar( "both" ); } ).not.to.throw( Error );
            } );

            it( 'throws an error if the value is an unknown string', function () {
                expect( function () { f.$el.hasScrollbar( "other" ); } ).to.throw( Error );
            } );

            it( 'defaults to "both" if left undefined', function () {
                var result = f.$el.hasScrollbar();
                expect( result ).to.be.an( "object" );
                expect( result ).to.have.property( "vertical" );
                expect( result ).to.have.property( "horizontal" );
            } );

            it( 'defaults to "both" if it is falsy', function () {
                var result = f.$el.hasScrollbar( "" );
                expect( result ).to.be.an( "object" );
                expect( result ).to.have.property( "vertical" );
                expect( result ).to.have.property( "horizontal" );
            } );

        } );

        describe( 'The axis is set to "horizontal"', function () {

            it( 'When the element does not have scroll bars, $.fn.hasScrollbar returns false', function () {
                expect( f.$el.hasScrollbar( "horizontal" ) ).to.be.false;
            } );

            it( 'When the element has a vertical scroll bar, and not a horizontal one, $.fn.hasScrollbar returns false', function () {
                forceScrollbar( f.$el, "vertical" );
                expect( f.$el.hasScrollbar( "horizontal" ) ).to.be.false;
            } );

            it( 'When the element has a horizontal scroll bar, and not a vertical one, $.fn.hasScrollbar returns true', function () {
                forceScrollbar( f.$el, "horizontal" );
                expect( f.$el.hasScrollbar( "horizontal" ) ).to.be.true;
            } );

        } );

        describe( 'The axis is set to "vertical"', function () {

            it( 'When the element does not have scroll bars, $.fn.hasScrollbar returns false', function () {
                expect( f.$el.hasScrollbar( "vertical" ) ).to.be.false;
            } );

            it( 'When the element has a vertical scroll bar, and not a horizontal one, $.fn.hasScrollbar returns true', function () {
                forceScrollbar( f.$el, "vertical" );
                expect( f.$el.hasScrollbar( "vertical" ) ).to.be.true;
            } );

            it( 'When the element has a horizontal scroll bar, and not a vertical one, $.fn.hasScrollbar returns false', function () {
                forceScrollbar( f.$el, "horizontal" );
                expect( f.$el.hasScrollbar( "vertical" ) ).to.be.false;
            } );

        } );

        describe( 'The axis is set to "both"', function () {

            it( 'When the element has a vertical scroll bar, and not a horizontal one, $.fn.hasScrollbar returns an object representing the state of both scroll bars', function () {
                forceScrollbar( f.$el, "vertical" );
                expect( f.$el.hasScrollbar( "both" ) ).to.eql( { horizontal: false, vertical: true } );
            } );

        } );

        describe( 'The method does not rely on the exposed plugin API. When all other public methods of the plugin are deleted from jQuery', function () {

            var deletedApi;

            beforeEach( function () {
                deletedApi = deletePluginApiExcept( "hasScrollbar" );
            } );

            afterEach( function () {
                restorePluginApi( deletedApi );
            } );

            it( 'it works correctly. When the element has a vertical scroll bar, and not a horizontal one, $.fn.hasScrollbar returns an object representing the state of both scroll bars', function () {
                forceScrollbar( f.$el, "vertical" );
                expect( f.$el.hasScrollbar( "both" ) ).to.eql( { horizontal: false, vertical: true } );
            } );

        } );

    } );

})();