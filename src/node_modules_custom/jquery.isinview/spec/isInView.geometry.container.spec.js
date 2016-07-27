/*global describe, it, $ */
(function () {
    "use strict";

    describe( 'isInView: Container geometry', function () {

        /** @type {DOMFixture}  populated by Setup.create() */
        var f;

        // Increase timeout to allow ample time for child window creation. Make it long enough to dismiss modal warning
        // dialogs in iOS, too, which must be done manually.
        this.timeout( 64000 );

        afterEach( function () {
            f.cleanDom();
        } );

        after( function () {
            f.shutdown();
        } );


        // NB A container with content area only (no padding, borders, margins) has been the basis for the element
        // geometry tests, and does not have to be reconsidered when testing specific container geometries.

        // NB The following scenarios are window only (iframe, window, child window).

        withData( {

            "the global window as container": "window",
            "an iframe as container": "iframe",
            "a child window as container": "childWindow",
            "the global window as container (box-sizing: border-box)": "windowBorderBox",
            "an iframe as container (box-sizing: border-box)": "iframeBorderBox"

        }, function ( setupType ) {

            var viewportWidth, viewportHeight, $body, $htmlElement;

            beforeEach( function () {

                f = Setup.create( setupType, f );

                return f.ready.done( function () {
                    viewportWidth = $( f.window ).width();
                    viewportHeight = $( f.window ).height();

                    $body = $( f.document.body );
                    $htmlElement = $( f.document.documentElement );
                } );

            } );

            describe( 'A viewport containing a document with padding, borders, or margins', function () {

                // Here, we are checking if the viewport size is determined correctly, and is not thrown off by
                // padding on the document body or the html element.

                describe( 'When the element is absolutely positioned at the top right of the document and is the size of the viewport', function () {

                    beforeEach( function () {

                        f.$el
                            .contentBox( viewportWidth, viewportHeight )
                            .positionAt( 0, 0 );
                    } );

                    it( 'it is in view when there is padding on the body', function () {
                        $body.padding( 10 );
                        expect( f.$el.isInView() ).to.be.true;
                    } );

                    it( 'it is in view when there is padding on the html element', function () {
                        $htmlElement.padding( 10 );
                        expect( f.$el.isInView() ).to.be.true;
                    } );

                    it( 'it is in view when there is a border on the body', function () {
                        $body.border( 10 );
                        expect( f.$el.isInView() ).to.be.true;
                    } );

                    it( 'it is in view when there is a border on the html element', function () {
                        $htmlElement.border( 10 );
                        expect( f.$el.isInView() ).to.be.true;
                    } );

                    it( 'it is in view when there is a margin on the body', function () {
                        $body.margin( 10 );
                        expect( f.$el.isInView() ).to.be.true;
                    } );

                    it( 'it is in view when there is a margin on the html element', function () {
                        $htmlElement.margin( 10 );
                        expect( f.$el.isInView() ).to.be.true;
                    } );

                } );

            } );

        } );

        // NB The following scenarios are not applicable to window containers, but to divs with overflow auto,
        // scroll, hidden.

        withData( {

            "a div set to overflow:auto as container": "overflowAuto",
            "a div set to overflow:scroll as container": "overflowScroll",
            "a div set to overflow:hidden as container": "overflowHidden",
            "a div set to overflow:auto as container (box-sizing: border-box)": "overflowAutoBorderBox"

        }, function ( setupType ) {

            beforeEach( function () {

                f = Setup.create( setupType, f );
                return f.ready;

            } );

            describe( 'A container with padding', function () {

                var padding,
                    containerInnerWidth, containerInnerHeight,
                    containerInnerWidthUpToScrollbar, containerInnerHeightUpToScrollbar;

                beforeEach( function () {
                    padding = $.scrollbarWidth() + 2;
                    f.$container.padding( padding );

                    containerInnerWidth = f.$container.width();
                    containerInnerHeight = f.$container.height();

                    // Inner width and height when a scroll bar appears in the container (excluding the scrollbar)
                    containerInnerWidthUpToScrollbar = containerInnerWidth - $.scrollbarWidth();
                    containerInnerHeightUpToScrollbar = containerInnerHeight - $.scrollbarWidth();
                } );

                if ( setupType !== "overflowScroll" ) {

                    describe( 'When the element is inside the container and extends into the padding vertically, without being obscured by the resulting vertical scroll bar', function () {
                        // No scroll bar appears with overflow:hidden, but as the scroll bar is inconsequential to the
                        // setup, the results are the same.
                        beforeEach( function () {
                            f.$el.contentBox( 10, containerInnerHeight + padding );
                        } );

                        it( 'it is in view', function () {
                            expect( f.$el.isInView( f.$container ) ).to.be.true;
                        } );

                        it( 'its content area is in view', function () {
                            expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.true;
                        } );

                    } );

                }

                if ( setupType === "overflowHidden" ) {

                    describe( 'When the element is as wide as the container and also extends into the padding vertically, taking up all the width normally occupied by the bottom padding', function () {
                        // If the container had an overflow setting allowing scroll bars, a vertical scroll bar would
                        // appear and obscure part of the element. With overflow:hidden, this doesn't happen, and the
                        // element remains fully in view.

                        beforeEach( function () {
                            f.$el.contentBox( containerInnerWidth, containerInnerHeight + padding );
                        } );

                        it( 'it is in view', function () {
                            expect( f.$el.isInView( f.$container ) ).to.be.true;
                        } );

                        it( 'it is in partial view', function () {
                            expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.true;
                        } );

                        it( 'its content area is in view', function () {
                            expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.true;
                        } );

                        it( 'its content area is in partial view', function () {
                            expect( f.$el.isInView( f.$container, {
                                partially: true,
                                box: "content-box"
                            } ) ).to.be.true;
                        } );

                    } );
                }

                // Removed test (for setupType !== "overflowHidden" && $.scrollbarWidth() > 0):
                //
                // - When the element is inside the container and extends into the padding vertically, and is
                //   obscured by the resulting vertical scroll bar: it is not in view (nor in partial view)
                //
                // This test presumes that the bottom padding is pushed down by the content, causing scroll bars to
                // appear. But the actual behaviour is inconsistent across browsers. Padding is pushed down in
                // Chrome and Safari. In FF, IE, and Opera, the padding is squashed, and scroll bars don't appear.
                //
                // See http://jsbin.com/lokavo/9/ for an illustration.

                if ( setupType !== "overflowScroll" ) {

                    describe( 'When the element is inside the container and extends into the right padding, taking up all the width normally occupied by the right padding', function () {
                        // The horizontal right padding is squashed, not pushed out. A scroll bar does _not_ appear in
                        // this case.
                        //
                        // Again, see http://jsbin.com/lokavo/9/ for an example.

                        beforeEach( function () {
                            f.$el.contentBox( containerInnerWidth + padding, containerInnerHeight );
                        } );

                        it( 'it is in view', function () {
                            expect( f.$el.isInView( f.$container ) ).to.be.true;
                        } );

                        it( 'its content area is in view', function () {
                            expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.true;
                        } );

                    } );

                }

                if ( setupType !== "overflowHidden" && $.scrollbarWidth() > 0 ) {

                    describe( 'When the element is inside the container and extends into the bottom padding, and is obscured by a horizontal scroll bar which it has not triggered itself', function () {
                        // The horizontal scroll bar appears because of another element.

                        beforeEach( function () {
                            forceScrollbar( f.$container, "horizontal" );
                            f.$el.contentBox( 10, containerInnerHeight + padding );
                        } );

                        it( 'it is not in view', function () {
                            expect( f.$el.isInView( f.$container ) ).to.be.false;
                        } );

                        it( 'it is in partial view', function () {
                            expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.true;
                        } );

                        it( 'its content area is not in view', function () {
                            expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.false;
                        } );

                        it( 'its content area is in partial view', function () {
                            expect( f.$el.isInView( f.$container, {
                                partially: true,
                                box: "content-box"
                            } ) ).to.be.true;
                        } );

                    } );

                }

            } );

            describe( 'A container with borders', function () {

                var border,
                    containerInnerWidth, containerInnerHeight;

                beforeEach( function () {
                    border = 1;
                    f.$container.border( border );

                    containerInnerWidth = f.$container.width();
                    containerInnerHeight = f.$container.height();
                } );

                if ( setupType !== "overflowScroll" ) {

                    describe( 'When an element takes up the full content area of the container, lining up with the border (and no scroll bars are present)', function () {
                        // We check the correct handling of the border here, not that of scroll bars. So we make sure that
                        // there is just one element in the container, so there aren't any scroll bars.

                        beforeEach( function () {
                            f.$el.contentBox( containerInnerWidth, containerInnerHeight );
                        } );

                        it( 'it is in view', function () {
                            expect( f.$el.isInView( f.$container ) ).to.be.true;
                        } );

                        it( 'its content area is in view', function () {
                            expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.true;
                        } );

                    } );

                }

                describe( 'When an element is inside the container and extends into the area occupied by the top border of the container, but not beyond it', function () {
                    // This also causes at least one scroll bar to appear, or perhaps both of them.

                    beforeEach( function () {
                        f.$el
                            .contentBox( 10, containerInnerHeight + 1 )
                            .relPositionAt( -1, 0 );
                    } );

                    it( 'it is not in view', function () {
                        expect( f.$el.isInView( f.$container ) ).to.be.false;
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.true;
                    } );

                    it( 'its content area is not in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.false;
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                    } );

                } );

                describe( 'When an element is inside the container and extends into the area occupied by the left border of the container, but not beyond it', function () {
                    // This also causes at least one scroll bar to appear, or perhaps both of them.

                    beforeEach( function () {
                        f.$el
                            .contentBox( containerInnerWidth + 1, 10 )
                            .relPositionAt( 0, -1 );
                    } );

                    it( 'it is not in view', function () {
                        expect( f.$el.isInView( f.$container ) ).to.be.false;
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.true;
                    } );

                    it( 'its content area is not in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.false;
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                    } );

                } );

                describe( 'When an element is inside the container and extends into the area occupied by the bottom border of the container, but not beyond it', function () {
                    // This also causes at least one scroll bar to appear, or perhaps both of them.

                    beforeEach( function () {
                        f.$el.contentBox( 10, containerInnerHeight + 1 );
                    } );

                    it( 'it is not in view', function () {
                        expect( f.$el.isInView( f.$container ) ).to.be.false;
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.true;
                    } );

                    it( 'its content area is not in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.false;
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                    } );

                } );

                describe( 'When an element is inside the container and extends into the area occupied by the right border of the container, but not beyond it', function () {
                    // This also causes at least one scroll bar to appear, or perhaps both of them.

                    beforeEach( function () {
                        f.$el.contentBox( containerInnerWidth + 1, 10 );
                    } );

                    it( 'it is not in view', function () {
                        expect( f.$el.isInView( f.$container ) ).to.be.false;
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.true;
                    } );

                    it( 'its content area is not in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.false;
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                    } );

                } );

            } );

            describe( 'A container with margins', function () {

                var margin,
                    containerInnerWidth, containerInnerHeight;

                beforeEach( function () {
                    margin = 10;
                    f.$container.margin( margin );

                    containerInnerWidth = f.$container.width();
                    containerInnerHeight = f.$container.height();
                } );

                if ( setupType !== "overflowScroll" ) {

                    describe( 'When an element is exactly as large as the content area of the container, and the container has margins', function () {

                        beforeEach( function () {
                            f.$el.contentBox( containerInnerWidth, containerInnerHeight );
                        } );

                        it( 'it is in view', function () {
                            expect( f.$el.isInView( f.$container ) ).to.be.true;
                        } );

                        it( 'its content area is in view', function () {
                            expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.true;
                        } );

                    } );

                }

                describe( 'When an element is larger than the content area of the container, and extends into its margin (but not beyond)', function () {

                    beforeEach( function () {
                        f.$el.contentBox( containerInnerWidth + 1, 10 );
                    } );

                    it( 'it is not in view', function () {
                        expect( f.$el.isInView( f.$container ) ).to.be.false;
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.true;
                    } );

                    it( 'its content area is not in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.false;
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                    } );

                } );

                describe( 'When an element is outside of the content area of the container, but fully inside of one margin of the container', function () {

                    beforeEach( function () {
                        f.$el
                            .contentBox( margin, margin )
                            .relPositionAt( -margin, 0 );
                    } );

                    it( 'it is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.false;
                    } );

                    it( 'its content area is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                    } );

                } );

                if ( setupType !== "overflowScroll" ) {

                    describe( 'When an element would be too wide for a container without margins, and the container is expanded with negative margins to encompass the element', function () {
                        // For this, we need an outer div into which the container is placed. By declaring width:auto for
                        // the container, it expands to the size of the outer div. With negative left and right margins, it
                        // expands even further.
                        //
                        // The element just gets fixed dimensions to make it as large as the container. This means that a
                        // part of the element would be obscured by the container if the container didn't have negative
                        // margins. $.isInView must not be confused by that.
                        //
                        // Again, see http://jsbin.com/jucazo/3/edit for an example of expansion by negative margins.

                        var overflow, $outer, $container;

                        beforeEach( function () {
                            // Because we repurpose the container from the fixture, f.$container, we need to transfer the
                            // overflow setting to the actual container in this test.
                            overflow = f.$container.css( "overflow" );

                            $outer = f.$container
                                .contentBox( 100, 100 )
                                .overflow( "visible" )
                                .margin( 50 );

                            $container = $( "<div/>", f.document )
                                .appendTo( $outer )
                                .append( f.$el )
                                .css( {
                                    width: "auto",
                                    height: "200px"
                                } )
                                .overflow( overflow )
                                .leftMargin( -50 )
                                .rightMargin( -50 );

                            f.$el.contentBox( 200, 50 );
                        } );

                        it( 'it is in view', function () {
                            expect( f.$el.isInView( $container ) ).to.be.true;
                        } );

                        it( 'its content area is in view', function () {
                            expect( f.$el.isInView( $container, { box: "content-box" } ) ).to.be.true;
                        } );

                    } );

                }

            } );

        } );


    } );

})();