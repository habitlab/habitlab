// !!!!!!!!!!!!!!!!!!!!!!!!!!
// Depends on basic-utils.js
// !!!!!!!!!!!!!!!!!!!!!!!!!!

$.fn.padding = function ( size ) {
    return this.css( { padding: toPx( size ) } );
};

$.fn.topPadding = function ( size ) {
    return this.css( { paddingTop: toPx( size ) } );
};

$.fn.rightPadding = function ( size ) {
    return this.css( { paddingRight: toPx( size ) } );
};

$.fn.bottomPadding = function ( size ) {
    return this.css( { paddingBottom: toPx( size ) } );
};

$.fn.leftPadding = function ( size ) {
    return this.css( { paddingLeft: toPx( size ) } );
};

$.fn.border = function ( size ) {
    if ( parseFloat( size ) === 0 ) {
        return this.css( { border: "none" } );
    } else {
        return this.css( { border: toPx( size ) + " solid grey" } );
    }
};

$.fn.topBorder = function ( size ) {
    if ( parseFloat( size ) === 0 ) {
        return this.css( { borderTop: "none" } );
    } else {
        return this.css( { borderTop: toPx( size ) + " solid grey" } );
    }
};

$.fn.rightBorder = function ( size ) {
    if ( parseFloat( size ) === 0 ) {
        return this.css( { borderRight: "none" } );
    } else {
        return this.css( { borderRight: toPx( size ) + " solid grey" } );
    }
};

$.fn.bottomBorder = function ( size ) {
    if ( parseFloat( size ) === 0 ) {
        return this.css( { borderBottom: "none" } );
    } else {
        return this.css( { borderBottom: toPx( size ) + " solid grey" } );
    }
};

$.fn.leftBorder = function ( size ) {
    if ( parseFloat( size ) === 0 ) {
        return this.css( { borderLeft: "none" } );
    } else {
        return this.css( { borderLeft: toPx( size ) + " solid grey" } );
    }
};

$.fn.margin = function ( size ) {
    return this.css( { margin: toPx( size ) } );
};

$.fn.topMargin = function ( size ) {
    return this.css( { marginTop: toPx( size ) } );
};

$.fn.rightMargin = function ( size ) {
    return this.css( { marginRight: toPx( size ) } );
};

$.fn.bottomMargin = function ( size ) {
    return this.css( { marginBottom: toPx( size ) } );
};

$.fn.leftMargin = function ( size ) {
    return this.css( { marginLeft: toPx( size ) } );
};

$.fn.box = function ( width, height ) {
    return this.css( {
        width:  width + "px",
        height: height + "px"
    } );
};

$.fn.contentBox = function ( width, height ) {
    return this.width( width ).height( height );
};

$.fn.noSize = function () {
    return this.css( {
        width: "",
        height: ""
    } );
};

$.fn.paddingAndBorder = function ( paddingSize, borderSize ) {
    if ( isUndefined( paddingSize ) ) paddingSize = 9;
    if ( isUndefined( borderSize ) ) borderSize = 1;
    return this.padding( paddingSize ).border( borderSize );
};

$.fn.noPadding = function () {
    return this.padding( 0 );
};

$.fn.noBorder = function () {
    return this.border( 0 );
};

$.fn.noMargin = function () {
    return this.margin( 0 );
};

$.fn.contentOnly = function () {
    return this.padding( 0 ).border( 0 ).margin( 0 );
};

$.fn.floatLeft = function () {
    return this.css( { float: "left" } );
};

$.fn.positionAt =
$.fn.absPositionAt = function ( top, left ) {
    return this.css( {
        position: "absolute",
        top: toPx( top ),
        left: toPx( left )
    } );
};

$.fn.relPositionAt = function ( top, left ) {
    return this.css( {
        position: "relative",
        top: toPx( top ),
        left: toPx( left )
    } );
};

$.fn.inFlow = function () {
    return this.css( {
        position: "static",
        top: "",
        left: ""
    } );
};

$.fn.overflow = function ( value ) {
    return this.css( { overflow: value } );
};

$.fn.overflowX = function ( value ) {
    return this.css( { "overflow-x": value } );
};

$.fn.overflowY = function ( value ) {
    return this.css( { "overflow-y": value } );
};

$.fn.boxModel = function ( value ) {
    if ( value ) {
        return this.css( { boxSizing: value } );
    } else {
        return this.css( "box-sizing" );
    }
};


function toPx ( value ) {
    return isNumber( value ) ? value + "px" : value;
}


