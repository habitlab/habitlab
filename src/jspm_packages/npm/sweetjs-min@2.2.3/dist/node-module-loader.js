'use strict';Object.defineProperty(exports,'__esModule',{value:!0}),exports.default=moduleLoader;var _fs=require('fs');function moduleLoader(a){try{return(0,_fs.readFileSync)(a,'utf8')}catch(b){return''}}

