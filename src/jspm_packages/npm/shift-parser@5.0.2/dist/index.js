"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenType = exports.TokenClass = exports.Tokenizer = exports.ParserWithLocation = exports.GenericParser = exports.EarlyErrorChecker = exports.parseScriptWithLocation = exports.parseModuleWithLocation = exports.parseScript = exports.parseModule = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2016 Shape Security, Inc.
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
}

var ParserWithLocation = function (_GenericParser) {
  _inherits(ParserWithLocation, _GenericParser);

  function ParserWithLocation(source) {
    _classCallCheck(this, ParserWithLocation);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ParserWithLocation).call(this, source));

    _this.locations = new WeakMap();
    return _this;
  }

  _createClass(ParserWithLocation, [{
    key: "startNode",
    value: function startNode() {
      return this.getLocation();
    }
  }, {
    key: "finishNode",
    value: function finishNode(node, start) {
      this.locations.set(node, {
        start: start,
        end: this.getLocation()
      });
      return node;
    }
  }, {
    key: "copyNode",
    value: function copyNode(src, dest) {
      this.locations.set(dest, this.locations.get(src)); // todo check undefined
      return dest;
    }
  }]);

  return ParserWithLocation;
}(_parser.GenericParser);

function generateInterface(parsingFunctionName) {
  return function parse(code) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$earlyErrors = _ref.earlyErrors;
    var earlyErrors = _ref$earlyErrors === undefined ? true : _ref$earlyErrors;

    var parser = new _parser.GenericParser(code);
    var tree = parser[parsingFunctionName]();
    if (earlyErrors) {
      var errors = _earlyErrors.EarlyErrorChecker.check(tree);
      // for now, just throw the first error; we will handle multiple errors later
      if (errors.length > 0) {
        var _errors$ = errors[0];
        var node = _errors$.node;
        var message = _errors$.message;

        throw new _tokenizer.JsError(0, 1, 0, message);
      }
    }
    return tree;
  };
}

function generateInterfaceWithLocation(parsingFunctionName) {
  return function parse(code) {
    var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref2$earlyErrors = _ref2.earlyErrors;
    var earlyErrors = _ref2$earlyErrors === undefined ? true : _ref2$earlyErrors;

    var parser = new ParserWithLocation(code);
    var tree = parser[parsingFunctionName]();
    if (earlyErrors) {
      var errors = _earlyErrors.EarlyErrorChecker.check(tree);
      // for now, just throw the first error; we will handle multiple errors later
      if (errors.length > 0) {
        var _errors$2 = errors[0];
        var node = _errors$2.node;
        var message = _errors$2.message;
        var _parser$locations$get = parser.locations.get(node).start;
        var offset = _parser$locations$get.offset;
        var line = _parser$locations$get.line;
        var column = _parser$locations$get.column;

        throw new _tokenizer.JsError(offset, line, column, message);
      }
    }
    return { tree: tree, locations: parser.locations };
  };
}

var parseModule = exports.parseModule = generateInterface("parseModule");
var parseScript = exports.parseScript = generateInterface("parseScript");
var parseModuleWithLocation = exports.parseModuleWithLocation = generateInterfaceWithLocation("parseModule");
var parseScriptWithLocation = exports.parseScriptWithLocation = generateInterfaceWithLocation("parseScript");
exports.default = parseScript;
exports.EarlyErrorChecker = _earlyErrors.EarlyErrorChecker;
exports.GenericParser = _parser.GenericParser;
exports.ParserWithLocation = ParserWithLocation;