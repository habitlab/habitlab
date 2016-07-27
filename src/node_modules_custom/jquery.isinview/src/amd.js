;( function ( root, factory ) {
    "use strict";

    if ( typeof exports === 'object' ) {

        module.exports = factory(
            require( 'jquery' ),
            require( 'jquery.documentsize' )
        );

    } else if ( typeof define === 'function' && define.amd ) {

        define( [
            'jquery',
            'jquery.documentsize'
        ], factory );

    }
}( this, function ( jQuery ) {
    "use strict";

    // @include jquery.isinview.js

} ));

