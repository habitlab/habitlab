'use strict';const deprecated={useFlowParser:a=>`  The ${'"useFlowParser"'} option is deprecated. Use ${'"parser"'} instead.

  Prettier now treats your configuration as:
  {
    ${'"parser"'}: ${a.useFlowParser?'"flow"':'"babylon"'}
  }`};module.exports=deprecated;

