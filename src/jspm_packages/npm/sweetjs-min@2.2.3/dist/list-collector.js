'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _immutable=require('immutable');let EMPTY;class ListCollector{constructor(b){this.value=b}static empty(){return EMPTY}concat(b){return new ListCollector(this.value.concat(b.value))}extract(){return this.value}}exports.default=ListCollector,EMPTY=new ListCollector((0,_immutable.List)());

