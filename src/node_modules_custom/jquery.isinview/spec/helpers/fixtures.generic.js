// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Depends on dom-utils.js    > basic-utils.js
// Depends on jquery-utils.js > basic-utils.js
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 * DOM fixture object. Create and populate it with Setup.create().
 *
 * Holds DOM-related fixture information, including references to key DOM elements. Provides methods for safely altering
 * the DOM, and for restoring it to its initial state. Most methods will be used by Setup only. The exceptions are the
 * the cleanDom() and shutdown() methods, which are commonly called in the test code.
 *
 * @property {jQuery.Deferred}      ready             Deferred which resolves when the setup is ready (synchronous
 *                                                    setups return a deferred which is already resolved)
 *
 * @property {Window|null}          childWindow       child window handle when running the "childWindow" setup type;
 *                                                    otherwise null
 * @property {jQuery.Deferred|null} childWindowReady  Deferred which resolves when the child window is of stable size
 *                                                    and past its DOM ready event (but its custom DOM content not yet
 *                                                    set up); otherwise null
 *
 * @property {boolean}              iframeExpands     true if the browser expands iframes to the size of their content,
 *                                                    even if they are given an explicit width and height. This is the
 *                                                    case on iOS. ATTN: Set only when running the "iframe" setup type!
 *
 * @property {jQuery}               $canvas           the test area in the global window (prepended to body). Equal to
 *                                                    $stage when in the global window; contains the iframe element when
 *                                                    testing iframes ($stage is iframe body then)
 *
 * @property {jQuery}               $stage            a wrapper for the test element(s), when needed for isolation and
 *                                                    clean-up. Same as $canvas when in the global window, otherwise
 *                                                    body
 * @property {string}               stageSelector     a CSS/jQuery selector matching the $stage element (and no other
 *                                                    elements)
 * @property {jQuery}               $el               a div, size 50 x 50 by default
 *
 * @property {Document}             document          the document to which the test elements belong (window document,
 *                                                    iframe document, child window document)
 * @property {Window}               window            the window to which the test elements belong (global window iframe
 *                                                    window, child window)
 *
 * @constructor
 */
function DOMFixture () {}

