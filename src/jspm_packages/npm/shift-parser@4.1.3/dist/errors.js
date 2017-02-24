"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
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

var ErrorMessages = exports.ErrorMessages = {
  UNEXPECTED_TOKEN: "Unexpected token {0}",
  UNEXPECTED_ILLEGAL_TOKEN: "Unexpected {0}",
  UNEXPECTED_NUMBER: "Unexpected number",
  UNEXPECTED_STRING: "Unexpected string",
  UNEXPECTED_IDENTIFIER: "Unexpected identifier",
  UNEXPECTED_RESERVED_WORD: "Unexpected reserved word",
  UNEXPECTED_TEMPLATE: "Unexpected template",
  UNEXPECTED_EOS: "Unexpected end of input",
  UNEXPECTED_LINE_TERMINATOR: "Unexpected line terminator",
  NEWLINE_AFTER_THROW: "Illegal newline after throw",
  UNTERMINATED_REGEXP: "Invalid regular expression: missing /",
  INVALID_REGEXP_FLAGS: "Invalid regular expression flags",
  INVALID_LHS_IN_ASSIGNMENT: "Invalid left-hand side in assignment",
  INVALID_LHS_IN_FOR_IN: "Invalid left-hand side in for-in",
  INVALID_LHS_IN_FOR_OF: "Invalid left-hand side in for-of",
  INVALID_UPDATE_OPERAND: "Increment/decrement target must be an identifier or member expression",
  MULTIPLE_DEFAULTS_IN_SWITCH: "More than one default clause in switch statement",
  NO_CATCH_OR_FINALLY: "Missing catch or finally after try",
  ILLEGAL_RETURN: "Illegal return statement",
  ILLEGAL_ARROW_FUNCTION_PARAMS: "Illegal arrow function parameter list",
  INVALID_VAR_INIT_FOR_IN: "Invalid variable declaration in for-in statement",
  INVALID_VAR_INIT_FOR_OF: "Invalid variable declaration in for-of statement",
  ILLEGAL_PROPERTY: "Illegal property initializer"
};