/*global describe, it */
(function () {
    "use strict";

    describe( 'External API: jQuery.css', function () {

        describe( 'When called with the signature introduced in jQuery 1.9.0', function () {

            var el, $el, elComputedStyles;

            beforeEach( function () {
                el = document.createElement( "div" );
                $el = $( el ).prependTo( "body" );
                elComputedStyles = window.getComputedStyle( el );
            } );

            afterEach( function () {
                $el.remove();
            } );

            it( 'returns a computed value for a CSS property when the property has been defined and is non-zero', function () {
                $el.css( { padding: "2px" } );
                expect( $.css( el, "paddingTop", false, elComputedStyles ) ).to.equal( "2px" );
            } );

            it( 'returns a computed value for a CSS property when the property has been left at its default and is zero', function () {
                // We accept a return value of "0" or "0px". We don't make assumptions about browser behaviour here.
                expect( $.css( el, "paddingTop", false, elComputedStyles ) ).to.match( /^0(px)?/ );
            } );

        } );

    } );

})();