$.extend( DOMFixture.prototype, {

    /**
     * Hides pre-existing body content, such as Mocha test output, in the global window.
     */
    hidePreexistingBodyContent: function () {
        $( 'body' ).children().hide();
        this._hiddenBodyContent = true;
    },

    /**
     * Shows pre-existing body content, such as Mocha test output, in the global window again if it has been hidden with
     * hidePreexistingBodyContent().
     */
    showPreexistingBodyContent: function () {
        if ( this._hiddenBodyContent ) {
            $( 'body' ).children().show();
            delete this._hiddenBodyContent;
        }
    },

    /**
     * Saves the styles of body and documentElement in the global and child window, for later restoration by
     * restoreStyles().
     */
    saveStyles: function () {
        var f = this,
            styles = f._styles = { childWindow: {} };

        if ( f.childWindowReady ) f.childWindowReady.done( function () {

            styles.childWindow.documentElement = f.childWindow.document.documentElement.style.cssText;
            styles.childWindow.body = f.childWindow.document.body.style.cssText;

        } );

        styles.documentElement = document.documentElement.style.cssText;
        styles.body = document.body.style.cssText;
    },

    /**
     * Restores the styles of body and documentElement in the global and child window to their state before the test.
     * That state must have been captured with saveStyles().
     */
    restoreStyles: function () {
        var f = this,
            styles = f._styles;

        if ( styles ) {

            if ( f.childWindow ) {
                f.childWindow.document.documentElement.style.cssText = styles.childWindow.documentElement;
                f.childWindow.document.body.style.cssText = styles.childWindow.body;
            }

            document.documentElement.style.cssText = styles.documentElement;
            document.body.style.cssText = styles.body;

            delete f._styles;

        }
    },

    /**
     * Marks an element for removal by cleanDom().
     *
     * @param {jQuery} $el
     */
    addToCleanup: function ( $el ) {
        if ( ! this._$elementsForCleanup ) this._$elementsForCleanup = [];
        this._$elementsForCleanup.push( $el );
    },

    /**
     * Creates a CSS rule, or a set of rules, and appends them to the head in a style tag.
     *
     * The rules will be cleaned up (style tag removed) by cleanDom().
     *
     * @param {string|string[]} rules     CSS rules as they would appear in the style sheet, e.g. ".foo, #bar { color: red; }"
     */
    addCssRules: function ( rules ) {
        var f = this,
            $head = $( 'head', f.document ),
            styleEl = f.document.createElement( 'style' ),
            styleSheet;

        styleEl.setAttribute( 'type', 'text/css' );
        // WebKit hack, see http://davidwalsh.name/add-rules-stylesheets
        styleEl.appendChild( f.document.createTextNode( "" ) );

        $head.append( styleEl );
        styleSheet = styleEl.sheet || styleEl.styleSheet;

        if ( ! $.isArray( rules ) ) rules = [ rules ];
        $.each( rules, function ( index, rule ) {
            styleSheet.insertRule( rule, index );
        } );

        this.addToCleanup( $( styleEl ) );
    },

    /**
     * Saves the state of the DOM for later restoration.
     *
     * Specifically, it
     *
     * - saves the styles of body and documentElement in the global and child window
     * - hides pre-existing body content, such as Mocha test output, in the global window (unless disabled)
     *
     * @param {Object}     [opts]
     * @param {boolean}    [opts.hidePreexistingBodyContent=true]  if set to false, the body content in the _global_ window
     *                                                             is not hidden during the test (default: is hidden)
     */
    saveState: function ( opts ) {
        this.saveStyles();
        if ( ! opts || opts.hidePreexistingBodyContent !== false ) this.hidePreexistingBodyContent();
    },

    /**
     * Cleans up the DOM after a test.
     *
     * Specifically, it
     *
     * - removes the $canvas from the global window
     * - removes any other custom elements marked for cleanup with addToCleanup()
     * - empties the body of a child window created for tests (but does not close the child window, use shutdown() for
     *   this)
     * - shows pre-existing content in the global window again if it had been hidden
     * - restores the styles of body and documentElement in the global window, and in the child window, to their state
     *   before the test.
     */
    cleanDom: function () {
        var i,
            f = this;

        if ( f._$elementsForCleanup ) {
            for ( i = 0; i < f._$elementsForCleanup.length; i++ ) f._$elementsForCleanup[i].remove();
        }

        if ( f.childWindow ) $( f.childWindow.document.body ).empty();

        this.restoreStyles();

        // Show pre-existing content in the root window again.
        this.showPreexistingBodyContent();
    },

    /**
     * Shuts down the test fixture. Does everything cleanDom() does, and also closes a generated child window if it
     * exists.
     */
    shutdown: function () {
        this.cleanDom();
        if ( this.childWindow ) {
            this.childWindow.close();
            delete this.childWindow;
            delete this.childWindowReady;
        }
    }

} );

/**
 * Fixture setup constructor. Creates or augments a DOM fixture object. Don't call directly, use the Setup.create()
 * factory method instead.
 *
 * @param {DOMFixture}  [fixture]  a fixture to augment or update; if omitted, a new DOMFixture is created.
 * @param {Object}      [opts]
 * @param {number}      [opts.elWidth=50]
 * @param {number}      [opts.elHeight=50]
 * @param {number}      [opts.windowWidth=200]
 * @param {number}      [opts.windowHeight=200]
 * @param {boolean}     [opts.createEl=true]        if false, the stage is created empty
 * @constructor
 */
function Setup ( fixture, opts ) {
    opts || ( opts = {} );

    this.fixture = fixture || new DOMFixture();
    this.testId = getTimestamp();
    this._processOpts( opts );
}

