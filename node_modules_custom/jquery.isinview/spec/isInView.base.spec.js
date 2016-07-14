/*global describe, it, $ */
(function () {
    "use strict";

    describe( 'isInView: basics', function () {

        var testId,
            $testStage, testStageId, testStageSelector,
            $container, containerId, containerSelector,
            $el,
            $containerIframe, iframeId, iframeSelector, iframeDocument,
            $elInIframe,
            childWindow;

        // Increase timeout to allow ample time for child window creation. Make it long enough to dismiss modal warning
        // dialogs in iOS, too, which must be done manually.
        this.timeout( 64000 );

        before( function ( done ) {
            var childWindowReady = $.Deferred();

            childWindow = createChildWindow( childWindowReady );
            if ( !childWindow ) throw new Error( "Can't create child window for tests. Please check if a pop-up blocker is preventing it" );

            childWindowReady.done( function () { done(); } );
        } );

        after( function () {
            if ( childWindow ) childWindow.close();
        } );

        beforeEach( function () {
            testId = getTimestamp();

            testStageId = "testStage_" + testId;
            testStageSelector = "#" + testStageId;

            containerId = "test_container_" + testId;
            containerSelector = "#" + containerId;

            iframeId = "test_iframe_" + testId;
            iframeSelector = "#" + iframeId;

            $el = $( '<div/>' ).contentBox( 50, 50 ).contentOnly();
            $container = $( '<div id="' + containerId + '"/>' ).append( $el ).contentOnly();

            $testStage = $( '<div id="' + testStageId + '"/>' ).append( $container ).prependTo( document.body ).contentOnly();

            // NB The iframe content document can only be created if the parent is already inserted into the DOM.
            $containerIframe = $( createIframe( { parent: $testStage } ) ).attr( { id: iframeId } ).contentOnly();
            iframeDocument = $containerIframe[0].contentDocument;

            $elInIframe = $( '<div/>', iframeDocument ).contentBox( 50, 50 ).contentOnly();
            $( iframeDocument.body ).append( $elInIframe ).contentOnly();

            $( "body, html" ).contentOnly();
            $( iframeDocument ).find( "body, html" ).contentOnly();
        } );

        afterEach( function () {
            if ( $testStage ) $testStage.remove();
        } );

        describe( 'For a container, it', function () {

            it( 'accepts a window', function () {
                expect( function () { $el.isInView( window ); } ).not.to.throw( Error );
            } );

            it( 'accepts a $( window )', function () {
                expect( function () { $el.isInView( $( window ) ); } ).not.to.throw( Error );
            } );

            it( 'accepts an element with overflow:scroll', function () {
                $container.css( { overflow: "scroll" } );
                expect( function () { $el.isInView( $container[0] ); } ).not.to.throw( Error );
            } );

            it( 'accepts an element with overflow:auto', function () {
                $container.css( { overflow: "auto" } );
                expect( function () { $el.isInView( $container[0] ); } ).not.to.throw( Error );
            } );

            it( 'accepts an element with overflow:hidden', function () {
                $container.css( { overflow: "hidden" } );
                expect( function () { $el.isInView( $container[0] ); } ).not.to.throw( Error );
            } );

            it( 'accepts an element with suitable overflow (scroll, hidden, auto) in a jQuery wrapper', function () {
                $container.css( { overflow: "auto" } );
                expect( function () { $el.isInView( $container ); } ).not.to.throw( Error );
            } );

            it( 'accepts an iframe', function () {
                expect( function () { $elInIframe.isInView( $containerIframe[0] ); } ).not.to.throw( Error );
            } );

            it( 'accepts an iframe in a jQuery wrapper', function () {
                expect( function () { $elInIframe.isInView( $containerIframe ); } ).not.to.throw( Error );
            } );

            it( 'accepts a document', function () {
                expect( function () { $el.isInView( document ); } ).not.to.throw( Error );
            } );

            it( 'accepts a document in a jQuery wrapper', function () {
                expect( function () { $el.isInView( $( document ) ); } ).not.to.throw( Error );
            } );

            it( 'accepts a selector string for an element with suitable overflow (scroll, hidden, auto)', function () {
                $container.css( { overflow: "auto" } );
                expect( function () { $el.isInView( containerSelector ); } ).not.to.throw( Error );
            } );

            it( 'accepts a selector string for an iframe element', function () {
                expect( function () { $elInIframe.isInView( iframeSelector ); } ).not.to.throw( Error );
            } );

            it( 'throws an error when passed an element with overflow:visible', function () {
                $container.css( { overflow: "visible" } );
                expect( function () { $el.isInView( $container[0] ); } ).to.throw( Error );
            } );

            it( 'throws an error when passed an element with overflow:visible, in a jQuery wrapper', function () {
                $container.css( { overflow: "visible" } );
                expect( function () { $el.isInView( $container ); } ).to.throw( Error );
            } );

            it( 'throws an error when passed the queried element itself', function () {
                // Set the element to overflow:auto to make sure the error is caused by the identity, not an
                // unsuitable overflow setting.
                $el.css( { overflow: "auto" } );
                expect( function () { $el.isInView( $el[0] ); } ).to.throw( Error );
            } );

            it( 'throws an error when passed the queried element itself, in a jQuery wrapper', function () {
                // Set the element to overflow:auto to make sure the error is caused by the identity, not an
                // unsuitable overflow setting.
                $el.css( { overflow: "auto" } );
                expect( function () { $el.isInView( $el ); } ).to.throw( Error );
            } );

            it( 'throws an error when passed an element which is the child of the queried element', function () {
                var $childContainer = $( "<div/>" ).css( { overflow: "auto" } ).appendTo( $el );
                expect( function () { $el.isInView( $childContainer[0] ); } ).to.throw( Error );
            } );

            it( 'throws an error when passed an element which is the child of the queried element, in a jQuery wrapper', function () {
                var $childContainer = $( "<div/>" ).css( { overflow: "auto" } ).appendTo( $el );
                expect( function () { $el.isInView( $childContainer ); } ).to.throw( Error );
            } );

            it( 'throws an error when passed a window does not contain the queried element', function () {
                expect( function () { $el.isInView( childWindow ); } ).to.throw( Error );
            } );

            it( 'throws an error when passed a window does not contain the queried element, in a jQuery wrapper', function () {
                expect( function () { $el.isInView( $( childWindow ) ); } ).to.throw( Error );
            } );

            it( 'throws an error when passed an empty jQuery wrapper', function () {
                expect( function () { $el.isInView( $() ); } ).to.throw( Error );
            } );

            it( 'throws an error when passed a selector which matches an unsuitable element, eg with overflow:visible', function () {
                $container.css( { overflow: "visible" } );
                expect( function () { $el.isInView( containerSelector ); } ).to.throw( Error );
           } );

            it( 'throws an error when passed a selector which does not match an element', function () {
                expect( function () { $el.isInView( "#i_do_not_exist" ); } ).to.throw( Error );
            } );

        } );

        describe( 'When unspecified, the container defaults to ', function () {

            it( 'the current (root) window if the element is in the root window', function () {
                // We test this by checking an element in a nested container. It is invisible in the inner container,
                // but on screen with regard to the viewport.
                $container.overflow( "auto" ).contentBox( 50, 50 ).positionAt( -50, 0 );
                $el.positionAt( 51, 0 );
                expect( $el.isInView() ).to.be.true;
            } );

            it( 'the current (child) window if the element is in a child window', function () {
                // We test this by checking an element in a nested container. It is invisible in the inner container,
                // but on screen with regard to the viewport.
                var $elInChildWindow = $( '<div/>', childWindow.document )
                        .contentOnly().contentBox( 50, 50 ).positionAt( 51, 0 ),

                    $containerInChildWindow = $( '<div/>', childWindow.document )
                        .prependTo( childWindow.document.body )
                        .append( $elInChildWindow )
                        .contentOnly().overflow( "auto" ).contentBox( 50, 50 ).positionAt( -50, 0 );

                expect( $elInChildWindow.isInView() ).to.equal( $elInChildWindow.isInView( childWindow.document ) );
                expect( $elInChildWindow.isInView() ).to.be.true;
            } );

            it_noPhantom( 'the current (iframe) window if the element is in an iframe', function () {
                // ATTN This test fails in PhantomJS. This is a PhantomJS issue, not one of jQuery.isInView.

                // We test this by moving the iframe off screen, then checking an element in a nested container. It is
                // invisible in the inner container, and not in view with regard to the viewport, but inside the
                // confines of the iframe window.
                var $containerInIframe = $( '<div/>', iframeDocument )
                    .prependTo( iframeDocument.body )
                    .append( $elInIframe )
                    .contentOnly().overflow( "auto" ).contentBox( 50, 50 ).positionAt( -50, 0 );

                $elInIframe.positionAt( 51, 0 );
                $containerIframe.contentBox( 200, 200 ).positionAt( -400, 0 );

                expect( $elInIframe.isInView() ).to.equal( $elInIframe.isInView( iframeDocument ) );
                expect( $elInIframe.isInView() ).to.be.true;
            } );

        } );

        describe( 'When the element selection', function () {

            it( 'is empty, isInView returns false', function () {
                expect( $().isInView() ).to.be.false;
            } );

            it( 'consists of more than one element, only the first one is examined and the others are ignored', function () {
                // We test this by
                // (a) positioning the first element in view and the second outside, and then
                // (b) positioning the second element in view, and the first outside
                var $elOut = $( '<div/>' ).contentBox( 50, 50 ).contentOnly().positionAt( -100, -100 );

                $elOut.insertAfter( $el );
                expect( $container.children().isInView() ).to.be.true;

                $elOut.insertBefore( $el );
                expect( $container.children().isInView() ).to.be.false;
            } );

        } );

        describe( 'The method does not rely on the exposed plugin API. When all other public methods of the plugin are deleted from jQuery', function () {

            var deletedApi;

            beforeEach( function () {
                deletedApi = deletePluginApiExcept( "isInView" );
            } );

            afterEach( function () {
                restorePluginApi( deletedApi );
            } );

            it( 'it works correctly for a window container. When the element is in view in the global window, $.fn.isInView returns true', function () {
                expect( $el.isInView() ).to.be.true;
            } );

            it( 'it works correctly for a an HTMLElement container. When the element is in view in another element set to overflow:auto, $.fn.isInView returns true', function () {
                $container
                    .contentBox( 200, 200 )
                    .overflow ( "auto" );

                expect( $el.isInView( $container ) ).to.be.true;
            } );

        } );

    } );

})();