requirejs.config( {

    paths: {
        'jquery': 'https://code.jquery.com/jquery-1.11.3',
        'jquery.documentsize': 'https://cdn.rawgit.com/hashchange/jquery.documentsize/1.2.1/dist/amd/jquery.documentsize',
        'underscore': 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore',

        'jquery.isinview': 'https://cdn.rawgit.com/hashchange/jquery.isinview/1.0.3/dist/amd/jquery.isinview'
    },

    shim: {
        'underscore': {
            exports: '_'
        }
    }

} );
