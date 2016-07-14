// amd.js

require( [

    'jquery',
    'underscore',
    'jquery.isinview'

], function ( $, _ ) {

    var $scrollable = $( ".container" ),
        $items,

        $markedFull = $(),
        $markedFullContent = $(),
        $markedPartialContent = $(),
        $markedPartial = $(),

        setStatus = function () {

            var $partial = $items.inView( $scrollable, { partially: true } ),
                $partialContent = $partial.inView( $scrollable, { partially: true, box: "content-box" } ),
                $fullContent = $partialContent.inView( $scrollable, { box: "content-box" } ),
                $full = $fullContent.inView( $scrollable );

            $partial = $partial.not( $partialContent );
            $partialContent = $partialContent.not( $fullContent );
            $fullContent = $fullContent.not( $full );

            $full.addClass( "full" );
            $markedFull.not( $full ).removeClass( "full" );

            $fullContent.addClass( "fullContent" );
            $markedFullContent.not( $fullContent ).removeClass( "fullContent" );

            $partialContent.addClass( "partialContent" );
            $markedPartialContent.not( $partialContent ).removeClass( "partialContent" );

            $partial.addClass( "partial" );
            $markedPartial.not( $partial ).removeClass( "partial" );

            $markedFull = $full;
            $markedFullContent = $fullContent;
            $markedPartialContent = $partialContent;
            $markedPartial = $partial;

        };

    createItems( 500, $scrollable );
    $items = $( ".item" );

    $scrollable.scroll( _.throttle( setStatus, 100 ) );
    setStatus();

    function createItems ( count, $container ) {
        var i, elem, inner,
            container = $container[0],
            doc = container.ownerDocument,
            fragment = doc.createDocumentFragment();

        for ( i = 0; i < count; i++ ) {
            inner = doc.createElement( "div" );
            inner.setAttribute( "class", "inner" );
            inner.appendChild( doc.createTextNode( String ( i + 1 ) ) );

            elem = doc.createElement( "div" );
            elem.setAttribute( "class", "item" );
            elem.appendChild( inner );

            fragment.appendChild( elem );
        }

        container.appendChild( fragment );
    }

} );
