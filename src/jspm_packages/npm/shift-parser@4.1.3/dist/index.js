"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenType = exports.TokenClass = exports.Tokenizer = exports.EarlyErrorChecker = exports.parseScript = exports.parseModule = undefined;

var _tokenizer = require("./tokenizer");

Object.defineProperty(exports, "Tokenizer", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_tokenizer).default;
  }
});
Object.defineProperty(exports, "TokenClass", {
  enumerable: true,
  get: function get() {
    return _tokenizer.TokenClass;
  }
});
Object.defineProperty(exports, "TokenType", {
  enumerable: true,
  get: function get() {
    return _tokenizer.TokenType;
  }
});

var _parser = require("./parser");

var _earlyErrors = require("./early-errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function markLocation(node, location) {
  node.loc = {
    start: location,
    end: {
      line: this.lastLine + 1,
      column: this.lastIndex - this.lastLineStart,
      offset: this.lastIndex
    },
    source: null
  };
  return node;
} /**
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

function generateInterface(parsingFunctionName) {
  return function parse(code) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$loc = _ref.loc;
    var loc = _ref$loc === undefined ? false : _ref$loc;
    var _ref$earlyErrors = _ref.earlyErrors;
    var earlyErrors = _ref$earlyErrors === undefined ? true : _ref$earlyErrors;

    var parser = new _parser.Parser(code);
    if (loc) {
      parser.markLocation = markLocation;
    }
    var ast = parser[parsingFunctionName]();
    if (earlyErrors) {
      var errors = _earlyErrors.EarlyErrorChecker.check(ast);
      // for now, just throw the first error; we will handle multiple errors later
      if (errors.length > 0) {
        var _errors$ = errors[0];
        var node = _errors$.node;
        var message = _errors$.message;

        var offset = 0,
            line = 1,
            column = 0;
        if (node.loc != null) {
          var _node$loc$start = node.loc.start;
          offset = _node$loc$start.offset;
          line = _node$loc$start.line;
          column = _node$loc$start.column;
        }
        throw new _tokenizer.JsError(offset, line, column, message);
      }
    }
    return ast;
  };
}

var parseModule = exports.parseModule = generateInterface("parseModule");
var parseScript = exports.parseScript = generateInterface("parseScript");
exports.default = parseScript;
exports.EarlyErrorChecker = _earlyErrors.EarlyErrorChecker;