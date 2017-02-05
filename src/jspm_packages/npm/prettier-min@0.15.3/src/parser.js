"use strict";function parseWithBabylon(a){const b=require("babylon");return b.parse(a,{sourceType:"module",allowImportExportEverywhere:!1,allowReturnOutsideFunction:!1,plugins:["jsx","flow","doExpressions","objectRestSpread","decorators","classProperties","exportExtensions","asyncGenerators","functionBind","functionSent","dynamicImport"]})}module.exports={parseWithBabylon};