Setup.setDefaults = function ( defaults ) {
    Setup.prototype.defaults = defaults;
};

Setup.extendDefaults = function ( defaults ) {
    $.extend( Setup.prototype.defaults, defaults );
};

Setup.setDefaults( {
    createEl: true,
    elWidth: 50,
    elHeight: 50,
    windowWidth: 200,
    windowHeight: 200
} );

$.extend( Setup.prototype, {

    // Setup types
    //
    // Each setup type must set the variables
    //
    // - $stage:
    //     an easy-to-manage wrapper for the test element(s), needed for isolation and clean-up. Same as $canvas when
    //     in the global window, otherwise body.
    // - stageSelector:
    //     a CSS/jQuery selector matching the stage element (and no other elements).
    // - $el:
    //     a test div element, 50 x 50px by default (leave undefined if this.createEl is false)
    // - document:
    //     the document context for the container
    // - window:
    //     the window context for the container (may be identical to the container)
    // - ready:
    //     a deferred which resolves when the setup is ready (synchronous setups return a deferred which is already
    //     resolved)
    //
    // Other considerations:
    //
    // - The method must return the fixture object
    // - All DOM elements must be created without padding, margin, borders initially (just call .contentOnly()).
    //

    window: function () {
        validateWindowSize( { width: this.windowWidth, height: this.windowHeight } );
        this._globalWindowFixture();
        return this.fixture;
    },

    childWindow: function () {
        var f = this.fixture,
            defaults = this,
            contentReady = $.Deferred();

        this._createChildWindow().done( function () {

            f.document = f.childWindow.document;
            $( f.document ).find( "body, html" ).contentOnly();

            f.stageSelector = "body";
            f.$stage = $( f.document.body )
                .contentOnly();

            if ( defaults.createEl ) f.$el = $( '<div/>', f.document )
                .contentOnly()
                .contentBox( defaults.elWidth, defaults.elHeight )
                .appendTo( f.$stage );

            contentReady.resolve();

        } );

        f.ready = contentReady;
        return f;
    },

    iframe: function () {

        var f = this.fixture,

            iframe = createIframe( { parent: f.$canvas, prepend: true } ),
            $iframe = $( iframe )
                .contentOnly()
                .contentBox( this.windowWidth, this.windowHeight );

        f.window = iframe.contentWindow;
        f.document = iframe.contentDocument;
        $( f.document ).find( "body, html" ).contentOnly();

        f.stageSelector = "body";
        f.$stage = $( f.document.body )
            .contentOnly();

        if ( this.createEl ) f.$el = $( '<div/>', f.document )
            .contentOnly()
            .contentBox( this.elWidth, this.elHeight )
            .appendTo( f.$stage );

        // No need to re-test the iframe expansion feature if there already is a result
        if ( isUndefined( f.iframeExpands ) ) f.iframeExpands = testIframeExpands();

        f.ready = $.Deferred().resolve();

        return f;
    },

    // helper methods
    _alwaysBefore: function () {
        var f = this.fixture;

        $( "body, html" ).contentOnly();
        f.$canvas = $( '<div id="testId_' + this.testId + '"/>' )
            .contentOnly()
            .prependTo( 'body' );

        f.addToCleanup( f.$canvas );
    },

    _globalWindowFixture: function () {
        var f = this.fixture;

        f.window = window;
        f.document = document;
        f.$stage = f.$canvas;
        f.stageSelector = "#" + f.$canvas[0].id;

        f.ready = $.Deferred().resolve();

        if ( this.createEl ) f.$el = $( '<div/>' )
            .contentOnly()
            .contentBox( this.elWidth, this.elHeight )
            .appendTo( f.$stage );
    },

    _createChildWindow: function () {
        var f = this.fixture;

        if ( !f.childWindow ) {
            f.childWindowReady = $.Deferred();
            f.childWindow = createChildWindow( f.childWindowReady, { width: this.windowWidth, height: this.windowHeight } );
            f.window = f.childWindow;
        } else {
            $( f.childWindow.document.body ).empty();
        }
        if ( !f.childWindow ) throw new Error( "Can't create child window for tests. Please check if a pop-up blocker is preventing it" );

        return f.childWindowReady;
    },

    _processOpts: function ( opts ) {
        this.elWidth = opts.elWidth || this.defaults.elWidth;
        this.elHeight = opts.elHeight || this.defaults.elHeight;

        this.windowWidth = opts.windowWidth || this.defaults.windowWidth;
        this.windowHeight = opts.windowHeight || this.defaults.windowHeight;

        this.createEl = typeof opts.createEl === "undefined" ? this.defaults.createEl : opts.createEl;
    }

} );

