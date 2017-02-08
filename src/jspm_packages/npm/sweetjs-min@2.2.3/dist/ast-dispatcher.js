'use strict';Object.defineProperty(exports,'__esModule',{value:!0});class ASTDispatcher{constructor(a,b){this.errorIfMissing=b,this.prefix=a}dispatch(a){let b=this.prefix+a.type;if('function'==typeof this[b])return this[b](a);if(!this.errorIfMissing)return a;throw new Error(`Missing implementation for: ${b}`)}}exports.default=ASTDispatcher;

