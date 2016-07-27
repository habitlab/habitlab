/*global describe, it, $ */
(function () {
    "use strict";

    describe( 'isInView: Element geometry. An element with a content area only (no padding, borders, margins)', function () {

        /** @type {DOMFixture}  populated by Setup.create() */
        var f,

            scenarios = isPhantomJs() ?
                        {
                            // PhantomJS is excluded from many tests because its behaviour is markedly different from
                            // ordinary browsers. It doesn't have a window of a given size - its "window" automatically
                            // expands to the size of the document. The tests don't accommodate this behaviour.
                            "a div set to overflow:auto as container": "overflowAuto",
                            "a div set to overflow:scroll as container": "overflowScroll",
                            "a div set to overflow:hidden as container": "overflowHidden"

                        } :
                        {

                            "the global window as container": "window",
                            "an iframe as container": "iframe",
                            "a child window as container": "childWindow",
                            "a div set to overflow:auto as container": "overflowAuto",
                            "a div set to overflow:scroll as container": "overflowScroll",
                            "a div set to overflow:hidden as container": "overflowHidden"

                        };

        // SlimerJS is excluded from tests taking place in a child window. SlimerJS seems to suppress scroll bars in a
        // child window, regardless of settings. The tests don't handle that. This is a SlimerJS peculiarity - the
        // corresponding Firefox version, based on the same revision of the Gecko engine, is not affected.
        if ( isSlimerJs() ) delete scenarios["a child window as container"];

        // Increase timeout to allow ample time for child window creation. Make it long enough to dismiss modal warning
        // dialogs in iOS, too, which must be done manually.
        this.timeout( 64000 );

        withData( scenarios, function ( setupType ) {

            var containerFullWidth, containerFullHeight,
                containerInnerWidthUpToScrollbar,
                containerInnerHeightUpToScrollbar,
                isIframeInIOS;

            beforeEach( function () {

                f = Setup.create( setupType, f );

                return f.ready.done( function () {
                    containerFullWidth = $.isWindow( f.$container[0] ) ? f.$container.width() : f.$container.outerWidth();
                    containerFullHeight = $.isWindow( f.$container[0] ) ? f.$container.height() : f.$container.outerHeight();

                    // Inner width and height when a scroll bar appears in the container (excluding the scrollbar)
                    containerInnerWidthUpToScrollbar = f.$container.width() - $.scrollbarWidth();
                    containerInnerHeightUpToScrollbar = f.$container.height() - $.scrollbarWidth();

                    // Flag if the container is an iframe, and the tests run in iOS. Iframes behave differently there -
                    // in particular, they expand downwards and to the right up to the size of the iframe document.
                    isIframeInIOS = setupType === "iframe" && f.iframeExpands;
                } );

            } );

            afterEach( function () {
                f.cleanDom();
            } );

            after( function () {
                f.shutdown();
            } );

            describe( 'When the element is inside the container, and is smaller than the container', function () {

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
                    expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                } );

            } );

            if ( setupType === "overflowScroll"  && $.scrollbarWidth() > 0 ) {

                describe( 'When the element is exactly as large as the container', function () {
                    // Ie, its edge lines up with the container on all four sides. With overflow:scroll, it means
                    // that the element is partially obscured by the obligatory scroll bars.

                    beforeEach( function () {
                        f.$el.contentBox( containerFullWidth, containerFullHeight );
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

            }

            if ( setupType !== "overflowScroll" ) {

                describe( 'When the element is exactly as large as the container', function () {
                    // Ie, its edge lines up with the container on all four sides.

                    beforeEach( function () {
                        f.$el.contentBox( containerFullWidth, containerFullHeight );
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
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                    } );

                } );

            }


            if ( setupType !== "overflowHidden" ) {

                describe( 'When the element is as high as the visible part of the container, and its bottom edge touches the horizontal scroll bar', function () {
                    // Element must be narrow enough not to be under the horizontal scroll bar as it appears, otherwise a
                    // vertical scroll bar comes into play, too.

                    beforeEach( function () {
                        f.$el.contentBox( 10, containerInnerHeightUpToScrollbar );
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "horizontal" );
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
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                    } );

                } );

                if ( $.scrollbarWidth() > 0 ) {

                    describe( 'When the element is a wee bit higher than the visible part of the container, and its bottom edge is just underneath the horizontal scroll bar', function () {
                        // Element must be narrow enough not to be under the vertical scroll bar as it appears, otherwise
                        // the vertical scroll bar affects visibility, too.

                        beforeEach( function () {
                            f.$el.contentBox( 10, containerInnerHeightUpToScrollbar + 1 );
                            if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "horizontal" );
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

                    describe( 'When the element is exactly as high as the container, and extends fully under the horizontal scroll bar', function () {
                        // Element must be narrow enough not to be under the vertical scroll bar as it appears, otherwise
                        // the vertical scroll bar affects visibility, too.

                        beforeEach( function () {
                            f.$el.contentBox( 10, containerFullHeight );
                            if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "horizontal" );
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


                describe( 'When the element is as wide as the visible part of the container, and its right edge touches the vertical scroll bar', function () {
                    // Element must be short enough not to be under the vertical scroll bar as it appears, otherwise a
                    // horizontal scroll bar comes into play, too.

                    beforeEach( function () {
                        f.$el.contentBox( containerInnerWidthUpToScrollbar, 10 );
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "vertical" );
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
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                    } );

                } );

                if ( $.scrollbarWidth() > 0 ) {

                    describe( 'When the element is a wee bit wider than the visible part of the container, and its right edge is just underneath the vertical scroll bar', function () {
                        // Element must be slim enough not to be under the horizontal scroll bar as it appears, otherwise
                        // the horizontal scroll bar affects visibility, too.

                        beforeEach( function () {
                            f.$el.contentBox( containerInnerWidthUpToScrollbar + 1, 10 );
                            if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "vertical" );
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

                    describe( 'When the element is exactly as wide as the container, and extends fully under the vertical scroll bar', function () {
                        // Element must be slim enough not to be under the horizontal scroll bar as it appears, otherwise
                        // the horizontal scroll bar affects visibility, too.

                        beforeEach( function () {
                            f.$el.contentBox( containerFullWidth, 10 );
                            if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "vertical" );
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


                if ( $.scrollbarWidth() > 0 ) {

                    describe( 'When the element is exactly as large as the container, but extends under scrollbars', function () {

                        beforeEach( function () {
                            f.$el.contentBox( containerFullWidth, containerFullHeight );
                            if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "both" );
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

            }


            describe( 'When the element is larger than the container, and encompasses it', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( containerFullWidth + 2, containerFullHeight + 2 )
                        .relPositionAt( -1, -1 );
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


            describe( 'When the element is partially above the container', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( 50, 2 )
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

            describe( 'When the element is partially above the container, but within tolerance', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( 50, 2 )
                        .relPositionAt( -1, 0 );
                } );

                it( 'it is in view', function () {
                    expect( f.$el.isInView( f.$container, { tolerance: 1 } ) ).to.be.true;
                } );

                it( 'it is in partial view', function () {
                    expect( f.$el.isInView( f.$container, { partially: true, tolerance: 1 } ) ).to.be.true;
                } );

                it( 'its content area is in view', function () {
                    expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 1 } ) ).to.be.true;
                } );

                it( 'its content area is in partial view', function () {
                    expect( f.$el.isInView( f.$container, {
                        partially: true,
                        box: "content-box",
                        tolerance: 1
                    } ) ).to.be.true;
                } );

            } );

            describe( 'When the element is fully above the container, but within tolerance', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( 50, 2 )
                        .relPositionAt( -2, 0 );
                } );

                it( 'it is in view', function () {
                    expect( f.$el.isInView( f.$container, { tolerance: 2 } ) ).to.be.true;
                } );

                it( 'it is in partial view', function () {
                    expect( f.$el.isInView( f.$container, { partially: true, tolerance: 2 } ) ).to.be.true;
                } );

                it( 'its content area is in view', function () {
                    expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 2 } ) ).to.be.true;
                } );

                it( 'its content area is in partial view', function () {
                    expect( f.$el.isInView( f.$container, {
                        partially: true,
                        box: "content-box",
                        tolerance: 2
                    } ) ).to.be.true;
                } );

            } );

            describe( 'When the element is fully above the container, but partially within tolerance', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( 50, 2 )
                        .relPositionAt( -2, 0 );
                } );

                it( 'it is not in view', function () {
                    expect( f.$el.isInView( f.$container, { tolerance: 1 } ) ).to.be.false;
                } );

                it( 'it is in partial view', function () {
                    expect( f.$el.isInView( f.$container, { partially: true, tolerance: 1 } ) ).to.be.true;
                } );

                it( 'its content area is not in view', function () {
                    expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 1 } ) ).to.be.false;
                } );

                it( 'its content area is in partial view', function () {
                    expect( f.$el.isInView( f.$container, {
                        partially: true,
                        box: "content-box",
                        tolerance: 1
                    } ) ).to.be.true;
                } );

            } );

            describe( 'When the element is above the container, and its bottom edge is just inside the container', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( 50, 50 )
                        .relPositionAt( -49, 0 );
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

            describe( 'When the element is above the container, and its bottom edge touches the container', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( 50, 50 )
                        .relPositionAt( -50, 0 );
                } );

                it( 'it is not in view', function () {
                    expect( f.$el.isInView( f.$container ) ).to.be.false;
                } );

                it( 'it is not in partial view', function () {
                    expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.false;
                } );

                it( 'its content area is not in view', function () {
                    expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.false;
                } );

                it( 'its content area is not in partial view', function () {
                    expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                } );

            } );


            if ( setupType !== "overflowScroll" ) {

                describe( 'When the element is partially below the container', function () {

                    beforeEach( function () {
                        f.$el
                            .contentBox( 50, 2 )
                            .relPositionAt( containerFullHeight - 1, 0 );
                    } );

                    it( 'it is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                        expect( f.$el.isInView( f.$container ) ).to.equal( isIframeInIOS );
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.true;
                    } );

                    it( 'its content area is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.equal( isIframeInIOS );
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                    } );

                } );

                describe( 'When the element is partially below the container, but within tolerance', function () {

                    beforeEach( function () {
                        f.$el
                            .contentBox( 50, 2 )
                            .relPositionAt( containerFullHeight - 1, 0 );
                    } );

                    it( 'it is in view', function () {
                        expect( f.$el.isInView( f.$container, { tolerance: 1 } ) ).to.be.true;
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, tolerance: 1 } ) ).to.be.true;
                    } );

                    it( 'its content area is in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 1 } ) ).to.be.true;
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, {
                            partially: true,
                            box: "content-box",
                            tolerance: 1
                        } ) ).to.be.true;
                    } );

                } );

                describe( 'When the element is fully below the container, but within tolerance', function () {

                    beforeEach( function () {
                        f.$el
                            .contentBox( 50, 2 )
                            .relPositionAt( containerFullHeight, 0 );
                    } );

                    it( 'it is in view', function () {
                        expect( f.$el.isInView( f.$container, { tolerance: 2 } ) ).to.be.true;
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, tolerance: 2 } ) ).to.be.true;
                    } );

                    it( 'its content area is in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 2 } ) ).to.be.true;
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, {
                            partially: true,
                            box: "content-box",
                            tolerance: 2
                        } ) ).to.be.true;
                    } );

                } );

                describe( 'When the element is fully below the container, but partially within tolerance', function () {

                    beforeEach( function () {
                        f.$el
                            .contentBox( 50, 2 )
                            .relPositionAt( containerFullHeight, 0 );
                    } );

                    it( 'it is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                        expect( f.$el.isInView( f.$container, { tolerance: 1 } ) ).to.equal( isIframeInIOS );
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, tolerance: 1 } ) ).to.be.true;
                    } );

                    it( 'its content area is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 1 } ) ).to.equal( isIframeInIOS );
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, {
                            partially: true,
                            box: "content-box",
                            tolerance: 1
                        } ) ).to.be.true;
                    } );

                } );

                describe( 'When the element is below the container, and its top edge is just inside the container', function () {

                    beforeEach( function () {
                        f.$el
                            .contentBox( 50, 50 )
                            .relPositionAt( containerFullHeight - 1, 0 );
                    } );

                    it( 'it is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                        expect( f.$el.isInView( f.$container ) ).to.equal( isIframeInIOS );
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.true;
                    } );

                    it( 'its content area is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.equal( isIframeInIOS );
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                    } );

                } );

            }

            if ( setupType !== "overflowHidden" && $.scrollbarWidth() > 0 ) {

                describe( 'When the element is partially below the container, and the part inside the container is covered by a horizontal scroll bar', function () {
                    // The scroll bar has not been triggered by the element itself.

                    beforeEach( function () {
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "horizontal" );
                        f.$el
                            .contentBox( 50, 2 )
                            .relPositionAt( containerInnerHeightUpToScrollbar, 0 );
                    } );

                    it( 'it is not in view', function () {
                        expect( f.$el.isInView( f.$container ) ).to.be.false;
                    } );

                    it( 'it is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.false;
                    } );

                    it( 'its content area is not in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.false;
                    } );

                    it( 'its content area is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                    } );

                } );

                describe( 'When the element is partially below the container, and the part inside the container is covered by a horizontal scroll bar, but some of that part is within tolerance', function () {

                    beforeEach( function () {
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "horizontal" );
                        f.$el
                            .contentBox( 50, 2 )
                            .relPositionAt( containerInnerHeightUpToScrollbar, 0 );
                    } );

                    it( 'it is not in view', function () {
                        expect( f.$el.isInView( f.$container, { tolerance: 1 } ) ).to.be.false;
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, tolerance: 1 } ) ).to.be.true;
                    } );

                    it( 'its content area is not in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 1 } ) ).to.be.false;
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, {
                            partially: true,
                            box: "content-box",
                            tolerance: 1
                        } ) ).to.be.true;
                    } );

                } );

                describe( 'When the element is fully below the container, the container has a horizontal scroll bar, and tolerance is as large as element height and scroll bar height', function () {

                    var tolerance;

                    beforeEach( function () {
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "horizontal" );
                        f.$el
                            .contentBox( 50, 2 )
                            .relPositionAt( containerFullHeight, 0 );

                        tolerance = 2 + $.scrollbarWidth();
                    } );

                    it( 'it is in view', function () {
                        expect( f.$el.isInView( f.$container, { tolerance: tolerance } ) ).to.be.true;
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, tolerance: tolerance } ) ).to.be.true;
                    } );

                    it( 'its content area is in view', function () {
                        expect( f.$el.isInView( f.$container, {
                            box: "content-box",
                            tolerance: tolerance
                        } ) ).to.be.true;
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, {
                            partially: true,
                            box: "content-box",
                            tolerance: tolerance
                        } ) ).to.be.true;
                    } );

                } );

                describe( 'When the element is fully below the container, the container has a horizontal scroll bar, and tolerance is as large as the scroll bar height only', function () {

                    var tolerance;

                    beforeEach( function () {
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "horizontal" );
                        f.$el
                            .contentBox( 50, 2 )
                            .relPositionAt( containerFullHeight, 0 );

                        tolerance = $.scrollbarWidth();
                    } );

                    it( 'it is not in view', function () {
                        expect( f.$el.isInView( f.$container, { tolerance: 1 } ) ).to.be.false;
                    } );

                    it( 'it is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, tolerance: 1 } ) ).to.be.false;
                    } );

                    it( 'its content area is not in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 1 } ) ).to.be.false;
                    } );

                    it( 'its content area is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, {
                            partially: true,
                            box: "content-box",
                            tolerance: 1
                        } ) ).to.be.false;
                    } );

                } );

            }

            describe( 'When the element is below the container, and its top edge touches the container', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( 50, 50 )
                        .relPositionAt( containerFullHeight, 0 );
                } );

                it( 'it is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                    expect( f.$el.isInView( f.$container ) ).to.equal( isIframeInIOS );
                } );

                it( 'it is not in partial view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                    expect( f.$el.isInView( f.$container, { partially: true } ) ).to.equal( isIframeInIOS );
                } );

                it( 'its content area is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                    expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.equal( isIframeInIOS );
                } );

                it( 'its content area is not in partial view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                    expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.equal( isIframeInIOS );
                } );

            } );


            describe( 'When the element is partially left of the container', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( 2, 50 )
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

            describe( 'When the element is partially left of the container, but within tolerance', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( 2, 50 )
                        .relPositionAt( 0, -1 );
                } );

                it( 'it is in view', function () {
                    expect( f.$el.isInView( f.$container, { tolerance: 1 } ) ).to.be.true;
                } );

                it( 'it is in partial view', function () {
                    expect( f.$el.isInView( f.$container, { partially: true, tolerance: 1 } ) ).to.be.true;
                } );

                it( 'its content area is in view', function () {
                    expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 1 } ) ).to.be.true;
                } );

                it( 'its content area is in partial view', function () {
                    expect( f.$el.isInView( f.$container, {
                        partially: true,
                        box: "content-box",
                        tolerance: 1
                    } ) ).to.be.true;
                } );

            } );

            describe( 'When the element is fully left of the container, but within tolerance', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( 2, 50 )
                        .relPositionAt( 0, -2 );
                } );

                it( 'it is in view', function () {
                    expect( f.$el.isInView( f.$container, { tolerance: 2 } ) ).to.be.true;
                } );

                it( 'it is in partial view', function () {
                    expect( f.$el.isInView( f.$container, { partially: true, tolerance: 2 } ) ).to.be.true;
                } );

                it( 'its content area is in view', function () {
                    expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 2 } ) ).to.be.true;
                } );

                it( 'its content area is in partial view', function () {
                    expect( f.$el.isInView( f.$container, {
                        partially: true,
                        box: "content-box",
                        tolerance: 2
                    } ) ).to.be.true;
                } );

            } );

            describe( 'When the element is fully left of the container, but partially within tolerance', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( 2, 50 )
                        .relPositionAt( 0, -2 );
                } );

                it( 'it is not in view', function () {
                    expect( f.$el.isInView( f.$container, { tolerance: 1 } ) ).to.be.false;
                } );

                it( 'it is in partial view', function () {
                    expect( f.$el.isInView( f.$container, { partially: true, tolerance: 1 } ) ).to.be.true;
                } );

                it( 'its content area is not in view', function () {
                    expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 1 } ) ).to.be.false;
                } );

                it( 'its content area is in partial view', function () {
                    expect( f.$el.isInView( f.$container, {
                        partially: true,
                        box: "content-box",
                        tolerance: 1
                    } ) ).to.be.true;
                } );

            } );

            describe( 'When the element is left of the container, and its right edge is just inside the container', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( 50, 50 )
                        .relPositionAt( 0, -49 );
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

            describe( 'When the element is left of the container, and its right edge touches the container', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( 50, 50 )
                        .relPositionAt( 0, -50 );
                } );

                it( 'it is not in view', function () {
                    expect( f.$el.isInView( f.$container ) ).to.be.false;
                } );

                it( 'it is not in partial view', function () {
                    expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.false;
                } );

                it( 'its content area is not in view', function () {
                    expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.false;
                } );

                it( 'its content area is not in partial view', function () {
                    expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                } );

            } );


            if ( setupType !== "overflowScroll" ) {

                describe( 'When the element is partially right of the container', function () {

                    beforeEach( function () {
                        f.$el
                            .contentBox( 2, 50 )
                            .relPositionAt( 0, containerFullWidth - 1 );
                    } );

                    it( 'it is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                        expect( f.$el.isInView( f.$container ) ).to.equal( isIframeInIOS );
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.true;
                    } );

                    it( 'its content area is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.equal( isIframeInIOS );
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                    } );

                } );

                describe( 'When the element is partially right of the container, but within tolerance', function () {

                    beforeEach( function () {
                        f.$el
                            .contentBox( 2, 50 )
                            .relPositionAt( 0, containerFullWidth - 1 );
                    } );

                    it( 'it is in view', function () {
                        expect( f.$el.isInView( f.$container, { tolerance: 1 } ) ).to.be.true;
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, tolerance: 1 } ) ).to.be.true;
                    } );

                    it( 'its content area is in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 1 } ) ).to.be.true;
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, {
                            partially: true,
                            box: "content-box",
                            tolerance: 1
                        } ) ).to.be.true;
                    } );

                } );

                describe( 'When the element is fully right of the container, but within tolerance', function () {

                    beforeEach( function () {
                        f.$el
                            .contentBox( 2, 50 )
                            .relPositionAt( 0, containerFullWidth );
                    } );

                    it( 'it is in view', function () {
                        expect( f.$el.isInView( f.$container, { tolerance: 2 } ) ).to.be.true;
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, tolerance: 2 } ) ).to.be.true;
                    } );

                    it( 'its content area is in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 2 } ) ).to.be.true;
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, {
                            partially: true,
                            box: "content-box",
                            tolerance: 2
                        } ) ).to.be.true;
                    } );

                } );

                describe( 'When the element is fully right of the container, but partially within tolerance', function () {

                    beforeEach( function () {
                        f.$el
                            .contentBox( 2, 50 )
                            .relPositionAt( 0, containerFullWidth );
                    } );

                    it( 'it is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                        expect( f.$el.isInView( f.$container, { tolerance: 1 } ) ).to.equal( isIframeInIOS );
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, tolerance: 1 } ) ).to.be.true;
                    } );

                    it( 'its content area is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 1 } ) ).to.equal( isIframeInIOS );
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, {
                            partially: true,
                            box: "content-box",
                            tolerance: 1
                        } ) ).to.be.true;
                    } );

                } );

                describe( 'When the element is right of the container, and its left edge is just inside the container', function () {

                    beforeEach( function () {
                        f.$el
                            .contentBox( 50, 50 )
                            .relPositionAt( 0, containerFullWidth - 1 );
                    } );

                    it( 'it is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                        expect( f.$el.isInView( f.$container ) ).to.equal( isIframeInIOS );
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.true;
                    } );

                    it( 'its content area is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.equal( isIframeInIOS );
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                    } );

                } );

            }

            if ( setupType !== "overflowHidden" && $.scrollbarWidth() > 0 ) {

                describe( 'When the element is partially right of the container, and the part inside the container is covered by a vertical scroll bar', function () {
                    // The scroll bar has not been triggered by the element itself.

                    beforeEach( function () {
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "vertical" );
                        f.$el
                            .contentBox( 2, 50 )
                            .relPositionAt( 0, containerInnerWidthUpToScrollbar );
                    } );

                    it( 'it is not in view', function () {
                        expect( f.$el.isInView( f.$container ) ).to.be.false;
                    } );

                    it( 'it is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.false;
                    } );

                    it( 'its content area is not in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.false;
                    } );

                    it( 'its content area is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                    } );

                } );

                describe( 'When the element is partially right of the container, and the part inside the container is covered by a vertical scroll bar, but some of that part is within tolerance', function () {

                    beforeEach( function () {
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "vertical" );
                        f.$el
                            .contentBox( 2, 50 )
                            .relPositionAt( 0, containerInnerWidthUpToScrollbar );
                    } );

                    it( 'it is not in view', function () {
                        expect( f.$el.isInView( f.$container, { tolerance: 1 } ) ).to.be.false;
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, tolerance: 1 } ) ).to.be.true;
                    } );

                    it( 'its content area is not in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 1 } ) ).to.be.false;
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, {
                            partially: true,
                            box: "content-box",
                            tolerance: 1
                        } ) ).to.be.true;
                    } );

                } );

                describe( 'When the element is fully right of the container, the container has a vertical scroll bar, and tolerance is as large as element width and scroll bar width', function () {

                    var tolerance;

                    beforeEach( function () {
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "vertical" );
                        f.$el
                            .contentBox( 2, 50 )
                            .relPositionAt( 0, containerFullWidth );

                        tolerance = 2 + $.scrollbarWidth();
                    } );

                    it( 'it is in view', function () {
                        expect( f.$el.isInView( f.$container, { tolerance: tolerance } ) ).to.be.true;
                    } );

                    it( 'it is in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, tolerance: tolerance } ) ).to.be.true;
                    } );

                    it( 'its content area is in view', function () {
                        expect( f.$el.isInView( f.$container, {
                            box: "content-box",
                            tolerance: tolerance
                        } ) ).to.be.true;
                    } );

                    it( 'its content area is in partial view', function () {
                        expect( f.$el.isInView( f.$container, {
                            partially: true,
                            box: "content-box",
                            tolerance: tolerance
                        } ) ).to.be.true;
                    } );

                } );

                describe( 'When the element is fully right of the container, the container has a vertical scroll bar, and tolerance is as large as the scroll bar width only', function () {

                    var tolerance;

                    beforeEach( function () {
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "vertical" );
                        f.$el
                            .contentBox( 2, 50 )
                            .relPositionAt( 0, containerFullWidth );

                        tolerance = $.scrollbarWidth();
                    } );

                    it( 'it is not in view', function () {
                        expect( f.$el.isInView( f.$container, { tolerance: 1 } ) ).to.be.false;
                    } );

                    it( 'it is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, tolerance: 1 } ) ).to.be.false;
                    } );

                    it( 'its content area is not in view', function () {
                        expect( f.$el.isInView( f.$container, { box: "content-box", tolerance: 1 } ) ).to.be.false;
                    } );

                    it( 'its content area is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, {
                            partially: true,
                            box: "content-box",
                            tolerance: 1
                        } ) ).to.be.false;
                    } );

                } );

            }

            describe( 'When the element is right of the container, and its left edge touches the container', function () {

                beforeEach( function () {
                    f.$el
                        .contentBox( 50, 50 )
                        .relPositionAt( 0, containerFullWidth );
                } );

                it( 'it is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                    expect( f.$el.isInView( f.$container ) ).to.equal( isIframeInIOS );
                } );

                it( 'it is not in partial view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                    expect( f.$el.isInView( f.$container, { partially: true } ) ).to.equal( isIframeInIOS );
                } );

                it( 'its content area is not in view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                    expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.equal( isIframeInIOS );
                } );

                it( 'its content area is not in partial view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                    expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.equal( isIframeInIOS );
                } );

            } );

        } );

    } );

})();