"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDecimalDigit = exports.isLineTerminator = exports.isWhiteSpace = exports.isIdentifierPart = exports.isIdentifierStart = exports.isRestrictedWord = undefined;
exports.isStrictModeReservedWord = isStrictModeReservedWord;
exports.getHexValue = getHexValue;

var _esutils = require("esutils");

var isReservedWordES6 = _esutils.keyword.isReservedWordES6; /**
                                                             * Copyright 2014 Shape Security, Inc.
                                                             *
                                                             * Licensed under the Apache License, Version 2.0 (the "License")
                                                             * you may not use this file except in compliance with the License.
                                                             * You may obtain a copy of the License at
                                                             *
                                                             *     http://www.apache.org/licenses/LICENSE-2.0
                                                             *
                                                             * Unless required by applicable law or agreed to in writing, software
                                                             * distributed under the License is distributed on an "AS IS" BASIS,
                                                             * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                             * See the License for the specific language governing permissions and
                                                             * limitations under the License.
                                                             */

var isRestrictedWord = _esutils.keyword.isRestrictedWord;
var isIdentifierStartES6 = _esutils.code.isIdentifierStartES6;
var isIdentifierPartES6 = _esutils.code.isIdentifierPartES6;
var isWhiteSpace = _esutils.code.isWhiteSpace;
var isLineTerminator = _esutils.code.isLineTerminator;
var isDecimalDigit = _esutils.code.isDecimalDigit;
exports.isRestrictedWord = isRestrictedWord;
exports.isIdentifierStart = isIdentifierStartES6;
exports.isIdentifierPart = isIdentifierPartES6;
exports.isWhiteSpace = isWhiteSpace;
exports.isLineTerminator = isLineTerminator;
exports.isDecimalDigit = isDecimalDigit;
function isStrictModeReservedWord(id) {
  return isReservedWordES6(id, true);
}

function getHexValue(rune) {
  if ("0" <= rune && rune <= "9") {
    return rune.charCodeAt(0) - 48;
  }
  if ("a" <= rune && rune <= "f") {
    return rune.charCodeAt(0) - 87;
  }
  if ("A" <= rune && rune <= "F") {
    return rune.charCodeAt(0) - 55;
  }
  return -1;
}