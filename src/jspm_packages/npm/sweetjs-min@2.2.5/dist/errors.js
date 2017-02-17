'use strict';Object.defineProperty(exports,'__esModule',{value:!0}),exports.expect=expect,exports.assert=assert;function expect(a,b,c,d){if(!a){let e='';throw d&&(e=d.slice(0,20).map(f=>{let g=f.isDelimiter()?'( ... )':f.val();return f===c?'__'+g+'__':g}).join(' ')),new Error('[error]: '+b+'\n'+e)}}function assert(a,b){if(!a)throw new Error('[assertion error]: '+b)}

