/**
 * Forces a scroll bar, or both scroll bars, to appear on a scrollable element (or scrollable parent of that element).
 *
 * Does not ensure the "scrollability" of the element, ie it does not set the overflow property to "auto" or "scroll"
 * on an HTML element.
 *
 * ATTN Side effects:
 *
 * - If the element is in the normal flow and not positioned, it is switched to "position: relative"!
 * - Creates a div, appends it to the element and positions it outside of it to make a scroll bar appear.
 *
 * @param {HTMLElement|jQuery} elem
 * @param {string}             direction  "horizontal", "vertical", "both"
 */
function forceScrollbar ( elem, direction ) {
    var horizontal = direction === "horizontal" || direction === "both",
        vertical = direction === "vertical" || direction === "both",

        $elem = elem instanceof $ ? elem : $( elem ),
        doc = $elem[0].ownerDocument,
        $win = $( doc.defaultView || doc.parentWindow ),
        viewportWidth = $win.width(),
        viewportHeight = $win.height();

    if ( $elem.css( "position" ) === "static" || $elem.css( "position" ) === "" ) $elem.css( { position: "relative" } );

    $( "<div/>", doc )
        .css( {
            position: "absolute",
            width: horizontal ? 2 * viewportWidth : "1px",
            height: vertical ? 2 * viewportHeight : "1px",
            top: 0,
            left: 0
        } )
        .appendTo( $elem );
}

/**
 * Deletes all methods, except one, which have been added by the plugin to jQuery and jQuery.fn. Returns an object
 * containing the deleted methods, for restoration with restorePluginApi().
 *
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *
 * ATTN!
 * The plugin API is hard-coded in this method! When the API changes or is added to, the hard-coded list must be changed
 * accordingly!
 *
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *
 * @param {string}  exceptionName           name of the method which should not be removed
 * @param {boolean} [isJQueryGlobal=false]  whether or not the exception is attached to $ directly, rather than $.fn
 * @returns {{global: {}, fn: {}}}          the removed methods, stored in the .global and .fn properties
 */
function deletePluginApiExcept ( exceptionName, isJQueryGlobal ) {
    var globalApi = [],
        fnApi = [ "hasScrollbar", "scrollbarWidth", "ownerWindow", "inView", "inViewport", "isInView", "isInViewport" ],
        removed = { global: {}, fn:{} };

    $.each( globalApi, function ( index, name ) {
        if ( ! isJQueryGlobal || exceptionName !== name ) {
            removed.global[ name ] = $[ name ];
            delete $[ name ];
        }
    } );

    $.each( fnApi, function ( index, name ) {
        if ( isJQueryGlobal || exceptionName !== name ) {
            removed.fn[name] = $.fn[name];
            delete $.fn[name];
        }
    } );

    return removed;
}

/**
 * Deletes all methods which have been added by the plugin to jQuery and jQuery.fn. Returns an object containing the
 * deleted methods, for restoration with restorePluginApi().
 *
 * @returns {{global: {}, fn: {}}}          the removed methods, stored in the .global and .fn properties
 */
function deletePluginApi () {
    return deletePluginApiExcept( "" );
}

function restorePluginApi ( removed ) {

    $.each( removed.global, function ( name, func ) {
        $[ name ] = func;
    } );

    $.each( removed.fn, function ( name, func ) {
        $.fn[ name ] = func;
    } );

}


