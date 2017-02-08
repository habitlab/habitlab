"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.mixin=mixin;function mixin(a,b){class c extends a{}return Object.getOwnPropertyNames(b.prototype).forEach(d=>{if("constructor"!==d){let e=Object.getOwnPropertyDescriptor(b.prototype,d);Object.defineProperty(c.prototype,d,e)}}),c}

