/*global describe, it, $ */
(function () {
    "use strict";

    describe( 'isInView: Element geometry. An element with padding, borders, margins', function () {

        /** @type {DOMFixture}  populated by Setup.create() */
        var f,

            scenarios = isPhantomJs() ?
                        {
                            // PhantomJS is excluded from many tests because its behaviour is markedly different from
                            // ordinary browsers. It doesn't have a window of a given size - its "window" automatically
                            // expands to the size of the document. The tests don't accommodate this behaviour.
                            "a div set to overflow:auto as container": "overflowAuto",
                            "a div set to overflow:scroll as container": "overflowScroll",
                            "a div set to overflow:hidden as container": "overflowHidden",
                            "a div set to overflow:auto as container (box-sizing: border-box)": "overflowAutoBorderBox"
                        } :
                        {

                            "the global window as container": "window",
                            "an iframe as container": "iframe",
                            "a child window as container": "childWindow",
                            "a div set to overflow:auto as container": "overflowAuto",
                            "a div set to overflow:scroll as container": "overflowScroll",
                            "a div set to overflow:hidden as container": "overflowHidden",
                            "a div set to overflow:auto as container (box-sizing: border-box)": "overflowAutoBorderBox"

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

            describe( 'An element with padding and borders', function () {

                if ( setupType === "overflowScroll" && $.scrollbarWidth() > 0 ) {

                    describe( 'When the element is exactly as large as the container, its borders lining up with the edge of the container', function () {
                        // With overflow:scroll, it means that the element is partially obscured by the obligatory
                        // scroll bars.

                        beforeEach( function () {
                            f.$el
                                .padding( 2 )
                                .border( 1 )
                                .contentBox( containerFullWidth - 6, containerFullHeight - 6 )
                                .relPositionAt( 0, 0 );
                        } );

                        it( 'it is not in view', function () {
                            expect( f.$el.isInView( f.$container ) ).to.be.false;
                        } );

                        it( 'it is in partial view', function () {
                            expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.true;
                        } );

                        if ( $.scrollbarWidth() > 3 ) {

                            it( 'its content area is not in view (if padding and margin are smaller than the scroll bar width)', function () {
                                expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.false;
                            } );

                        } else {

                            it( 'its content area is in view (if padding and margin are larger than the scroll bar width)', function () {
                                expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.true;
                            } );

                        }

                        it( 'its content area is in partial view', function () {
                            expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                        } );

                    } );

                }

                if ( setupType !== "overflowScroll" ) {

                    describe( 'When the element is exactly as large as the container, its borders lining up with the edge of the container', function () {

                        beforeEach( function () {
                            f.$el
                                .padding( 2 )
                                .border( 1 )
                                .contentBox( containerFullWidth - 6, containerFullHeight - 6 )
                                .relPositionAt( 0, 0 );
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

                if ( setupType === "overflowHidden" ) {

                    describe( 'When the content area of the element is exactly as large as the container, its padding and borders extending beyond it', function () {

                        beforeEach( function () {
                            f.$el
                                .padding( 2 )
                                .border( 1 )
                                .contentBox( containerFullWidth, containerFullHeight )
                                .relPositionAt( -3, -3 );
                        } );

                        it( 'it is not in view', function () {
                            expect( f.$el.isInView( f.$container ) ).to.be.false;
                        } );

                        it( 'it is in partial view', function () {
                            expect( f.$el.isInView( f.$container, { partially: true } ) ).to.be.true;
                        } );

                        it( 'its content area is in view', function () {
                            // This test only works with overflow: hidden. For other types of overflow, scroll bars
                            // would appear and partly cover the content area of the element.

                            expect( f.$el.isInView( f.$container, { box: "content-box" } ) ).to.be.true;
                        } );

                        it( 'its content area is in partial view', function () {
                            expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.true;
                        } );

                    } );

                }


                if ( setupType !== "overflowHidden" ) {

                    describe( 'When the element is as high as the visible part of the container, and its bottom border touches the horizontal scroll bar', function () {
                        // Element must be narrow enough not to be under the horizontal scroll bar as it appears, otherwise a
                        // vertical scroll bar comes into play, too.

                        beforeEach( function () {
                            f.$el
                                .padding( 2 )
                                .border( 1 )
                                .contentBox( 10, containerInnerHeightUpToScrollbar - 6 );

                            forceScrollbar( f.$stage, "horizontal" );
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

                        describe( 'When the content area of the element is as high as the visible part of the container, does not have padding, and its bottom border is just underneath the horizontal scroll bar', function () {
                            // Element must be narrow enough not to be under the vertical scroll bar as it appears, otherwise
                            // the vertical scroll bar affects visibility, too.

                            beforeEach( function () {
                                f.$el
                                    .noPadding()
                                    .bottomBorder( 1 )
                                    .contentBox( 10, containerInnerHeightUpToScrollbar );

                                forceScrollbar( f.$stage, "horizontal" );
                            } );

                            it( 'it is not in view', function () {
                                expect( f.$el.isInView( f.$container ) ).to.be.false;
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

                        describe( 'When the content area of the element is as high as the visible part of the container, does not have a border, and its bottom padding is just underneath the horizontal scroll bar', function () {
                            // Element must be narrow enough not to be under the vertical scroll bar as it appears, otherwise
                            // the vertical scroll bar affects visibility, too.

                            beforeEach( function () {
                                f.$el
                                    .noBorder()
                                    .bottomPadding( 1 )
                                    .contentBox( 10, containerInnerHeightUpToScrollbar );

                                forceScrollbar( f.$stage, "horizontal" );
                            } );

                            it( 'it is not in view', function () {
                                expect( f.$el.isInView( f.$container ) ).to.be.false;
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

                        describe( 'When the element is exactly as high as the container, its content area as high as the visible part of the container, and its padding and border extend fully under the horizontal scroll bar', function () {
                            // Element must be narrow enough not to be under the vertical scroll bar as it appears, otherwise
                            // the vertical scroll bar affects visibility, too.

                            beforeEach( function () {
                                f.$el
                                    .bottomPadding( containerFullHeight - containerInnerHeightUpToScrollbar - 1 )
                                    .bottomBorder( 1 )
                                    .contentBox( 10, containerInnerHeightUpToScrollbar );

                                forceScrollbar( f.$stage, "horizontal" );
                            } );

                            it( 'it is not in view', function () {
                                expect( f.$el.isInView( f.$container ) ).to.be.false;
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


                    describe( 'When the element is as wide as the visible part of the container, and its right border touches the vertical scroll bar', function () {
                        // Element must be short enough not to be under the vertical scroll bar as it appears, otherwise a
                        // horizontal scroll bar comes into play, too.

                        beforeEach( function () {
                            f.$el
                                .padding( 2 )
                                .border( 1 )
                                .contentBox( containerInnerWidthUpToScrollbar - 6, 10 );

                            forceScrollbar( f.$stage, "vertical" );
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

                        describe( 'When the content area of the element is as wide as the visible part of the container, does not have padding, and its right border is just underneath the vertical scroll bar', function () {
                            // Element must be short enough not to be under the horizontal scroll bar as it appears, otherwise
                            // the horizontal scroll bar affects visibility, too.

                            beforeEach( function () {
                                f.$el
                                    .noPadding()
                                    .rightBorder( 1 )
                                    .contentBox( containerInnerWidthUpToScrollbar, 10 );

                                forceScrollbar( f.$stage, "vertical" );
                            } );

                            it( 'it is not in view', function () {
                                expect( f.$el.isInView( f.$container ) ).to.be.false;
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

                        describe( 'When the content area of the element is as wide as the visible part of the container, does not have a border, and its right padding is just underneath the vertical scroll bar', function () {
                            // Element must be short enough not to be under the horizontal scroll bar as it appears, otherwise
                            // the horizontal scroll bar affects visibility, too.

                            beforeEach( function () {
                                f.$el
                                    .noBorder()
                                    .rightPadding( 1 )
                                    .contentBox( containerInnerWidthUpToScrollbar, 10 );

                                forceScrollbar( f.$stage, "vertical" );
                            } );

                            it( 'it is not in view', function () {
                                expect( f.$el.isInView( f.$container ) ).to.be.false;
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

                        describe( 'When the element is exactly as wide as the container, its content area as wide as the visible part of the container, and its padding and border extend fully under the vertical scroll bar', function () {
                            // Element must be short enough not to be under the horizontal scroll bar as it appears, otherwise
                            // the horizontal scroll bar affects visibility, too.

                            beforeEach( function () {
                                f.$el
                                    .rightPadding( containerFullWidth - containerInnerWidthUpToScrollbar - 1 )
                                    .rightBorder( 1 )
                                    .contentBox( containerInnerWidthUpToScrollbar, 10 );

                                forceScrollbar( f.$stage, "vertical" );
                            } );

                            it( 'it is not in view', function () {
                                expect( f.$el.isInView( f.$container ) ).to.be.false;
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

                }


                describe( 'When the element is above the container, and its bottom content edge is just inside the container', function () {

                    beforeEach( function () {
                        f.$el
                            .bottomPadding( 1 )
                            .bottomBorder( 1 )
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

                describe( 'When the element is above the container, and its bottom content edge touches the container', function () {

                    beforeEach( function () {
                        f.$el
                            .bottomPadding( 1 )
                            .bottomBorder( 1 )
                            .contentBox( 50, 50 )
                            .relPositionAt( -50, 0 );
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

                    it( 'its content area is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                    } );

                } );

                describe( 'When the element is above the container, does not have a border, and its bottom padding edge is just inside the container', function () {

                    beforeEach( function () {
                        f.$el
                            .noBorder()
                            .bottomPadding( 1 )
                            .contentBox( 50, 50 )
                            .relPositionAt( -50, 0 );
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

                    it( 'its content area is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                    } );

                } );

                describe( 'When the element is above the container, does not have a border, and its bottom padding touches the container', function () {

                    beforeEach( function () {
                        f.$el
                            .noBorder()
                            .bottomPadding( 1 )
                            .contentBox( 50, 50 )
                            .relPositionAt( -51, 0 );
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

                describe( 'When the element is above the container, and its bottom border is just inside the container', function () {

                    beforeEach( function () {
                        f.$el
                            .bottomPadding( 1 )
                            .bottomBorder( 1 )
                            .contentBox( 50, 50 )
                            .relPositionAt( -51, 0 );
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

                    it( 'its content area is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                    } );

                } );

                describe( 'When the element is above the container, and its bottom border touches the container', function () {

                    beforeEach( function () {
                        f.$el
                            .bottomPadding( 1 )
                            .bottomBorder( 1 )
                            .contentBox( 50, 50 )
                            .relPositionAt( -52, 0 );
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

                    describe( 'When the element is below the container, and its top content edge is just inside the container', function () {

                        beforeEach( function () {
                            f.$el
                                .topBorder( 1 )
                                .topPadding( 1 )
                                .contentBox( 50, 50 )
                                .relPositionAt( containerFullHeight - 3, 0 );
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

                    describe( 'When the element is below the container, and its top content edge touches the container', function () {

                        beforeEach( function () {
                            f.$el
                                .topBorder( 1 )
                                .topPadding( 1 )
                                .contentBox( 50, 50 )
                                .relPositionAt( containerFullHeight - 2, 0 );
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

                        it( 'its content area is not in partial view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                            expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.equal( isIframeInIOS );
                        } );

                    } );

                    describe( 'When the element is below the container, does not have a border, and its top padding edge is just inside the container', function () {

                        beforeEach( function () {
                            f.$el
                                .noBorder()
                                .topPadding( 1 )
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

                        it( 'its content area is not in partial view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                            expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.equal( isIframeInIOS );
                        } );

                    } );

                    describe( 'When the element is below the container, and its top border is just inside the container', function () {

                        beforeEach( function () {
                            f.$el
                                .topBorder( 1 )
                                .topPadding( 1 )
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

                        it( 'its content area is not in partial view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                            expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.equal( isIframeInIOS );
                        } );

                    } );

                }

                describe( 'When the element is below the container, does not have a border, and its top padding edge touches the container', function () {

                    beforeEach( function () {
                        f.$el
                            .noBorder()
                            .topPadding( 1 )
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

                describe( 'When the element is below the container, and its top border touches the container', function () {

                    beforeEach( function () {
                        f.$el
                            .topBorder( 1 )
                            .topPadding( 1 )
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

                if ( setupType !== "overflowHidden" && $.scrollbarWidth() > 0 ) {

                    describe( 'When the element is below the container, and its top content edge is just inside the visible area of the container, above a horizontal scroll bar', function () {
                        // The scroll bar has not been triggered by the element itself.

                        beforeEach( function () {
                            if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "horizontal" );
                            f.$el
                                .topBorder( 1 )
                                .topPadding( 1 )
                                .contentBox( 50, 50 )
                                .relPositionAt( containerInnerHeightUpToScrollbar - 3, 0 );
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

                    describe( 'When the element is below the container, and its top content edge touches the visible area of the container, staying underneath a horizontal scroll bar', function () {

                        beforeEach( function () {
                            if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "horizontal" );
                            f.$el
                                .topBorder( 1 )
                                .topPadding( 1 )
                                .contentBox( 50, 50 )
                                .relPositionAt( containerInnerHeightUpToScrollbar - 2, 0 );
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

                        it( 'its content area is not in partial view', function () {
                            expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                        } );

                    } );

                    describe( 'When the element is below the container, does not have a border, and its top padding edge is just inside the container, above a horizontal scroll bar', function () {

                        beforeEach( function () {
                            if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "horizontal" );
                            f.$el
                                .noBorder()
                                .topPadding( 1 )
                                .contentBox( 50, 50 )
                                .relPositionAt( containerInnerHeightUpToScrollbar - 1, 0 );
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

                        it( 'its content area is not in partial view', function () {
                            expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                        } );

                    } );

                    describe( 'When the element is below the container, and its top border is just inside the container, above a horizontal scroll bar', function () {

                        beforeEach( function () {
                            if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "horizontal" );
                            f.$el
                                .topBorder( 1 )
                                .topPadding( 1 )
                                .contentBox( 50, 50 )
                                .relPositionAt( containerInnerHeightUpToScrollbar - 1, 0 );
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

                        it( 'its content area is not in partial view', function () {
                            expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                        } );

                    } );

                    describe( 'When the element is below the container, does not have a border, and its top padding edge touches the container, staying underneath a horizontal scroll bar', function () {

                        beforeEach( function () {
                            if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "horizontal" );
                            f.$el
                                .noBorder()
                                .topPadding( 1 )
                                .contentBox( 50, 50 )
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

                    describe( 'When the element is below the container, and its top border touches the container, staying underneath a horizontal scroll bar', function () {

                        beforeEach( function () {
                            if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "horizontal" );
                            f.$el
                                .topBorder( 1 )
                                .topPadding( 1 )
                                .contentBox( 50, 50 )
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

                }

                describe( 'When the element is left of the container, and its right content edge is just inside the container', function () {

                    beforeEach( function () {
                        f.$el
                            .rightPadding( 1 )
                            .rightBorder( 1 )
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

                describe( 'When the element is left of the container, and its right content edge touches the container', function () {

                    beforeEach( function () {
                        f.$el
                            .rightPadding( 1 )
                            .rightBorder( 1 )
                            .contentBox( 50, 50 )
                            .relPositionAt( 0, -50 );
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

                    it( 'its content area is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                    } );

                } );

                describe( 'When the element is left of the container, does not have a border, and its right padding edge is just inside the container', function () {

                    beforeEach( function () {
                        f.$el
                            .noBorder()
                            .rightPadding( 1 )
                            .contentBox( 50, 50 )
                            .relPositionAt( 0, -50 );
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

                    it( 'its content area is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                    } );

                } );

                describe( 'When the element is left of the container, does not have a border, and its right padding edge touches the container', function () {

                    beforeEach( function () {
                        f.$el
                            .noBorder()
                            .rightPadding( 1 )
                            .contentBox( 50, 50 )
                            .relPositionAt( 0, -51 );
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

                describe( 'When the element is left of the container, and its right border is just inside the container', function () {

                    beforeEach( function () {
                        f.$el
                            .rightPadding( 1 )
                            .rightBorder( 1 )
                            .contentBox( 50, 50 )
                            .relPositionAt( 0, -51 );
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

                    it( 'its content area is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                    } );

                } );

                describe( 'When the element is left of the container, and its right border touches the container', function () {

                    beforeEach( function () {
                        f.$el
                            .rightPadding( 1 )
                            .rightBorder( 1 )
                            .contentBox( 50, 50 )
                            .relPositionAt( 0, -52 );
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

                    describe( 'When the element is right of the container, and its left content edge is just inside the container', function () {

                        beforeEach( function () {
                            f.$el
                                .leftPadding( 1 )
                                .leftBorder( 1 )
                                .contentBox( 50, 50 )
                                .relPositionAt( 0, containerFullWidth - 3 );
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

                    describe( 'When the element is right of the container, and its left content edge touches the container', function () {

                        beforeEach( function () {
                            f.$el
                                .leftPadding( 1 )
                                .leftBorder( 1 )
                                .contentBox( 50, 50 )
                                .relPositionAt( 0, containerFullWidth - 2 );
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

                        it( 'its content area is not in partial view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                            expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.equal( isIframeInIOS );
                        } );

                    } );

                    describe( 'When the element is right of the container, does not have a border, and its left padding edge is just inside the container', function () {

                        beforeEach( function () {
                            f.$el
                                .noBorder()
                                .leftPadding( 1 )
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

                        it( 'its content area is not in partial view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                            expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.equal( isIframeInIOS );
                        } );

                    } );

                    describe( 'When the element is right of the container, and its left border is just inside the container', function () {

                        beforeEach( function () {
                            f.$el
                                .leftPadding( 1 )
                                .leftBorder( 1 )
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

                        it( 'its content area is not in partial view' + ( setupType === "iframe" ? " (except in iOS)" : "" ), function () {
                            expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.equal( isIframeInIOS );
                        } );

                    } );

                }

                describe( 'When the element is right of the container, does not have a border, and its left padding edge touches the container', function () {

                    beforeEach( function () {
                        f.$el
                            .noBorder()
                            .leftPadding( 1 )
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

                describe( 'When the element is right of the container, and its left border touches the container', function () {

                    beforeEach( function () {
                        f.$el
                            .leftPadding( 1 )
                            .leftBorder( 1 )
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

            if ( setupType !== "overflowHidden" && $.scrollbarWidth() > 0 ) {

                describe( 'When the element is right of the container, and its left content edge is just inside the visible area of the container, left of a vertical scroll bar', function () {
                    // The scroll bar has not been triggered by the element itself.

                    beforeEach( function () {
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "vertical" );
                        f.$el
                            .leftPadding( 1 )
                            .leftBorder( 1 )
                            .contentBox( 50, 50 )
                            .relPositionAt( 0, containerInnerWidthUpToScrollbar - 3 );
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

                describe( 'When the element is right of the container, and its left content edge touches the visible area of the container, staying underneath a vertical scroll bar', function () {

                    beforeEach( function () {
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "vertical" );
                        f.$el
                            .leftPadding( 1 )
                            .leftBorder( 1 )
                            .contentBox( 50, 50 )
                            .relPositionAt( 0, containerInnerWidthUpToScrollbar - 2 );
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

                    it( 'its content area is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                    } );

                } );

                describe( 'When the element is right of the container, does not have a border, and its left padding edge is just inside the visible area of the container, left of a vertical scroll bar', function () {

                    beforeEach( function () {
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "vertical" );
                        f.$el
                            .noBorder()
                            .leftPadding( 1 )
                            .contentBox( 50, 50 )
                            .relPositionAt( 0, containerInnerWidthUpToScrollbar - 1 );
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

                    it( 'its content area is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                    } );

                } );

                describe( 'When the element is right of the container, and its left border is just inside the visible area of the container, left of a vertical scroll bar', function () {

                    beforeEach( function () {
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "vertical" );
                        f.$el
                            .leftPadding( 1 )
                            .leftBorder( 1 )
                            .contentBox( 50, 50 )
                            .relPositionAt( 0, containerInnerWidthUpToScrollbar - 1 );
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

                    it( 'its content area is not in partial view', function () {
                        expect( f.$el.isInView( f.$container, { partially: true, box: "content-box" } ) ).to.be.false;
                    } );

                } );

                describe( 'When the element is right of the container, does not have a border, and its left padding edge touches the visible area of the container, staying underneath a vertical scroll bar', function () {

                    beforeEach( function () {
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "vertical" );
                        f.$el
                            .noBorder()
                            .leftPadding( 1 )
                            .contentBox( 50, 50 )
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

                describe( 'When the element is right of the container, and its left border touches the visible area of the container, staying underneath a vertical scroll bar', function () {

                    beforeEach( function () {
                        if ( setupType !== "overflowScroll" ) forceScrollbar( f.$stage, "vertical" );
                        f.$el
                            .leftPadding( 1 )
                            .leftBorder( 1 )
                            .contentBox( 50, 50 )
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

            }


            describe( 'An element with margins', function () {

                describe( 'When the element is inside of the container, and its margins extend beyond the container', function () {
                    // We achieve this by positioning an outer div partially outside of the container, and push an inner div
                    // back into the container with its margins.

                    beforeEach( function () {
                        $( "<div/>", f.document )
                            .relPositionAt( -10, -10 )
                            .append( f.$el )
                            .appendTo( f.$stage );

                        f.$el.margin( 10 );
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

                describe( 'When an element is outside of the container, and its margins extend into the container', function () {

                    beforeEach( function () {
                        f.$el
                            .contentBox( 50, 50 )
                            .bottomMargin( 1 )
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

                describe( 'When an element would be inside of the container without margins, and its width is expanded beyond the container with negative margins', function () {
                    // We achieve this by declaring width:auto for the element, which makes it expand to the width of its
                    // container; and then declaring a negative margin on the left and right, which makes its width stretch
                    // _beyond_ the container.
                    //
                    // See see http://jsbin.com/jucazo/3/edit for an example.

                    beforeEach( function () {
                        f.$el
                            .css( { width: "auto", height: "50px" } )
                            .leftMargin( -1 )
                            .rightMargin( -1 );
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

        } );

    } );

})();