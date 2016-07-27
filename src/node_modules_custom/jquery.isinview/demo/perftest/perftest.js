( function ( _, $, performance ) {
    "use strict";

    function createElements ( count, $container ) {
        var i, elem,
            container = $container[0],
            doc = container.ownerDocument,
            fragment = doc.createDocumentFragment();

        for ( i = 0; i < count; i++ ) {
            elem = doc.createElement( "div" );
            elem.setAttribute( "class", "testContent" );
            elem.appendChild( doc.createTextNode( String ( i + 1 ) ) );
            fragment.appendChild( elem );
        }

        container.appendChild( fragment );
    }

    function getChecked ( $fieldset ) {
        var values = [];

        $fieldset.find( "input:checked" ).each( function () {
            values.push( this.value );
        } );

        return values;
    }

    function getMeasuredDuration( entry, opts ) {
        var duration = performance.getEntriesByName( entry )[0].duration;
        if ( opts && opts.rounded ) duration = Math.round( duration );
        if ( opts && opts.unit ) duration = duration  + "ms";

        return duration;
    }

    function toggleViewMode () {
        $testManager.toggle();
        $testStage.toggle();
    }

    function toggleUI ( event ) {
        if ( event ) event.preventDefault();

        toggleViewMode();
        if ( $hideStageButton.is( ":visible" ) ) {
            $hideStageButton.hide();
        } else {
            $hideStageButton.fadeIn();
        }
    }

    function setup( spec ) {
        var iframeDocument,
            docReady = $.Deferred();

        spec.ready = $.Deferred();

        $reportCells.empty();
        $testStage.empty();

        performance.clearMarks();
        performance.clearMeasures();

        // Hide the test manager interface to make room for test elements (otherwise, none of them might classify as
        // "in view")
        toggleViewMode();
        window.scrollTo( 0, 0 );

        if ( spec.containerName === "window" ) {

            spec.$stage = $testStage;
            docReady.resolve();

        } else {

            spec.$container = $( '<' + spec.containerName + ' class="container" />' ).appendTo( $testStage );
            spec.containerSelector = spec.containerName + ".container";

            if ( spec.containerName === "iframe" ) {

                // Create a standards-compliant document in the iframe. Include the test content style in the document.
                iframeDocument = spec.$container[0].contentDocument;
                iframeDocument.write( '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>.testContent { margin: 0; padding: 0; border: 1px dotted grey; width: 10%; height: 20px; line-height: 20px; font-size: 10px; text-align: center; float: left; }</style><title></title></head><body></body></html>' );

                $( iframeDocument ).ready( function () {
                    spec.$stage = $( iframeDocument ).find( "body" );
                    docReady.resolve();
                } );

            } else {

                // Div container
                spec.$stage = spec.$container;
                docReady.resolve();

            }
        }

        docReady.done( function () {
            createElements( spec.elemCount, spec.$stage );
            spec.$elems = spec.$stage.children();

            spec.ready.resolve();
        } );

    }

    function teardown () {
        toggleViewMode();
        $showStageButton.not( ":visible" ).fadeIn();
    }

    function readSpec () {
        var spec = {};

        spec.components = getChecked( $( "#componentsUnderTest" ) );
        spec.elemCount = Number( $( "#elemCount" ).val() );
        spec.repeats = Number( $( "#repeats" ).val() );
        spec.containerName = getChecked( $( "#containerTypes" ) )[0];

        return spec;
    }

    function writeResults ( results ) {
        var componentName, result;

        // Log the full results object for inspection in the console, if need be
        if ( typeof console === "object" ) console.log( results );

        for ( componentName in results ) {
            //noinspection JSUnfilteredForInLoop
            result = results[componentName];

            $reportCells.filter( ".execTime." + componentName ).html( result.avgExecTime );
            $reportCells.filter( ".elemCount." + componentName ).html( result.visibleElements );

        }

    }

    function highlightResults () {
        $reportCells.hide().fadeIn();
    }

    function run( spec ) {

        var i, j, component, currentTest,
            prevTest = $.Deferred().resolve(),
            initialDelay = 100,
            delay = 10,
            componentCount = spec.components.length,
            results = {};

        spec.hasRun =  new $.Promises().postpone().add( prevTest );

        for ( i = 0; i < spec.repeats; i++ ) {

            for ( j = 0; j < componentCount; j++ ) {

                // Shuffle: Test components in a different order in each iteration (ie, on each repeat)
                component = spec.components[ ( i + j ) % componentCount ];

                if ( !results[component] ) results[component] = { totalExecTime: 0, runs: [] };
                currentTest = $.Deferred();
                spec.hasRun.add( currentTest );

                prevTest.done( (function () {
                    _.delay( execTest, delay * ( i * componentCount ) + j + initialDelay, i, component, currentTest, spec, results );
                })(  i, component, currentTest, spec, results ) );

                prevTest = currentTest;

            }

        }

        spec.hasRun.stopPostponing();

        return results;

    }

    function execTest ( iter, component, currentTest, spec, results ) {
        var execTime;

        performance.mark( component + iter + " - Start" );

        // Run the test, store the result
        results[component].runs.push( tests[component]( spec ) );

        performance.measure( component + iter, component + iter + " - Start" );

        // Integrate current results into the aggregated values
        results[component].skipped = results[component].skipped || results[component].runs[iter].skipped;

        if ( !results[component].skipped ) {

            execTime = getMeasuredDuration( component + iter );
            results[component].runs[iter].execTime = execTime;
            results[component].totalExecTime += execTime;
            results[component].avgExecTime = Math.round( results[component].totalExecTime / ( iter + 1 ) ) + "ms";

            if ( ! results[component].totalElements ) {
                results[component].totalElements = results[component].runs[iter].totalElements;
            } else if ( results[component].totalElements !== results[component].runs[iter].totalElements ) {
                results[component].totalElements = "ERR inconsistent";
            }

            if ( ! results[component].visibleElements ) {
                results[component].visibleElements = results[component].runs[iter].visibleElements;
            } else if ( results[component].visibleElements !== results[component].runs[iter].visibleElements ) {
                results[component].visibleElements = "ERR inconsistent";
            }

        } else {

            results[component].totalExecTime = results[component].avgExecTime = results[component].totalElements = results[component].visibleElements = "n/a";

        }

        currentTest.resolve();

    }

    var $testManager = $( "#testManager" ),
        $testStage = $( "#testStage" ),
        $reportTable = $( "#results" ).find( "table" ),
        $reportCells = $reportTable.find( "td.execTime, td.elemCount" ),
        $submit = $( "#runPerftest" ),
        $showStageButton = $( "#showStage" ),
        $hideStageButton = $( "#hideStage" ),
        tests = {};

    $submit.click( function ( event ) {
        var results,
            spec = readSpec();

        event.preventDefault();

        setup( spec );

        spec.ready.done( function () {
            results = run( spec );
        } );

        spec.hasRun.done( function () {
            writeResults( results );
            teardown();
            highlightResults();
        } );
    } );

    $showStageButton.click( toggleUI );
    $hideStageButton.click( toggleUI );

    // Test methods, for each component
    //
    // NB Method names on the test object must be the same as values of the component checkboxes in perftest/index.html

    tests.jqIsInView = function ( spec ) {
        var visibleElements,
            totalElements = spec.$elems.length;

        if ( spec.$container ) {
            visibleElements = spec.$elems.inView( spec.$container ).length;
        } else {
            visibleElements = spec.$elems.inViewport().length;
        }

        return {
            totalElements: totalElements,
            visibleElements: visibleElements,
            skipped: false
        };
    };

    tests.jqIsInViewContentBox = function ( spec ) {
        var visibleElements,
            totalElements = spec.$elems.length;

        visibleElements = spec.$elems.inView( spec.$container, { box: "content-box" } ).length;

        return {
            totalElements: totalElements,
            visibleElements: visibleElements,
            skipped: false
        };
    };

    tests.jqIsInViewSelector = function ( spec ) {
        var visibleElements,
            totalElements = spec.$elems.length,
            skipped = false;

        if ( spec.containerName !== "div" ) {
            visibleElements = spec.$elems.filter( ':inViewport' ).length;
        } else {
            // The :inViewport selector always uses a window context (also works in an iframe); it can't handle other
            // containers
            totalElements = visibleElements = "n/a";
            skipped = true;
        }

        return {
            totalElements: totalElements,
            visibleElements: visibleElements,
            skipped: skipped
        };
    };

    tests.jqIsInViewLoop = function ( spec ) {
        var visibleElements,
            totalElements = spec.$elems.length;

        if ( spec.$container ) {
            visibleElements = spec.$elems.filter( function () {
                return $( this ).isInView( spec.$container );
            } ).length;
        } else {
            visibleElements = spec.$elems.filter( function () {
                return $( this ).isInViewport();
            } ).length;
        }

        return {
            totalElements: totalElements,
            visibleElements: visibleElements,
            skipped: false
        };
    };

    tests.isInViewport = function ( spec ) {
        var visibleElements,
            totalElements = spec.$elems.length;

        if ( spec.$container ) {
            visibleElements = spec.$elems.filter( ':in-viewport( 0, ' + spec.containerSelector + ')' ).length;
        } else {
            visibleElements = spec.$elems.filter( ':in-viewport' ).length;
        }

        return {
            totalElements: totalElements,
            visibleElements: visibleElements,
            skipped: false
        };
    };

    tests.jqVisible = function ( spec ) {
        var totalElements = spec.$elems.length,
            visibleElements = 0,
            skipped = false;

        if ( spec.$container ) {

            // jquery.visible can't handle containers other than the viewport
            totalElements = visibleElements = "n/a";
            skipped = true;

        } else {

            spec.$elems.each( function () {
                if ( $( this ).visible() ) visibleElements++;
            } );

        }

        return {
            totalElements: totalElements,
            visibleElements: visibleElements,
            skipped: skipped
        };
    };

    tests.jqLazyload = function ( spec ) {
        var visibleElements = 0,
            totalElements = spec.$elems.length,

            config = { threshold : 0 };

        if ( spec.$container ) _.extend( config, { container: spec.$container[0] } );

        spec.$elems.each( function () {
            if ( $.inviewport( this, config ) ) visibleElements++;
        } );

        return {
            totalElements: totalElements,
            visibleElements: visibleElements,
            skipped: false
        };
    };

    tests.huntJs = function ( spec ) {
        var totalElements = spec.$elems.length,
            visibleElements = 0,
            skipped = false;

        if ( spec.$container ) {

            // hunt can't handle containers other than the viewport
            totalElements = visibleElements = "n/a";
            skipped = true;

        } else {

            hunt( spec.$elems.get(), {
                in: function() {
                    visibleElements++;
                }
            });

        }

        return {
            totalElements: totalElements,
            visibleElements: visibleElements,
            skipped: skipped
        };
    };

}( _, jQuery, performance ));