requirejs.config( {

    baseUrl: '../../bower_components',

    paths: {
        // Using a different jQuery here than elsewhere (1.x, instead of 2.x in node_modules).
        // Makes the demo work in oldIE, too.
        'jquery': '../demo/bower_demo_components/jquery/dist/jquery',
        'jquery.documentsize': '/bower_components/jquery.documentsize/dist/jquery.documentsize',
        'underscore': '../demo/bower_demo_components/underscore/underscore',

        'jquery.isinview': '/dist/amd/jquery.isinview'
    },

    shim: {
        'underscore': {
            exports: '_'
        }
    }

} );
