'use strict';Object.defineProperty(exports,'__esModule',{value:!0}),exports.freshScope=freshScope,exports.Scope=Scope;var _symbol=require('./symbol');let scopeIndex=0;function freshScope(a='scope'){return scopeIndex++,(0,_symbol.Symbol)(a+'_'+scopeIndex)}function Scope(a){return(0,_symbol.Symbol)(a)}

