/*global describe, it */
(function () {
    "use strict";

    describe( '$.fn.hasScrollbar: Geometry', function () {

        // PhantomJS is excluded from many tests because its behaviour is markedly different from ordinary browsers. It
        // doesn't have a window of a given size - its "window" automatically expands to the size of the document. The
        // tests don't accommodate this behaviour.

        // SlimerJS is excluded from tests taking place in a child window. SlimerJS seems to suppress scroll bars in a
        // child window, regardless of settings. The tests don't handle that. This is a SlimerJS peculiarity - the
        // corresponding Firefox version, based on the same revision of the Gecko engine, is not affected.

        /** @type {DOMFixture}  populated by Setup.create() */
        var f,
            viewportShowsHidden,
            messagePhantomSlimer = "Skipped in PhantomJS and SlimerJS, see comments at the top of the test suite";

        beforeEach( function () {

            // In iOS, if the effective overflow setting of the viewport is "hidden", it is ignored and treated as
            // "auto". Content can still overflow the viewport, and scroll bars appear as needed.
            //
            // Now, the catch. This behaviour is impossible to feature-detect. The computed values are not at all
            // affected by it, and the results reported eg. for clientHeight, offsetHeight, scrollHeight of body and
            // documentElement do not differ between Safari on iOS and, say, Chrome. The numbers don't give the
            // behaviour away.
            //
            // So we have to resort to browser sniffing here. It sucks, but there is literally no other option.
            viewportShowsHidden = isIOS();

        } );

        afterEach( function () {
            f.cleanDom();
        } );

        after( function () {
            f.shutdown();
        } );

        describe( 'Window', function () {

            var $window, $documentElement, $body, viewportWidth, viewportHeight;

            beforeEach( function () {
                f = Setup.create( "window", f );

                return f.ready.done( function () {
                    $window = $( f.window );
                    $documentElement = $( f.document.documentElement );
                    $body = $( "body", f.document ).contentOnly();
                    viewportWidth = $window.width();
                    viewportHeight = $window.height();
                } );
            } );

            describe_noPhantom( 'It a detects a vertical scroll bar, and not a horizontal one', function () {

                it( 'when the body content is longer than the viewport height', function () {
                    f.$el.height( viewportHeight + 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the body fits inside the viewport vertically, but the document does not', function () {
                    // This happens, for instance, when an absolutely positioned element extends off screen. The
                    // positioned element does not enlarge the body (assuming the body is not positioned itself).
                    f.$el.positionAt( 0, 0 ).height( viewportHeight + 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the body content is exactly as high as the viewport, and the body has a top margin', function () {
                    // ... and nothing else.
                    f.$el.height( viewportHeight );
                    $body.topMargin( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the body content is exactly as high as the viewport, and the body has a bottom margin', function () {
                    // ... and nothing else.
                    f.$el.height( viewportHeight );
                    $body.bottomMargin( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the body content is exactly as high as the viewport, and the body has top padding', function () {
                    // ... and nothing else.
                    f.$el.height( viewportHeight );
                    $body.topPadding( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the body content is exactly as high as the viewport, and the body has bottom padding', function () {
                    // ... and nothing else.
                    f.$el.height( viewportHeight );
                    $body.bottomPadding( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the body content is exactly as high as the viewport, and the body has top padding (box-sizing: border-box)', function () {
                    // ... and nothing else.
                    f.applyBorderBox( "html" );
                    f.$el.height( viewportHeight );
                    $body.topPadding( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the body content is exactly as high as the viewport, and the body has bottom padding (box-sizing: border-box)', function () {
                    // ... and nothing else.
                    f.applyBorderBox( "html" );
                    f.$el.height( viewportHeight );
                    $body.bottomPadding( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the body content is exactly as high as the viewport, and the body has a top border', function () {
                    // ... and nothing else.
                    f.$el.height( viewportHeight );
                    $body.topBorder( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the body content is exactly as high as the viewport, and the body has a bottom border', function () {
                    // ... and nothing else.
                    f.$el.height( viewportHeight );
                    $body.bottomBorder( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the body is set to overflow:hidden and fits inside the viewport vertically, but absolutely positioned content in the document does not', function () {
                    // The positioned element does not enlarge the body (assuming the body is not positioned itself). So
                    // the overflow:hidden setting on the body is in fact irrelevant, a scroll bar still appears.
                    //
                    // ATTN The viewport (documentElement) must be set to overflow: auto. Otherwise, the body doesn't
                    // retain its overflow setting, and it gets transferred to the viewport instead.
                    // See http://jsbin.com/japewa/
                    //
                    // (This is straightforward to do in CSS, but is treacherous in JS because changing these overflows
                    // after the page load can be buggy in browsers. Check closely for anomalies if the test fails in
                    // just a single browser.)
                    f.$el.positionAt( 0, 0 ).height( viewportHeight + 1 );
                    $documentElement.overflow( "auto" );
                    $body.overflow( "hidden" );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the body content extends beyond the viewport horizontally and vertically, and the body is set to overflow: hidden but without an explicit size', function () {
                    // Because the body doesn't have an explicit with or height, it expands to the size of its content.
                    // Horizontally, that expansion stops when the body hits the window edge, and excess content is
                    // hidden. Vertically, the body expands until the content fits inside, even beyond the window
                    // height.
                    //
                    // As a result, the overflow: hidden setting on the body works horizontally, but is irrelevant
                    // vertically because there won't be any overflow, ever. Thus, the expanded body makes a vertical
                    // scroll bar appear.
                    //
                    // ATTN The viewport (documentElement) must be set to overflow: auto. Otherwise, the body doesn't
                    // retain its overflow setting, and it gets transferred to the viewport instead.
                    // See http://jsbin.com/japewa/
                    //
                    // (This is straightforward to do in CSS, but is treacherous in JS because changing these overflows
                    // after the page load can be buggy in browsers. Check closely for anomalies if the test fails in
                    // just a single browser.)
                    $documentElement.overflow( "auto" );
                    $body.overflow( "hidden" );
                    f.$el.contentBox( viewportWidth + 1, viewportHeight + 1 );

                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                if ( $.scrollbarWidth() === 0 ) {

                    it( 'when the body is as wide as the viewport without scroll bars, and extends a bit beyond it vertically (in browsers with scroll bar width 0)', function () {
                        // Normally, the vertical scroll bar would obscure part of the body and force a horizontal
                        // scroll bar as well, but with width 0 it doesn't.
                        f.$el.contentBox( viewportWidth, viewportHeight + 1 );
                        expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                    } );

                }

                it( 'when body and content fit inside the viewport, but the documentElement is set to overflow-y: scroll', function () {
                    f.$el.remove();
                    $documentElement.overflowY( "scroll" );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

            } );

            describe_noPhantom( 'It a detects a horizontal scroll bar, and not a vertical one', function () {

                it( 'when the body is wider than the viewport width', function () {
                    $body.width( viewportWidth + 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                it( 'when the body content is wider than the viewport width', function () {
                    f.$el.width( viewportWidth + 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                it( 'when the body fits inside the viewport horizontally, but the document does not', function () {
                    // This happens, for instance, when an absolutely positioned element extends off screen. The
                    // positioned element does not enlarge the body (assuming the body is not positioned itself).
                    f.$el.positionAt( 0, 0 ).width( viewportWidth + 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                it( 'when the body is set to overflow:hidden and fits inside the viewport horizontally, but absolutely positioned content in the document does not', function () {
                    // The positioned element does not enlarge the body (assuming the body is not positioned itself). So
                    // the overflow:hidden setting on the body is in fact irrelevant, a scroll bar still appears.
                    //
                    // ATTN The viewport (documentElement) must be set to overflow: auto. Otherwise, the body doesn't
                    // retain its overflow setting, and it gets transferred to the viewport instead.
                    // See http://jsbin.com/japewa/
                    //
                    // (This is straightforward to do in CSS, but is treacherous in JS because changing these overflows
                    // after the page load can be buggy in browsers. Check closely for anomalies if the test fails in
                    // just a single browser.)
                    f.$el.positionAt( 0, 0 ).width( viewportWidth + 1 );
                    $documentElement.overflow( "auto" );
                    $body.overflow( "hidden" );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                it( 'when the body content is exactly as wide as the viewport, and the body has a left margin', function () {
                    // ... and nothing else.
                    f.$el.width( viewportWidth );
                    $body.leftMargin( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                it( 'when the body content is exactly as wide as the viewport, and the body has left padding', function () {
                    // ... and nothing else.
                    f.$el.width( viewportWidth );
                    $body.leftPadding( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                it( 'when the body content is exactly as wide as the viewport, and the body has left padding (box-sizing: border-box)', function () {
                    // ... and nothing else.
                    f.applyBorderBox( "html" );
                    f.$el.width( viewportWidth );
                    $body.leftPadding( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                it( 'when the body content is exactly as wide as the viewport, and the body has a left border', function () {
                    // ... and nothing else.
                    f.$el.width( viewportWidth );
                    $body.leftBorder( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                if ( $.scrollbarWidth() === 0 ) {

                    it( 'when the body is as high as the viewport without scroll bars, and extends a bit beyond it horizontally (in browsers with scroll bar width 0)', function () {
                        // Normally, the horizontal scroll bar would obscure part of the body and force a vertical
                        // scroll bar as well, but with width 0 it doesn't.
                        f.$el.contentBox( viewportWidth + 1, viewportHeight );
                        expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                    } );

                }

                it( 'when body and content fit inside the viewport, but the documentElement is set to overflow-x: scroll', function () {
                    f.$el.remove();
                    $documentElement.overflowX( "scroll" );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

            } );

            describe_noPhantom( 'It detects a vertical and horizontal scroll bar', function () {

                it( 'when the body content is wider and higher than the viewport', function () {
                    f.$el.contentBox( viewportWidth + 1, viewportHeight + 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                } );

                if ( $.scrollbarWidth() > 0 ) {

                    it( 'when the body is as wide as the viewport without scroll bars, and extends a bit beyond it vertically', function () {
                        // The vertical scroll bar obscures part of the body and forces a horizontal scroll bar.
                        f.$el.contentBox( viewportWidth, viewportHeight + 1 );
                        expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                    } );

                    it( 'when the body is as high as the viewport without scroll bars, and extends a bit beyond it horizontally', function () {
                        // The horizontal scroll bar obscures part of the body and forces a vertical scroll bar.
                        f.$el.contentBox( viewportWidth + 1, viewportHeight );
                        expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                    } );

                }

                it( 'when body and content fit inside the viewport, but the documentElement is set to overflow:scroll', function () {
                    f.$el.remove();
                    $documentElement.overflow( "scroll" );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                } );

            } );

            describe( 'It does not detect a scroll bar', function () {

                it( 'when the body content fits inside the viewport', function () {
                    f.$el.contentBox( viewportWidth, viewportHeight );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when an element is positioned off screen in a scrollable direction, but with display:none', function () {
                    f.$el.positionAt( viewportHeight + 1, viewportWidth + 1 ).css( { display: "none" } );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the body content extends beyond the viewport horizontally and vertically, but the body is set to overflow: hidden and has a specified size smaller than the viewport', function () {
                    // ATTN The viewport (documentElement) must be set to overflow: auto. Otherwise, the body doesn't
                    // retain its overflow setting, and it gets transferred to the viewport instead.
                    // See http://jsbin.com/japewa/
                    //
                    // (This is straightforward to do in CSS, but is treacherous in JS because changing these overflows
                    // after the page load can be buggy in browsers. Check closely for anomalies if the test fails in
                    // just a single browser.)
                    $documentElement.overflow( "auto" );
                    $body.overflow( "hidden" );
                    $body.contentBox( viewportWidth - 30, viewportHeight - 30 );
                    f.$el.contentBox( viewportWidth + 1, viewportHeight + 1 );

                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the body content extends beyond the viewport horizontally and vertically, but the documentElement is set to overflow: hidden (exception: iOS, scroll bars appear)', function () {
                    f.$el.contentBox( viewportWidth + 1, viewportHeight + 1 );
                    $documentElement.overflow( "hidden" );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: viewportShowsHidden, vertical: viewportShowsHidden } );
                } );

                it( 'when an element is positioned absolutely and extends beyond the viewport horizontally and vertically, but the documentElement is set to overflow: hidden (exception: iOS, scroll bars appear)', function () {
                    // The body is not positioned and thus is not the offset parent of the element - the documentElement
                    // is.
                    f.$el.contentBox( viewportWidth + 1, viewportHeight + 1 );
                    $documentElement.overflow( "hidden" );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: viewportShowsHidden, vertical: viewportShowsHidden } );
                } );

                it( 'when the body content is exactly as wide as the viewport, and the body has a right margin', function () {
                    // ... and nothing else.
                    f.$el.width( viewportWidth );
                    $body.rightMargin( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the body content is exactly as wide as the viewport, and the body has right padding', function () {
                    // ... and nothing else.
                    f.$el.width( viewportWidth );
                    $body.rightPadding( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the body content is exactly as wide as the viewport, and the body has right padding (box-sizing: border-box)', function () {
                    // ... and nothing else.
                    f.applyBorderBox( "html" );
                    f.$el.width( viewportWidth );
                    $body.rightPadding( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the body content is exactly as wide as the viewport, and the body has a right border', function () {
                    // ... and nothing else.
                    f.$el.width( viewportWidth );
                    $body.rightBorder( 1 );
                    expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

            } );

        } );

        describe( 'Document', function () {

            var $window, viewportHeight;

            beforeEach( function () {
                f = Setup.create( "window", f );

                return f.ready.done( function () {
                    $window = $( window );
                    viewportHeight = $window.height();
                } );
            } );

            it( 'When it is called on the document, it returns the result for window scroll bars instead', function () {
                // We expand the body beyond the viewport vertically only, and verify that the returned result matches
                // that of the window.
                f.$el.height( viewportHeight + 1 );
                expect( $( document ).hasScrollbar() ).to.eql( $window.hasScrollbar() );
            } );

        } );

        describe( 'Document element', function () {

            var $window, viewportHeight;

            beforeEach( function () {
                f = Setup.create( "window", f );

                return f.ready.done( function () {
                    $window = $( window );
                    viewportHeight = $window.height();
                } );
            } );

            it( 'When it is called on the document element, it returns the result for window scroll bars instead', function () {
                // We expand the body beyond the viewport vertically only, and verify that the returned result matches
                // that of the window.
                f.$el.height( viewportHeight + 1 );
                expect( $( document.documentElement ).hasScrollbar() ).to.eql( $window.hasScrollbar() );
                expect( $( "html" ).hasScrollbar() ).to.eql( $window.hasScrollbar() );
            } );

        } );

        describe( 'Body tag', function () {

            // These tests require that the overflow setting of the body and the documentElement (viewport) are
            // modified. That is straightforward to do in CSS as a page is loaded, but it is treacherous in JS
            // because changing these overflows after the page load is _extremely_ buggy in browsers. Check closely
            // for anomalies if the test fails in just a single browser.

            var $window, $documentElement, $body, viewportWidth, viewportHeight;

            beforeEach( function () {
                f = Setup.create( "window", f );

                return f.ready.done( function () {
                    $window = $( window );
                    $documentElement = $( document.documentElement );
                    $body = $( "body" ).contentOnly();
                    viewportWidth = $window.width();
                    viewportHeight = $window.height();
                } );
            } );

            describe( 'When called on the body tag, the method returns the result for the body tag itself, not the window', function () {

                describe( 'When the body is set to overflow: visible and the viewport to overflow: visible', function () {

                    beforeEach( function () {
                        $documentElement.overflow( "visible" );
                        $body.overflow( "visible" );

                        f.$el.contentBox( viewportWidth + 1, viewportHeight + 1 );
                    } );

                    it( 'it does not return scroll bars on the body, even if the content overflows the viewport', function () {
                        expect( $body.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                    } );

                } );

                describe( 'When the body is set to overflow: visible and the viewport to overflow: auto', function () {

                    beforeEach( function () {
                        $documentElement.overflow( "auto" );
                        $body
                            .contentBox( viewportWidth - 30, viewportHeight - 30 )
                            .overflow( "visible" );

                        f.$el.contentBox( viewportWidth + 1, viewportHeight + 1 );
                    } );

                    it( 'it does not return scroll bars on the body, even if the body as a fixed size and the content overflows it', function () {
                        expect( $body.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                    } );

                } );

                describe( 'When the body is set to overflow: visible and the viewport to overflow: scroll', function () {

                    beforeEach( function () {
                        $documentElement.overflow( "scroll" );
                        $body
                            .contentBox( viewportWidth - 30, viewportHeight - 30 )
                            .overflow( "visible" );

                        f.$el.contentBox( viewportWidth + 1, viewportHeight + 1 );
                    } );

                    it( 'it does not return scroll bars on the body, even if the content overflows both body and viewport', function () {
                        expect( $body.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                    } );

                } );

                describe( 'When the body is set to overflow: auto and the viewport to overflow: visible', function () {

                    beforeEach( function () {
                        $documentElement.overflow( "visible" );
                        $body
                            .contentBox( viewportWidth - 30, viewportHeight - 30 )
                            .overflow( "auto" );

                        f.$el.contentBox( viewportWidth + 1, viewportHeight + 1 );
                    } );

                    it( 'it does not return scroll bars on the body, even if the content overflows both body and viewport', function () {
                        expect( $body.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                    } );

                    it_noPhantom( '...but it does for the window', function () {
                        expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                    } );

                } );

                describe( 'When the body is set to overflow: scroll and the viewport to overflow: visible', function () {

                    beforeEach( function () {
                        $documentElement.overflow( "visible" );
                        $body.overflow( "scroll" );
                    } );

                    it( 'it does not return scroll bars on the body', function () {
                        expect( $body.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                    } );

                    it_noPhantom( '...but it does for the window', function () {
                        expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                    } );

                } );

                describe( 'When the body is set to overflow: hidden and the viewport to overflow: visible', function () {

                    beforeEach( function () {
                        $documentElement.overflow( "visible" );
                        $body
                            .contentBox( viewportWidth - 30, viewportHeight - 30 )
                            .overflow( "hidden" );

                        f.$el.contentBox( viewportWidth + 1, viewportHeight + 1 );
                    } );

                    it( 'it does not return scroll bars on the body, even if the content overflows both body and viewport', function () {
                        expect( $body.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                    } );

                    it( '...and not for the window (except in iOS)', function () {
                        expect( $window.hasScrollbar() ).to.eql( { horizontal: viewportShowsHidden, vertical: viewportShowsHidden } );
                    } );

                } );

                describe( 'When the body is set to overflow: auto and the viewport to overflow: auto', function () {

                    var bodyWidth, bodyHeight;

                    beforeEach( function () {
                        bodyWidth = viewportWidth - 30;
                        bodyHeight = viewportHeight - 30;

                        $documentElement.overflow( "auto" );
                        $body
                            .contentBox( bodyWidth, bodyHeight )
                            .overflow( "auto" );
                    } );

                    if ( $.scrollbarWidth() > 0 ) {

                        // In this scenario, body scroll bars can only be detected if the browser scroll bar width is
                        // not 0. See limitations section in readme.

                        it( 'it returns scroll bars on the body if the content overflows the body', function () {
                            f.$el.contentBox( bodyWidth + 1, bodyHeight + 1 );
                            expect( $body.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                        } );

                        it( 'it returns a vertical scroll bar on the body if the content overflows the body vertically only', function () {
                            f.$el.contentBox( bodyWidth - $.scrollbarWidth(), bodyHeight + 1 );
                            expect( $body.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                        } );

                        it( 'it returns a horizontal scroll bar on the body if the content overflows the body horizontally only', function () {
                            f.$el.contentBox( bodyWidth + 1, bodyHeight - $.scrollbarWidth() );
                            expect( $body.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                        } );

                    }

                    it( 'it does not return scroll bars for the window, even if the body content is larger than the viewport, as long as the body itself fits inside the viewport', function () {
                        f.$el.contentBox( viewportWidth + 1, viewportHeight + 1 );
                        expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                    } );

                } );

                describe( 'When the body is set to overflow: auto and the viewport to overflow: scroll', function () {

                    beforeEach( function () {
                        $documentElement.overflow( "scroll" );
                        $body
                            .contentBox( viewportWidth - 30, viewportHeight - 30 )
                            .overflow( "auto" );

                        f.$el.contentBox( 1, 1 );
                    } );

                    it( 'it does not return scroll bars on the body if the content fits inside of it', function () {
                        expect( $body.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                    } );

                    it_noPhantom( '...but it does for the window', function () {
                        expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                    } );

                } );

                describe( 'When the body is set to overflow: auto and the viewport to overflow: hidden', function () {

                    beforeEach( function () {
                        $documentElement.overflow( "hidden" );
                        $body
                            .contentBox( viewportWidth + 1, viewportHeight + 1 )
                            .overflow( "auto" );

                        f.$el.contentBox( viewportWidth + 2, viewportHeight + 2 );
                    } );

                    if ( $.scrollbarWidth() > 0 ) {

                        // In this scenario, body scroll bars can only be detected if the browser scroll bar width is
                        // not 0. See limitations section in readme.

                        it( 'it returns scroll bars on the body if the content overflows the body', function () {
                            expect( $body.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                        } );

                    }

                    it( 'it does not return scroll bars for the window, even if the body and its content are larger than the viewport (except in iOS, where scroll bars appear)', function () {
                        expect( $window.hasScrollbar() ).to.eql( { horizontal: viewportShowsHidden, vertical: viewportShowsHidden } );
                    } );

                } );

                describe( 'When the body is set to overflow: scroll and the viewport to overflow: auto', function () {

                    beforeEach( function () {
                        $documentElement.overflow( "auto" );
                        $body
                            .contentBox( viewportWidth - 30, viewportHeight - 30 )
                            .overflow( "scroll" );
                    } );

                    it( 'it returns scroll bars on the body', function () {
                        expect( $body.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                    } );

                    it( '...but not for the window, even if the body content is larger than the viewport, as long as the body itself fits inside the viewport', function () {
                        f.$el.contentBox( viewportWidth + 1, viewportHeight + 1 );
                        expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                    } );

                } );

                describe( 'When the body is set to overflow: hidden and the viewport to overflow: auto', function () {

                    beforeEach( function () {
                        $documentElement.overflow( "auto" );
                        $body
                            .contentBox( viewportWidth - 30, viewportHeight - 30 )
                            .overflow( "hidden" );

                        f.$el.contentBox( viewportWidth + 2, viewportHeight + 2 );
                    } );

                    it( 'it does not return scroll bars on the body, even if the content overflows body and viewport', function () {
                        expect( $body.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                    } );

                    it( '...and not for the window, either, if the body fits inside the viewport', function () {
                        expect( $window.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                    } );

                    it_noPhantom( '...but it returns scroll bars for the window if the body is larger than the viewport', function () {
                        $body.contentBox( viewportWidth + 1, viewportHeight + 1 );
                        expect( $window.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                    } );

                } );

            } );

        } );

        describe( 'Element with overflow: auto', function () {

            var containerWidth, containerHeight, $content;

            beforeEach( function () {
                f = Setup.create( "overflowAuto", f );

                return f.ready.done( function () {
                    containerWidth = f.$container.width();
                    containerHeight = f.$container.height();
                    $content = f.$el;
                } );
            } );

            describe( 'It a detects a vertical scroll bar, and not a horizontal one', function () {

                it( 'when the content is longer than the element height', function () {
                    $content.height( containerHeight + 1 );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the content is exactly as high as the visible area inside the element, and the element has top padding', function () {
                    // ... and nothing else.
                    //
                    // The top padding pushes down the content.
                    var padding = 1;
                    f.$container.topPadding( padding );
                    $content.height( containerHeight + padding );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                // Removed tests:
                //
                // - when the content is exactly as high as the visible area inside the element, and the element has bottom padding
                // - when the content is exactly as high as the visible area inside the element, and the element has bottom padding (box-sizing: border-box)
                //
                // These tests presume that the bottom padding is pushed down by the content, causing scroll bars to
                // appear. But the actual behaviour is inconsistent across browsers. Padding is pushed down in Chrome
                // and Safari. In FF, IE, and Opera, the padding is squashed, and scroll bars don't appear.
                //
                // See http://jsbin.com/lokavo/9/ for an illustration.

                it( 'when the content is exactly as high as the visible area inside the element, and the element has top padding (box-sizing: border-box)', function () {
                    // ... and nothing else.
                    //
                    // The top padding pushes down the content.
                    var padding = 1;
                    f.applyBorderBox();
                    f.$container
                        .topPadding( padding )
                        .contentBox( containerWidth, containerHeight );

                    $content.height( containerHeight + padding );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the element has a bottom border, and the content extends into the it, but not beyond it', function () {
                    // ... and nothing else.
                    var border = 1;
                    f.$container.bottomBorder( border );
                    $content.height( containerHeight + border );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the content is exactly as high as the element would be without a border, but the element does have a top border', function () {
                    // ... and nothing else.
                    //
                    // The top border reduces the visible area inside the element and pushes down the content.
                    var border = 1;
                    f.$container.topBorder( border );
                    $content.height( containerHeight + border );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                if ( $.scrollbarWidth() === 0 ) {

                    it( 'when the content is as wide as the element without scroll bars, and extends a bit beyond it vertically (in browsers with scroll bar width 0)', function () {
                        // Normally, the vertical scroll bar would obscure part of the content area inside the element
                        // and force a horizontal scroll bar as well, but with width 0 it doesn't.
                        $content.contentBox( containerWidth, containerHeight + 1 );
                        expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                    } );

                }

            } );

            describe( 'It a detects a horizontal scroll bar, and not a vertical one', function () {

                it( 'when the content is wider than the element width', function () {
                    $content.width( containerWidth + 1 );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                it( 'when the content is exactly as wide as the visible area inside the element, and the element has left padding', function () {
                    // ... and nothing else.
                    //
                    // The left padding pushes the content to the right.
                    var padding = 1;
                    f.$container.leftPadding( padding );
                    $content.width( containerWidth + padding );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                it( 'when the content is exactly as wide as the visible area inside the element, and the element has left padding (box-sizing: border-box)', function () {
                    // ... and nothing else.
                    //
                    // The left padding pushes the content to the right.
                    var padding = 1;
                    f.applyBorderBox();
                    f.$container
                        .leftPadding( padding )
                        .width( containerWidth );

                    $content.width( containerWidth + padding );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                it( 'when the content is just 1px wider than the visible area inside the element, and the element has right padding', function () {
                    // ... and nothing else.
                    //
                    // The right padding is squashed by the content, not pushed out. The scroll bar only appears because
                    // the content extends even beyond the right padding. Here, we verify that a scroll bar is detected
                    // immediately once that threshold is passed.
                    var padding = 1;
                    f.$container.rightPadding( padding );
                    $content.width( containerWidth + padding + 1 );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                it( 'when the content is just 1px wider than the visible area inside the element, and the element has right padding (box-sizing: border-box)', function () {
                    // ... and nothing else.
                    //
                    // The right padding is squashed by the content, not pushed out. The scroll bar only appears because
                    // the content extends even beyond the right padding. Here, we verify that a scroll bar is detected
                    // immediately once that threshold is passed.
                    var padding = 1;
                    f.applyBorderBox();
                    f.$container
                        .rightPadding( padding )
                        .width( containerWidth );

                    $content.width( containerWidth + padding + 1 );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );


                it( 'when the element has a right border, and the content extends into the it, but not beyond it', function () {
                    // ... and nothing else.
                    var border = 1;
                    f.$container.rightBorder( border );
                    $content.width( containerWidth + border );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                it( 'when the content is exactly as wide as the element would be without a border, but the element does have a left border', function () {
                    // ... and nothing else.
                    //
                    // The left border reduces the visible area inside the element and pushes the content to the right.
                    var border = 1;
                    f.$container.leftBorder( border );
                    $content.width( containerWidth + border );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                if ( $.scrollbarWidth() === 0 ) {

                    it( 'when the content is as high as the element without scroll bars, and extends a bit beyond it horizontally (in browsers with scroll bar width 0)', function () {
                        // Normally, the horizontal scroll bar would obscure part of the content area inside the element
                        // and force a vertical scroll bar as well, but with width 0 it doesn't.
                        $content.contentBox( containerWidth + 1, containerHeight );
                        expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                    } );

                }

            } );

            describe( 'It detects a vertical and horizontal scroll bar', function () {

                it( 'when the content is wider and higher than the element', function () {
                    $content.contentBox( containerWidth + 1, containerHeight + 1 );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                } );

                if ( $.scrollbarWidth() > 0 ) {

                    it( 'when the content is as wide as the element without scroll bars, and extends a bit beyond it vertically', function () {
                        // The vertical scroll bar obscures part of the content area inside the element and forces a
                        // horizontal scroll bar.
                        $content.contentBox( containerWidth, containerHeight + 1 );
                        expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                    } );

                    it( 'when the content is as high as the element without scroll bars, and extends a bit beyond it horizontally', function () {
                        // The horizontal scroll bar obscures part of the content area inside the element and forces a
                        // vertical scroll bar.
                        $content.contentBox( containerWidth + 1, containerHeight );
                        expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                    } );

                }

            } );

            describe( 'It does not detect a scroll bar', function () {

                it( 'when the content fits inside the element', function () {
                    $content.contentBox( containerWidth, containerHeight );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the content is exactly as wide as the visible area inside the element, and the element has right padding which the content extends into', function () {
                    // ... and no other padding, borders, margins are involved.
                    //
                    // The right padding is squashed, not pushed out. A scroll bar does _not_ appear in this case. See http://jsbin.com/lokavo/9/ for an example.
                    var padding = 1;
                    f.$container.rightPadding( padding );
                    $content.width( containerWidth + padding );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the content is exactly as wide as the visible area inside the element, and the element has right padding which the content extends into (box-sizing: border-box)', function () {
                    // ... and no other padding, borders, margins are involved.
                    //
                    // The right padding is squashed, not pushed out. A scroll bar does _not_ appear in this case. See http://jsbin.com/lokavo/9/ for an example.
                    var padding = 1;
                    f.applyBorderBox();
                    f.$container
                        .rightPadding( padding )
                        .width( containerWidth );

                    $content.width( containerWidth + padding );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the content takes up the full content area of the element, and the element has margins', function () {
                    // ... and nothing else.
                    $content.contentBox( containerWidth, containerHeight );
                    f.$container.margin( 10 );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the content takes up the full content area of the element, and the element has a border, which the content lines up with', function () {
                    // ... and nothing else.
                    $content.contentBox( containerWidth, containerHeight );
                    f.$container.border( 10 );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the child nodes of the element are absolutely positioned outside of the element, but the element itself is not positioned', function () {
                    // The unpositioned element is not an offset parent for the child nodes, and they don't cause scroll bars to appear on the element.
                    $content.positionAt( containerHeight + 1, containerWidth + 1 );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the content is wider and higher than the element, but the element is set to display:none', function () {
                    $content.contentBox( containerWidth + 1, containerHeight + 1 );
                    f.$container.hide();
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the content is wider and higher than the element, but the element is not attached to the DOM', function () {
                    $content.contentBox( containerWidth + 1, containerHeight + 1 );
                    f.$container.detach();
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

            } );

        } );

        describe( 'Element with overflow:scroll', function () {

            var containerWidth, containerHeight, $content;

            beforeEach( function () {
                f = Setup.create( "overflowScroll", f );

                return f.ready.done( function () {
                    containerWidth = f.$container.width();
                    containerHeight = f.$container.height();
                    $content = f.$el;
                } );
            } );

            describe( 'It a detects a vertical scroll bar, and not a horizontal one', function () {

                it( 'when the content fits inside the element, and the element is set to overflow-x: hidden, overflow-y: scroll', function () {
                    // NB When overflow-x or overflow-y has been set to a value !== "visible" in one dimension, the
                    // other dimension defaults to "auto" and can't be set to "visible" any more.
                    f.$container
                        .overflow( "" )
                        .overflowX( "hidden" )
                        .overflowY( "scroll" );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the content fits inside the element, and the element is set to overflow-x: auto, overflow-y: scroll', function () {
                    // NB When overflow-x or overflow-y has been set to a value !== "visible" in one dimension, the
                    // other dimension defaults to "auto" and can't be set to "visible" any more.
                    f.$container
                        .overflow( "" )
                        .overflowX( "auto" )
                        .overflowY( "scroll" );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

            } );

            describe( 'It a detects a horizontal scroll bar, and not a vertical one', function () {

                it( 'when the content fits inside the element, and the element is set to overflow-x: scroll, overflow-y: hidden', function () {
                    f.$container
                        .overflow( "" )
                        .overflowX( "scroll" )
                        .overflowY( "hidden" );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                it( 'when the content fits inside the element, and the element is set to overflow-x: scroll, overflow-y: auto', function () {
                    f.$container
                        .overflow( "" )
                        .overflowX( "scroll" )
                        .overflowY( "auto" );

                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

            } );

            describe( 'It detects a vertical and horizontal scroll bar', function () {

                it( 'when the content of the element extends beyond it in both dimensions', function () {
                    $content.contentBox( containerWidth + 1, containerHeight + 1 );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                } );

                it( 'when the content of the element extends beyond it vertically only', function () {
                    $content.contentBox( 1, containerHeight + 1 );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                } );

                it( 'when the content of the element extends beyond it horizontally only', function () {
                    $content.contentBox( containerWidth + 1, 1 );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                } );

                it( 'when the element does not have any content', function () {
                    f.$container.empty();
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
                } );

            } );

            describe( 'It does not detect a scroll bar', function () {

                it( 'when the content is wider and higher than the element, but the element is set to display:none', function () {
                    $content.contentBox( containerWidth + 1, containerHeight + 1 );
                    f.$container.hide();
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the content is wider and higher than the element, but the element is not attached to the DOM', function () {
                    $content.contentBox( containerWidth + 1, containerHeight + 1 );
                    f.$container.detach();
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

            } );

        } );

        describe( 'Element with overflow: hidden', function () {

            describe( 'It does not detect a scroll bar', function () {

                var containerWidth, containerHeight, $content;

                beforeEach( function () {
                    f = Setup.create( "overflowHidden", f );

                    return f.ready.done( function () {
                        containerWidth = f.$container.width();
                        containerHeight = f.$container.height();
                        $content = f.$el;
                    } );
                } );

                it( 'when the content of the element extends beyond it in both dimensions', function () {
                    $content.contentBox( containerWidth + 1, containerHeight + 1 );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the element does not have any content', function () {
                    f.$container.empty();
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

            } );

        } );

        describe( 'Element with overflow: visible', function () {

            describe( 'It does not detect a scroll bar', function () {

                var containerWidth, containerHeight, $content;

                beforeEach( function () {
                    f = Setup.create( "overflowVisible", f );

                    return f.ready.done( function () {
                        containerWidth = f.$container.width();
                        containerHeight = f.$container.height();
                        $content = f.$el;
                    } );
                } );

                it( 'when the content of the element extends beyond it in both dimensions', function () {
                    $content.contentBox( containerWidth + 1, containerHeight + 1 );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

                it( 'when the element does not have any content', function () {
                    f.$container.empty();
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

            } );

        } );

        describe( 'Element with mixed overflows (overflowX: hidden, overflowY: auto)', function () {

            var containerWidth, containerHeight, $content;

            beforeEach( function () {
                f = Setup.create( "overflowHiddenXAutoY", f );

                return f.ready.done( function () {
                    containerWidth = f.$container.width();
                    containerHeight = f.$container.height();
                    $content = f.$el;
                } );
            } );

            describe( 'It does not detect a scroll bar', function () {

                it( 'when the element does not have any content', function () {
                    f.$container.empty();
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

            } );

            describe( 'It detects a vertical scroll bar, and not a horizontal one', function () {

                it( 'when the content of the element extends beyond it in both dimensions', function () {
                    $content.contentBox( containerWidth + 1, containerHeight + 1 );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

                it( 'when the content of the element extends beyond it vertically (overflow: auto), and is just as wide as the container horizontally (overflow: hidden)', function () {
                    // If the overflow were set to "auto" in both dimensions, this would cover the special case where
                    // the appearance of one scroll bar (vertical) would trigger the appearance of the other (because
                    // the vertical scroll bar in turn obscures content horizontally).
                    //
                    // Here it doesn't happen because of overflowX: hidden. Lets check that the method respects that and
                    // does not report a phantom scroll bar.
                    $content.contentBox( containerWidth, containerHeight + 1 );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: true } );
                } );

            } );

        } );

        describe( 'Element with mixed overflows (overflowX: auto, overflowY: hidden)', function () {

            var containerWidth, containerHeight, $content;

            beforeEach( function () {
                f = Setup.create( "overflowAutoXHiddenY", f );

                return f.ready.done( function () {
                    containerWidth = f.$container.width();
                    containerHeight = f.$container.height();
                    $content = f.$el;
                } );
            } );

            describe( 'It does not detect a scroll bar', function () {

                it( 'when the element does not have any content', function () {
                    f.$container.empty();
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: false, vertical: false } );
                } );

             } );

            describe( 'It detects a horizontal scroll bar, and not a vertical one', function () {

                it( 'when the content of the element extends beyond it in both dimensions', function () {
                    $content.contentBox( containerWidth + 1, containerHeight + 1 );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

                it( 'when the content of the element extends beyond it horizontally (overflow: auto), and is just as wide as the container vertically (overflow: hidden)', function () {
                    // If the overflow were set to "auto" in both dimensions, this would cover the special case where
                    // the appearance of one scroll bar (horizontal) would trigger the appearance of the other (because
                    // the horizontal scroll bar in turn obscures content vertically).
                    //
                    // Here it doesn't happen because of overflowY: hidden. Lets check that the method respects that and
                    // does not report a phantom scroll bar.
                    $content.contentBox( containerWidth + 1, containerHeight );
                    expect( f.$container.hasScrollbar() ).to.eql( { horizontal: true, vertical: false } );
                } );

            } );

        } );

        describe( 'Child window', function () {

            // Increase timeout to allow ample time for child window creation. Make it long enough to dismiss modal
            // warning dialogs in iOS, too, which must be done manually.
            this.timeout( 64000 );

            beforeEach( function () {
                f = Setup.create( "childWindow", f );
                return f.ready;
            } );

            itUnless(
                isPhantomJs() || isSlimerJs(), messagePhantomSlimer, 'When the child window has scroll bars and the global window does not, it detects the scroll bars of the child window', function () {
                var $childWindow = $( f.childWindow );
                f.$el.contentBox( $childWindow.width() + 1, $childWindow.height() + 1 );
                expect( $childWindow.hasScrollbar() ).to.eql( { horizontal: true, vertical: true } );
            } );

        } );

        describeUnless(
            isIOS( { eq: 9 } ),
            "Skipped in iOS 9 because of erratic behaviour of the test suite, see comment in this test",
            'Iframe', function () {

                // By default, we ensure that the global window has scroll bars and the iframe window does not. The
                // method must detect the scroll bars in the iframe window.
                //
                // This is safer than the opposite scenario, where the global window has scroll bars, and the iframe
                // does not. Not detecting scroll bars could also be the result of a general failure to detect
                // anything in an iframe.
                //
                // On iOS, however, an iframe expands to the full size of its content. We can't test for scroll bars
                // in the iframe because they will never appear. So we test the inferior scenario (scroll bars in
                // the global window only).

                // Skipping the test in iOS 9:
                //
                // In iOS 9, though, this test has proven to trigger erratic behaviour. The test itself passes, but some
                // subsequent tests fail for no apparent reason. It's always the same seven tests, scattered throughout
                // the suite - and they pass reliably if the test here is disabled. Observed in iOS 9.0.2. This has not
                // been an issue in iOS 8.
                //
                // For that reason, the test is skipped in iOS 9.

                var $iframeElement, $iframeWindow, $globalWindow, expected;

                beforeEach( function () {
                    f = Setup.create( "iframe", f );

                    return f.ready.done( function () {

                        $iframeElement = f.$container;
                        $iframeWindow = $( f.window );
                        $globalWindow = $( window );

                        // f.iframeExpands is set async, hence it can't be used in 'if' statements outside of tests or
                        // hooks!
                        if ( f.iframeExpands ) {
                            // In iOS. Huge iframe element triggers scroll bars in the global window.
                            $iframeElement.contentBox( $globalWindow.width() + 1, $globalWindow.height() + 1 );
                            expected = { horizontal: false, vertical: false };
                        } else {
                            // Not iOS. Huge content triggers scroll bars in the iframe.
                            f.$el.contentBox( $iframeWindow.width() + 1, $iframeWindow.height() + 1 );
                            expected = { horizontal: true, vertical: true };
                        }

                    } );
                } );

                describe( 'The state of scroll bars in the global window is the opposite of that in the iframe. $.fn.hasScrollbar() detects the state of the scroll bars in the iframe window', function () {

                    it( 'when called on the iframe window', function () {
                        expect( $iframeWindow.hasScrollbar() ).to.eql( expected );
                    } );

                    it( 'when called on the iframe element', function () {
                        expect( $iframeElement.hasScrollbar() ).to.eql( expected );
                    } );

                } );

            } );

    } );

})();