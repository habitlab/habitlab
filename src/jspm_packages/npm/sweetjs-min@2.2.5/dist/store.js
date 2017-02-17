"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class Store extends Map{constructor(a){super(),this.backingObject=a}set(a,b){super.set(a,b),this.backingObject[a]=b}getBackingObject(){return this.backingObject}}exports.default=Store;

