// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Depends on fixtures.generic.js
// Depends on dom-utils.js    > basic-utils.js
// Depends on jquery-utils.js > basic-utils.js
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 * Setup.create and DOMFixture modifications
 * -----------------------------------------
 *
 * In addition to the base fixture setup (see fixtures.generic.js), this version adds the following property to the
 * fixture object:
 *
 *     $container: {jQuery}    // the container passed to isInView; size 200 x 200 unless it is set to the global window
 *
 * The container size can be modified by passing the options
 *
 *     [opts.containerWidth=200]
 *     [opts.containerHeight=200]
 *
 * to Setup.create. They are synonyms for opts.windowWidth and opts.WindowHeight and can be used interchangeably.
 *
 * @name DOMFixture.$container
 * @type {jQuery}
 */


Setup.extendDefaults( {
    containerWidth: 200,
    containerHeight: 200
} );

Setup.orig = {
    window: Setup.prototype.window,
    childWindow: Setup.prototype.childWindow,
    iframe: Setup.prototype.iframe,
    _processOpts: Setup.prototype._processOpts
};

$.extend ( DOMFixture.prototype, {

    /**
     * Applies `box-sizing: border-box` to fixture.stage, or to an alternative root element (e.g. body). Is inherited by
     * the descendants of the root element.
     *
     * Is cleaned up by cleanDom().
     *
     * @param {string} [rootSelector]  the selector of the root element
     */
    applyBorderBox: function ( rootSelector ) {
        var f = this;

        rootSelector || ( rootSelector = f.stageSelector );
        f.addCssRules( [
            rootSelector + " { box-sizing: border-box; }",
            rootSelector + " *, " + rootSelector + " *:before, " + rootSelector + " *:after { box-sizing: inherit; }"
        ] );
    }

} );

$.extend( Setup.prototype, {

    // Setup types
    //
    // In addition to the variables created by the base Setup methods (see fixtures.generic.js), each setup type must
    // set the variable
    //
    // - $container:
    //     the inView container, 200 x 200px by default (unless it is the global window, then the size is a given)

    window: function () {
        this.fixture.$container = $( window );
        return Setup.orig.window.apply( this );
    },

    childWindow: function () {
        var contentReady, allReady,
            f = Setup.orig.childWindow.apply( this );

        contentReady = f.ready;
        f.ready = allReady = $.Deferred();

        contentReady.done( function () {
            f.$container = $( f.childWindow );
            allReady.resolve();
        } );

        return f;
    },

    iframe: function () {
        var f = Setup.orig.iframe.apply( this );

        f.$container = f.$canvas.find( 'iframe' ).eq( 0 );
        return f;
    },

    overflowAuto: function () {
        return this._overflowFixture( "auto" );
    },

    overflowScroll: function () {
        return this._overflowFixture( "scroll" );
    },

    overflowHidden: function () {
        return this._overflowFixture( "hidden" );
    },

    overflowVisible: function () {
        return this._overflowFixture( "visible" );
    },

    overflowHiddenXAutoY: function () {
        return this._overflowFixture( { overflowX: "hidden", overflowY: "auto" } );
    },

    overflowAutoXHiddenY: function () {
        return this._overflowFixture( { overflowX: "auto", overflowY: "hidden" } );
    },

    windowBorderBox: function () {
        var f = this.window();
        f.applyBorderBox();
        return f;
    },

    iframeBorderBox: function () {
        var f = this.iframe();
        f.applyBorderBox();
        return f;
    },

    overflowAutoBorderBox: function () {
        var f = this._overflowFixture( "auto" );
        f.applyBorderBox();
        return f;
    },

    // helper methods
    _overflowFixture: function ( overflowType ) {
        var f = this.fixture,
            overflow = isString( overflowType ) ? { overflow: overflowType } : overflowType;

        this._globalWindowFixture();
        f.$container = f.$stage
            .contentBox( this.containerWidth, this.containerHeight )
            .css( overflow );

        return f;
    },

    _processOpts: function ( opts ) {
        Setup.orig._processOpts.call( this, opts );

        this.containerWidth = this.windowWidth = opts.containerWidth || this.windowWidth || this.defaults.containerWidth;
        this.containerHeight = this.windowHeight = opts.containerHeight || this.windowHeight || this.defaults.containerHeight;
    }

} );

