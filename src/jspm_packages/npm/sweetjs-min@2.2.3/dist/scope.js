"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.freshScope=freshScope,exports.Scope=Scope;var _symbol=require("./symbol");let scopeIndex=0;function freshScope(){let a=0>=arguments.length||void 0===arguments[0]?"scope":arguments[0];return scopeIndex++,(0,_symbol.Symbol)(a+"_"+scopeIndex)}function Scope(a){return(0,_symbol.Symbol)(a)}