/**
 * Populates a DOMFixture object for a given setup type. The fixture can be passed in by reference or is created new.
 * Returns the fixture.
 *
 * Setup.create always adds an outer test div ($canvas) to the body of the global window, irrespective of the setup
 * type. The $canvas contains another div element ($el) by default.
 *
 * Setup.create hides pre-existing body content by default.
 *
 * Pre-existing body content
 * -------------------------
 *
 * Getting pre-existing body content out of the way (ie, hiding Mocha test output) may not be necessary for many tests.
 * It is slow and causes a flicker, too. However, it is required for tests which take the size of the body, document, or
 * window into account, or monitor window scroll bars. Hiding body content by default is the safe option; disable when
 * feasible.
 *
 * Invocation
 * ----------
 *
 * A typical way to call the method would be:
 *
 *     beforeEach( function () {
 *         fixture = Setup.create( setupType, fixture );
 *         return fixture.ready.done( function () {
 *             // use the fixture properties for more setup stuff
 *         } );
 *     } );
 *
 * Note that beforeEach returns the fixture.ready deferred, which makes beforeEach async.
 *
 * For restoring the DOM to its initial state, undoing the changes of Setup.create, call fixture.cleanDom() or
 * fixture.shutdown() in afterEach or after.
 *
 * @param {string}          type                                    fixture type (ie, the name of the setup method to be called).
 *                                                                  Values: "window", "childWindow", "iframe"
 * @param {DOMFixture}      [fixture]                               a fixture to augment or update; if omitted, a new DOMFixture is created.
 * @param {Object}          [opts]
 * @param {number}          [opts.elWidth=50]
 * @param {number}          [opts.elHeight=50]
 * @param {number}          [opts.windowWidth=200]                  width of iframe and child windows, required min-width of global window
 * @param {number}          [opts.windowHeight=200]                 height of iframe and child windows, required min-height of global window
 * @param {boolean}         [opts.createEl=true]                    if false, the stage is created empty
 * @param {boolean}         [opts.hidePreexistingBodyContent=true]  if set to false, the body content in the _global_ window
 *                                                                  is not hidden during the test (default: is hidden unless
 *                                                                  the test type is "child window")
 * @param {string|string[]} [opts.injectCss]                        adds CSS rules to a style tag placed at the end of the document head. Pass
 *                                                                  rules as they would appear in the style sheet, e.g. ".foo, #bar { color: red; }".
 *                                                                  The styles are cleaned up by fixture.cleanDom()
 *
 * @returns {DOMFixture}
 */
Setup.create = function ( type, fixture, opts ) {
    var setup, contentReady, allReady;

    opts || ( opts = {} );
    if ( typeof opts.hidePreexistingBodyContent === "undefined" ) opts.hidePreexistingBodyContent = type !== "childWindow";

    fixture || ( fixture = new DOMFixture() );

    fixture.saveState( opts );

    setup = new Setup( fixture, opts );
    setup._alwaysBefore();

    fixture = setup[type]();

    if ( opts.injectCss ) {

        contentReady = fixture.ready;
        fixture.ready = allReady = $.Deferred();

        contentReady.done( function () {
            fixture.addCssRules( opts.injectCss );
            allReady.resolve();
        } );

    }

    return fixture;
};

