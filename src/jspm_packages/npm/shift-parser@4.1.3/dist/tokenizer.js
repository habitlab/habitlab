"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsError = exports.TokenType = exports.TokenClass = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require("./utils");

var _errors = require("./errors");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
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

var TokenClass = exports.TokenClass = {
  Eof: { name: "<End>" },
  Ident: { name: "Identifier", isIdentifierName: true },
  Keyword: { name: "Keyword", isIdentifierName: true },
  NumericLiteral: { name: "Numeric" },
  TemplateElement: { name: "Template" },
  Punctuator: { name: "Punctuator" },
  StringLiteral: { name: "String" },
  RegularExpression: { name: "RegularExpression" },
  Illegal: { name: "Illegal" }
};

var TokenType = exports.TokenType = {
  EOS: { klass: TokenClass.Eof, name: "EOS" },
  LPAREN: { klass: TokenClass.Punctuator, name: "(" },
  RPAREN: { klass: TokenClass.Punctuator, name: ")" },
  LBRACK: { klass: TokenClass.Punctuator, name: "[" },
  RBRACK: { klass: TokenClass.Punctuator, name: "]" },
  LBRACE: { klass: TokenClass.Punctuator, name: "{" },
  RBRACE: { klass: TokenClass.Punctuator, name: "}" },
  COLON: { klass: TokenClass.Punctuator, name: ":" },
  SEMICOLON: { klass: TokenClass.Punctuator, name: ";" },
  PERIOD: { klass: TokenClass.Punctuator, name: "." },
  ELLIPSIS: { klass: TokenClass.Punctuator, name: "..." },
  ARROW: { klass: TokenClass.Punctuator, name: "=>" },
  CONDITIONAL: { klass: TokenClass.Punctuator, name: "?" },
  INC: { klass: TokenClass.Punctuator, name: "++" },
  DEC: { klass: TokenClass.Punctuator, name: "--" },
  ASSIGN: { klass: TokenClass.Punctuator, name: "=" },
  ASSIGN_BIT_OR: { klass: TokenClass.Punctuator, name: "|=" },
  ASSIGN_BIT_XOR: { klass: TokenClass.Punctuator, name: "^=" },
  ASSIGN_BIT_AND: { klass: TokenClass.Punctuator, name: "&=" },
  ASSIGN_SHL: { klass: TokenClass.Punctuator, name: "<<=" },
  ASSIGN_SHR: { klass: TokenClass.Punctuator, name: ">>=" },
  ASSIGN_SHR_UNSIGNED: { klass: TokenClass.Punctuator, name: ">>>=" },
  ASSIGN_ADD: { klass: TokenClass.Punctuator, name: "+=" },
  ASSIGN_SUB: { klass: TokenClass.Punctuator, name: "-=" },
  ASSIGN_MUL: { klass: TokenClass.Punctuator, name: "*=" },
  ASSIGN_DIV: { klass: TokenClass.Punctuator, name: "/=" },
  ASSIGN_MOD: { klass: TokenClass.Punctuator, name: "%=" },
  COMMA: { klass: TokenClass.Punctuator, name: "," },
  OR: { klass: TokenClass.Punctuator, name: "||" },
  AND: { klass: TokenClass.Punctuator, name: "&&" },
  BIT_OR: { klass: TokenClass.Punctuator, name: "|" },
  BIT_XOR: { klass: TokenClass.Punctuator, name: "^" },
  BIT_AND: { klass: TokenClass.Punctuator, name: "&" },
  SHL: { klass: TokenClass.Punctuator, name: "<<" },
  SHR: { klass: TokenClass.Punctuator, name: ">>" },
  SHR_UNSIGNED: { klass: TokenClass.Punctuator, name: ">>>" },
  ADD: { klass: TokenClass.Punctuator, name: "+" },
  SUB: { klass: TokenClass.Punctuator, name: "-" },
  MUL: { klass: TokenClass.Punctuator, name: "*" },
  DIV: { klass: TokenClass.Punctuator, name: "/" },
  MOD: { klass: TokenClass.Punctuator, name: "%" },
  EQ: { klass: TokenClass.Punctuator, name: "==" },
  NE: { klass: TokenClass.Punctuator, name: "!=" },
  EQ_STRICT: { klass: TokenClass.Punctuator, name: "===" },
  NE_STRICT: { klass: TokenClass.Punctuator, name: "!==" },
  LT: { klass: TokenClass.Punctuator, name: "<" },
  GT: { klass: TokenClass.Punctuator, name: ">" },
  LTE: { klass: TokenClass.Punctuator, name: "<=" },
  GTE: { klass: TokenClass.Punctuator, name: ">=" },
  INSTANCEOF: { klass: TokenClass.Keyword, name: "instanceof" },
  IN: { klass: TokenClass.Keyword, name: "in" },
  NOT: { klass: TokenClass.Punctuator, name: "!" },
  BIT_NOT: { klass: TokenClass.Punctuator, name: "~" },
  AWAIT: { klass: TokenClass.Keyword, name: "await" },
  DELETE: { klass: TokenClass.Keyword, name: "delete" },
  TYPEOF: { klass: TokenClass.Keyword, name: "typeof" },
  VOID: { klass: TokenClass.Keyword, name: "void" },
  BREAK: { klass: TokenClass.Keyword, name: "break" },
  CASE: { klass: TokenClass.Keyword, name: "case" },
  CATCH: { klass: TokenClass.Keyword, name: "catch" },
  CLASS: { klass: TokenClass.Keyword, name: "class" },
  CONTINUE: { klass: TokenClass.Keyword, name: "continue" },
  DEBUGGER: { klass: TokenClass.Keyword, name: "debugger" },
  DEFAULT: { klass: TokenClass.Keyword, name: "default" },
  DO: { klass: TokenClass.Keyword, name: "do" },
  ELSE: { klass: TokenClass.Keyword, name: "else" },
  EXPORT: { klass: TokenClass.Keyword, name: "export" },
  EXTENDS: { klass: TokenClass.Keyword, name: "extends" },
  FINALLY: { klass: TokenClass.Keyword, name: "finally" },
  FOR: { klass: TokenClass.Keyword, name: "for" },
  FUNCTION: { klass: TokenClass.Keyword, name: "function" },
  IF: { klass: TokenClass.Keyword, name: "if" },
  IMPORT: { klass: TokenClass.Keyword, name: "import" },
  LET: { klass: TokenClass.Keyword, name: "let" },
  NEW: { klass: TokenClass.Keyword, name: "new" },
  RETURN: { klass: TokenClass.Keyword, name: "return" },
  SUPER: { klass: TokenClass.Keyword, name: "super" },
  SWITCH: { klass: TokenClass.Keyword, name: "switch" },
  THIS: { klass: TokenClass.Keyword, name: "this" },
  THROW: { klass: TokenClass.Keyword, name: "throw" },
  TRY: { klass: TokenClass.Keyword, name: "try" },
  VAR: { klass: TokenClass.Keyword, name: "var" },
  WHILE: { klass: TokenClass.Keyword, name: "while" },
  WITH: { klass: TokenClass.Keyword, name: "with" },
  NULL: { klass: TokenClass.Keyword, name: "null" },
  TRUE: { klass: TokenClass.Keyword, name: "true" },
  FALSE: { klass: TokenClass.Keyword, name: "false" },
  YIELD: { klass: TokenClass.Keyword, name: "yield" },
  NUMBER: { klass: TokenClass.NumericLiteral, name: "" },
  STRING: { klass: TokenClass.StringLiteral, name: "" },
  REGEXP: { klass: TokenClass.RegularExpression, name: "" },
  IDENTIFIER: { klass: TokenClass.Ident, name: "" },
  CONST: { klass: TokenClass.Keyword, name: "const" },
  TEMPLATE: { klass: TokenClass.TemplateElement, name: "" },
  ILLEGAL: { klass: TokenClass.Illegal, name: "" }
};

var TT = TokenType;
var I = TT.ILLEGAL;
var F = false;
var T = true;

var ONE_CHAR_PUNCTUATOR = [I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, TT.NOT, I, I, I, TT.MOD, TT.BIT_AND, I, TT.LPAREN, TT.RPAREN, TT.MUL, TT.ADD, TT.COMMA, TT.SUB, TT.PERIOD, TT.DIV, I, I, I, I, I, I, I, I, I, I, TT.COLON, TT.SEMICOLON, TT.LT, TT.ASSIGN, TT.GT, TT.CONDITIONAL, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, TT.LBRACK, I, TT.RBRACK, TT.BIT_XOR, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, TT.LBRACE, TT.BIT_OR, TT.RBRACE, TT.BIT_NOT];

var PUNCTUATOR_START = [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, F, F, F, T, T, F, T, T, T, T, T, T, F, T, F, F, F, F, F, F, F, F, F, F, T, T, T, T, T, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, F, T, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, T, T, T, F];

var JsError = exports.JsError = function (_Error) {
  _inherits(JsError, _Error);

  function JsError(index, line, column, msg) {
    _classCallCheck(this, JsError);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(JsError).call(this, msg));

    _this.index = index;
    _this.line = line;
    _this.column = column;
    _this.description = msg;
    _this.message = "[" + line + ":" + column + "]: " + msg;
    return _this;
  }

  return JsError;
}(Error);

function fromCodePoint(cp) {
  if (cp <= 0xFFFF) return String.fromCharCode(cp);
  var cu1 = String.fromCharCode(Math.floor((cp - 0x10000) / 0x400) + 0xD800);
  var cu2 = String.fromCharCode((cp - 0x10000) % 0x400 + 0xDC00);
  return cu1 + cu2;
}

function decodeUtf16(lead, trail) {
  return (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
}

var Tokenizer = function () {
  function Tokenizer(source) {
    _classCallCheck(this, Tokenizer);

    this.source = source;
    this.index = 0;
    this.line = 0;
    this.lineStart = 0;
    this.startIndex = 0;
    this.startLine = 0;
    this.startLineStart = 0;
    this.lastIndex = 0;
    this.lastLine = 0;
    this.lastLineStart = 0;
    this.hasLineTerminatorBeforeNext = false;
    this.tokenIndex = 0;
  }

  _createClass(Tokenizer, [{
    key: "saveLexerState",
    value: function saveLexerState() {
      return {
        source: this.source,
        index: this.index,
        line: this.line,
        lineStart: this.lineStart,
        startIndex: this.startIndex,
        startLine: this.startLine,
        startLineStart: this.startLineStart,
        lastIndex: this.lastIndex,
        lastLine: this.lastLine,
        lastLineStart: this.lastLineStart,
        lookahead: this.lookahead,
        hasLineTerminatorBeforeNext: this.hasLineTerminatorBeforeNext,
        tokenIndex: this.tokenIndex
      };
    }
  }, {
    key: "restoreLexerState",
    value: function restoreLexerState(state) {
      this.source = state.source;
      this.index = state.index;
      this.line = state.line;
      this.lineStart = state.lineStart;
      this.startIndex = state.startIndex;
      this.startLine = state.startLine;
      this.startLineStart = state.startLineStart;
      this.lastIndex = state.lastIndex;
      this.lastLine = state.lastLine;
      this.lastLineStart = state.lastLineStart;
      this.lookahead = state.lookahead;
      this.hasLineTerminatorBeforeNext = state.hasLineTerminatorBeforeNext;
      this.tokenIndex = state.tokenIndex;
    }
  }, {
    key: "createILLEGAL",
    value: function createILLEGAL() {
      this.startIndex = this.index;
      this.startLine = this.line;
      this.startLineStart = this.lineStart;
      return this.index < this.source.length ? this.createError(_errors.ErrorMessages.UNEXPECTED_ILLEGAL_TOKEN, this.source.charAt(this.index)) : this.createError(_errors.ErrorMessages.UNEXPECTED_EOS);
    }
  }, {
    key: "createUnexpected",
    value: function createUnexpected(token) {
      switch (token.type.klass) {
        case TokenClass.Eof:
          return this.createError(_errors.ErrorMessages.UNEXPECTED_EOS);
        case TokenClass.Ident:
          return this.createError(_errors.ErrorMessages.UNEXPECTED_IDENTIFIER);
        case TokenClass.Keyword:
          return this.createError(_errors.ErrorMessages.UNEXPECTED_TOKEN, token.slice.text);
        case TokenClass.NumericLiteral:
          return this.createError(_errors.ErrorMessages.UNEXPECTED_NUMBER);
        case TokenClass.TemplateElement:
          return this.createError(_errors.ErrorMessages.UNEXPECTED_TEMPLATE);
        case TokenClass.Punctuator:
          return this.createError(_errors.ErrorMessages.UNEXPECTED_TOKEN, token.type.name);
        case TokenClass.StringLiteral:
          return this.createError(_errors.ErrorMessages.UNEXPECTED_STRING);
        // the other token classes are RegularExpression and Illegal, but they cannot reach here
      }
    }
  }, {
    key: "createError",
    value: function createError(message) {
      var _arguments = arguments;

      /* istanbul ignore next */
      var msg = message.replace(/\{(\d+)\}/g, function (_, n) {
        return JSON.stringify(_arguments[+n + 1]);
      });
      return new JsError(this.startIndex, this.startLine + 1, this.startIndex - this.startLineStart + 1, msg);
    }
  }, {
    key: "createErrorWithLocation",
    value: function createErrorWithLocation(location, message) {
      var _arguments2 = arguments;

      /* istanbul ignore next */
      var msg = message.replace(/\{(\d+)\}/g, function (_, n) {
        return JSON.stringify(_arguments2[+n + 2]);
      });
      if (location.slice && location.slice.startLocation) {
        location = location.slice.startLocation;
      }
      return new JsError(location.offset, location.line, location.column + 1, msg);
    }
  }, {
    key: "getKeyword",
    value: function getKeyword(id) {
      if (id.length === 1 || id.length > 10) {
        return TokenType.IDENTIFIER;
      }

      /* istanbul ignore next */
      switch (id.length) {
        case 2:
          switch (id.charAt(0)) {
            case "i":
              switch (id.charAt(1)) {
                case "f":
                  return TokenType.IF;
                case "n":
                  return TokenType.IN;
                default:
                  break;
              }
              break;
            case "d":
              if (id.charAt(1) === "o") {
                return TokenType.DO;
              }
              break;
          }
          break;
        case 3:
          switch (id.charAt(0)) {
            case "v":
              if (Tokenizer.cse2(id, "a", "r")) {
                return TokenType.VAR;
              }
              break;
            case "f":
              if (Tokenizer.cse2(id, "o", "r")) {
                return TokenType.FOR;
              }
              break;
            case "n":
              if (Tokenizer.cse2(id, "e", "w")) {
                return TokenType.NEW;
              }
              break;
            case "t":
              if (Tokenizer.cse2(id, "r", "y")) {
                return TokenType.TRY;
              }
              break;
            case "l":
              if (Tokenizer.cse2(id, "e", "t")) {
                return TokenType.LET;
              }
              break;
          }
          break;
        case 4:
          switch (id.charAt(0)) {
            case "t":
              if (Tokenizer.cse3(id, "h", "i", "s")) {
                return TokenType.THIS;
              } else if (Tokenizer.cse3(id, "r", "u", "e")) {
                return TokenType.TRUE;
              }
              break;
            case "n":
              if (Tokenizer.cse3(id, "u", "l", "l")) {
                return TokenType.NULL;
              }
              break;
            case "e":
              if (Tokenizer.cse3(id, "l", "s", "e")) {
                return TokenType.ELSE;
              }
              break;
            case "c":
              if (Tokenizer.cse3(id, "a", "s", "e")) {
                return TokenType.CASE;
              }
              break;
            case "v":
              if (Tokenizer.cse3(id, "o", "i", "d")) {
                return TokenType.VOID;
              }
              break;
            case "w":
              if (Tokenizer.cse3(id, "i", "t", "h")) {
                return TokenType.WITH;
              }
              break;
          }
          break;
        case 5:
          switch (id.charAt(0)) {
            case "a":
              if (this.moduleIsTheGoalSymbol && Tokenizer.cse4(id, "w", "a", "i", "t")) {
                return TokenType.AWAIT;
              }
              break;
            case "w":
              if (Tokenizer.cse4(id, "h", "i", "l", "e")) {
                return TokenType.WHILE;
              }
              break;
            case "b":
              if (Tokenizer.cse4(id, "r", "e", "a", "k")) {
                return TokenType.BREAK;
              }
              break;
            case "f":
              if (Tokenizer.cse4(id, "a", "l", "s", "e")) {
                return TokenType.FALSE;
              }
              break;
            case "c":
              if (Tokenizer.cse4(id, "a", "t", "c", "h")) {
                return TokenType.CATCH;
              } else if (Tokenizer.cse4(id, "o", "n", "s", "t")) {
                return TokenType.CONST;
              } else if (Tokenizer.cse4(id, "l", "a", "s", "s")) {
                return TokenType.CLASS;
              }
              break;
            case "t":
              if (Tokenizer.cse4(id, "h", "r", "o", "w")) {
                return TokenType.THROW;
              }
              break;
            case "y":
              if (Tokenizer.cse4(id, "i", "e", "l", "d")) {
                return TokenType.YIELD;
              }
              break;
            case "s":
              if (Tokenizer.cse4(id, "u", "p", "e", "r")) {
                return TokenType.SUPER;
              }
              break;
          }
          break;
        case 6:
          switch (id.charAt(0)) {
            case "r":
              if (Tokenizer.cse5(id, "e", "t", "u", "r", "n")) {
                return TokenType.RETURN;
              }
              break;
            case "t":
              if (Tokenizer.cse5(id, "y", "p", "e", "o", "f")) {
                return TokenType.TYPEOF;
              }
              break;
            case "d":
              if (Tokenizer.cse5(id, "e", "l", "e", "t", "e")) {
                return TokenType.DELETE;
              }
              break;
            case "s":
              if (Tokenizer.cse5(id, "w", "i", "t", "c", "h")) {
                return TokenType.SWITCH;
              }
              break;
            case "e":
              if (Tokenizer.cse5(id, "x", "p", "o", "r", "t")) {
                return TokenType.EXPORT;
              }
              break;
            case "i":
              if (Tokenizer.cse5(id, "m", "p", "o", "r", "t")) {
                return TokenType.IMPORT;
              }
              break;
          }
          break;
        case 7:
          switch (id.charAt(0)) {
            case "d":
              if (Tokenizer.cse6(id, "e", "f", "a", "u", "l", "t")) {
                return TokenType.DEFAULT;
              }
              break;
            case "f":
              if (Tokenizer.cse6(id, "i", "n", "a", "l", "l", "y")) {
                return TokenType.FINALLY;
              }
              break;
            case "e":
              if (Tokenizer.cse6(id, "x", "t", "e", "n", "d", "s")) {
                return TokenType.EXTENDS;
              }
              break;
          }
          break;
        case 8:
          switch (id.charAt(0)) {
            case "f":
              if (Tokenizer.cse7(id, "u", "n", "c", "t", "i", "o", "n")) {
                return TokenType.FUNCTION;
              }
              break;
            case "c":
              if (Tokenizer.cse7(id, "o", "n", "t", "i", "n", "u", "e")) {
                return TokenType.CONTINUE;
              }
              break;
            case "d":
              if (Tokenizer.cse7(id, "e", "b", "u", "g", "g", "e", "r")) {
                return TokenType.DEBUGGER;
              }
              break;
          }
          break;
        case 10:
          if (id === "instanceof") {
            return TokenType.INSTANCEOF;
          }
          break;
      }
      return TokenType.IDENTIFIER;
    }
  }, {
    key: "skipSingleLineComment",
    value: function skipSingleLineComment(offset) {
      this.index += offset;
      while (this.index < this.source.length) {
        /**
         * @type {Number}
         */
        var chCode = this.source.charCodeAt(this.index);
        this.index++;
        if ((0, _utils.isLineTerminator)(chCode)) {
          this.hasLineTerminatorBeforeNext = true;
          if (chCode === 0xD /* "\r" */ && this.source.charCodeAt(this.index) === 0xA /*"\n" */) {
              this.index++;
            }
          this.lineStart = this.index;
          this.line++;
          return;
        }
      }
    }
  }, {
    key: "skipMultiLineComment",
    value: function skipMultiLineComment() {
      this.index += 2;
      var length = this.source.length;
      var isLineStart = false;
      while (this.index < length) {
        var chCode = this.source.charCodeAt(this.index);
        if (chCode < 0x80) {
          switch (chCode) {
            case 42:
              // "*"
              // Block comment ends with "*/".
              if (this.source.charAt(this.index + 1) === "/") {
                this.index = this.index + 2;
                return isLineStart;
              }
              this.index++;
              break;
            case 10:
              // "\n"
              isLineStart = true;
              this.hasLineTerminatorBeforeNext = true;
              this.index++;
              this.lineStart = this.index;
              this.line++;
              break;
            case 13:
              // "\r":
              isLineStart = true;
              this.hasLineTerminatorBeforeNext = true;
              if (this.source.charAt(this.index + 1) === "\n") {
                this.index++;
              }
              this.index++;
              this.lineStart = this.index;
              this.line++;
              break;
            default:
              this.index++;
          }
        } else if (chCode === 0x2028 || chCode === 0x2029) {
          isLineStart = true;
          this.hasLineTerminatorBeforeNext = true;
          this.index++;
          this.lineStart = this.index;
          this.line++;
        } else {
          this.index++;
        }
      }
      throw this.createILLEGAL();
    }
  }, {
    key: "skipComment",
    value: function skipComment() {
      this.hasLineTerminatorBeforeNext = false;

      var isLineStart = this.index === 0;
      var length = this.source.length;

      while (this.index < length) {
        var chCode = this.source.charCodeAt(this.index);
        if ((0, _utils.isWhiteSpace)(chCode)) {
          this.index++;
        } else if ((0, _utils.isLineTerminator)(chCode)) {
          this.hasLineTerminatorBeforeNext = true;
          this.index++;
          if (chCode === 13 /* "\r" */ && this.source.charAt(this.index) === "\n") {
            this.index++;
          }
          this.lineStart = this.index;
          this.line++;
          isLineStart = true;
        } else if (chCode === 47 /* "/" */) {
            if (this.index + 1 >= length) {
              break;
            }
            chCode = this.source.charCodeAt(this.index + 1);
            if (chCode === 47 /* "/" */) {
                this.skipSingleLineComment(2);
                isLineStart = true;
              } else if (chCode === 42 /* "*" */) {
                isLineStart = this.skipMultiLineComment() || isLineStart;
              } else {
              break;
            }
          } else if (!this.moduleIsTheGoalSymbol && isLineStart && chCode === 45 /* "-" */) {
            if (this.index + 2 >= length) {
              break;
            }
            // U+003E is ">"
            if (this.source.charAt(this.index + 1) === "-" && this.source.charAt(this.index + 2) === ">") {
              // "-->" is a single-line comment
              this.skipSingleLineComment(3);
            } else {
              break;
            }
          } else if (!this.moduleIsTheGoalSymbol && chCode === 60 /* "<" */) {
            if (this.source.slice(this.index + 1, this.index + 4) === "!--") {
              this.skipSingleLineComment(4);
            } else {
              break;
            }
          } else {
          break;
        }
      }
    }
  }, {
    key: "scanHexEscape2",
    value: function scanHexEscape2() {
      if (this.index + 2 > this.source.length) {
        return -1;
      }
      var r1 = (0, _utils.getHexValue)(this.source.charAt(this.index));
      if (r1 === -1) {
        return -1;
      }
      var r2 = (0, _utils.getHexValue)(this.source.charAt(this.index + 1));
      if (r2 === -1) {
        return -1;
      }
      this.index += 2;
      return r1 << 4 | r2;
    }
  }, {
    key: "scanUnicode",
    value: function scanUnicode() {
      if (this.source.charAt(this.index) === "{") {
        //\u{HexDigits}
        var i = this.index + 1;
        var hexDigits = 0,
            ch = void 0;
        while (i < this.source.length) {
          ch = this.source.charAt(i);
          var hex = (0, _utils.getHexValue)(ch);
          if (hex === -1) {
            break;
          }
          hexDigits = hexDigits << 4 | hex;
          if (hexDigits > 0x10FFFF) {
            throw this.createILLEGAL();
          }
          i++;
        }
        if (ch !== "}") {
          throw this.createILLEGAL();
        }
        if (i === this.index + 1) {
          ++this.index; // This is so that the error is 'Unexpected "}"' instead of 'Unexpected "{"'.
          throw this.createILLEGAL();
        }
        this.index = i + 1;
        return hexDigits;
      } else {
        //\uHex4Digits
        if (this.index + 4 > this.source.length) {
          return -1;
        }
        var r1 = (0, _utils.getHexValue)(this.source.charAt(this.index));
        if (r1 === -1) {
          return -1;
        }
        var r2 = (0, _utils.getHexValue)(this.source.charAt(this.index + 1));
        if (r2 === -1) {
          return -1;
        }
        var r3 = (0, _utils.getHexValue)(this.source.charAt(this.index + 2));
        if (r3 === -1) {
          return -1;
        }
        var r4 = (0, _utils.getHexValue)(this.source.charAt(this.index + 3));
        if (r4 === -1) {
          return -1;
        }
        this.index += 4;
        return r1 << 12 | r2 << 8 | r3 << 4 | r4;
      }
    }
  }, {
    key: "getEscapedIdentifier",
    value: function getEscapedIdentifier() {
      var id = "";
      var check = _utils.isIdentifierStart;

      while (this.index < this.source.length) {
        var ch = this.source.charAt(this.index);
        var code = ch.charCodeAt(0);
        var start = this.index;
        ++this.index;
        if (ch === "\\") {
          if (this.index >= this.source.length) {
            throw this.createILLEGAL();
          }
          if (this.source.charAt(this.index) !== "u") {
            throw this.createILLEGAL();
          }
          ++this.index;
          code = this.scanUnicode();
          if (code < 0) {
            throw this.createILLEGAL();
          }
          ch = fromCodePoint(code);
        } else if (0xD800 <= code && code <= 0xDBFF) {
          if (this.index >= this.source.length) {
            throw this.createILLEGAL();
          }
          var lowSurrogateCode = this.source.charCodeAt(this.index);
          ++this.index;
          if (!(0xDC00 <= lowSurrogateCode && lowSurrogateCode <= 0xDFFF)) {
            throw this.createILLEGAL();
          }
          code = decodeUtf16(code, lowSurrogateCode);
          ch = fromCodePoint(code);
        }
        if (!check(code)) {
          if (id.length < 1) {
            throw this.createILLEGAL();
          }
          this.index = start;
          return id;
        }
        check = _utils.isIdentifierPart;
        id += ch;
      }
      return id;
    }
  }, {
    key: "getIdentifier",
    value: function getIdentifier() {
      var start = this.index;
      var l = this.source.length;
      var i = this.index;
      var check = _utils.isIdentifierStart;
      while (i < l) {
        var ch = this.source.charAt(i);
        var code = ch.charCodeAt(0);
        if (ch === "\\" || 0xD800 <= code && code <= 0xDBFF) {
          // Go back and try the hard one.
          this.index = start;
          return this.getEscapedIdentifier();
        }
        if (!check(code)) {
          this.index = i;
          return this.source.slice(start, i);
        }
        ++i;
        check = _utils.isIdentifierPart;
      }
      this.index = i;
      return this.source.slice(start, i);
    }
  }, {
    key: "scanIdentifier",
    value: function scanIdentifier() {
      var startLocation = this.getLocation();
      var start = this.index;

      // Backslash (U+005C) starts an escaped character.
      var id = this.source.charAt(this.index) === "\\" ? this.getEscapedIdentifier() : this.getIdentifier();

      // There is no keyword or literal with only one character.
      // Thus, it must be an identifier.
      var slice = this.getSlice(start, startLocation);
      slice.text = id;

      return { type: this.getKeyword(id), value: id, slice: slice };
    }
  }, {
    key: "getLocation",
    value: function getLocation() {
      return {
        line: this.startLine + 1,
        column: this.startIndex - this.startLineStart,
        offset: this.startIndex
      };
    }
  }, {
    key: "getSlice",
    value: function getSlice(start, startLocation) {
      return { text: this.source.slice(start, this.index), start: start, startLocation: startLocation, end: this.index };
    }
  }, {
    key: "scanPunctuatorHelper",
    value: function scanPunctuatorHelper() {
      var ch1 = this.source.charAt(this.index);

      switch (ch1) {
        // Check for most common single-character punctuators.
        case ".":
          var ch2 = this.source.charAt(this.index + 1);
          if (ch2 !== ".") return TokenType.PERIOD;
          var ch3 = this.source.charAt(this.index + 2);
          if (ch3 !== ".") return TokenType.PERIOD;
          return TokenType.ELLIPSIS;
        case "(":
          return TokenType.LPAREN;
        case ")":
        case ";":
        case ",":
          return ONE_CHAR_PUNCTUATOR[ch1.charCodeAt(0)];
        case "{":
          return TokenType.LBRACE;
        case "}":
        case "[":
        case "]":
        case ":":
        case "?":
        case "~":
          return ONE_CHAR_PUNCTUATOR[ch1.charCodeAt(0)];
        default:
          // "=" (U+003D) marks an assignment or comparison operator.
          if (this.index + 1 < this.source.length && this.source.charAt(this.index + 1) === "=") {
            switch (ch1) {
              case "=":
                if (this.index + 2 < this.source.length && this.source.charAt(this.index + 2) === "=") {
                  return TokenType.EQ_STRICT;
                }
                return TokenType.EQ;
              case "!":
                if (this.index + 2 < this.source.length && this.source.charAt(this.index + 2) === "=") {
                  return TokenType.NE_STRICT;
                }
                return TokenType.NE;
              case "|":
                return TokenType.ASSIGN_BIT_OR;
              case "+":
                return TokenType.ASSIGN_ADD;
              case "-":
                return TokenType.ASSIGN_SUB;
              case "*":
                return TokenType.ASSIGN_MUL;
              case "<":
                return TokenType.LTE;
              case ">":
                return TokenType.GTE;
              case "/":
                return TokenType.ASSIGN_DIV;
              case "%":
                return TokenType.ASSIGN_MOD;
              case "^":
                return TokenType.ASSIGN_BIT_XOR;
              case "&":
                return TokenType.ASSIGN_BIT_AND;
              // istanbul ignore next
              default:
                break; //failed
            }
          }
      }

      if (this.index + 1 < this.source.length) {
        var _ch = this.source.charAt(this.index + 1);
        if (ch1 === _ch) {
          if (this.index + 2 < this.source.length) {
            var _ch2 = this.source.charAt(this.index + 2);
            if (ch1 === ">" && _ch2 === ">") {
              // 4-character punctuator: >>>=
              if (this.index + 3 < this.source.length && this.source.charAt(this.index + 3) === "=") {
                return TokenType.ASSIGN_SHR_UNSIGNED;
              }
              return TokenType.SHR_UNSIGNED;
            }

            if (ch1 === "<" && _ch2 === "=") {
              return TokenType.ASSIGN_SHL;
            }

            if (ch1 === ">" && _ch2 === "=") {
              return TokenType.ASSIGN_SHR;
            }
          }
          // Other 2-character punctuators: ++ -- << >> && ||
          switch (ch1) {
            case "+":
              return TokenType.INC;
            case "-":
              return TokenType.DEC;
            case "<":
              return TokenType.SHL;
            case ">":
              return TokenType.SHR;
            case "&":
              return TokenType.AND;
            case "|":
              return TokenType.OR;
            // istanbul ignore next
            default:
              break; //failed
          }
        } else if (ch1 === "=" && _ch === ">") {
            return TokenType.ARROW;
          }
      }

      return ONE_CHAR_PUNCTUATOR[ch1.charCodeAt(0)];
    }

    // 7.7 Punctuators

  }, {
    key: "scanPunctuator",
    value: function scanPunctuator() {
      var startLocation = this.getLocation();
      var start = this.index;
      var subType = this.scanPunctuatorHelper();
      this.index += subType.name.length;
      return { type: subType, value: subType.name, slice: this.getSlice(start, startLocation) };
    }
  }, {
    key: "scanHexLiteral",
    value: function scanHexLiteral(start, startLocation) {
      var i = this.index;
      while (i < this.source.length) {
        var ch = this.source.charAt(i);
        var hex = (0, _utils.getHexValue)(ch);
        if (hex === -1) {
          break;
        }
        i++;
      }

      if (this.index === i) {
        throw this.createILLEGAL();
      }

      if (i < this.source.length && (0, _utils.isIdentifierStart)(this.source.charCodeAt(i))) {
        throw this.createILLEGAL();
      }

      this.index = i;

      var slice = this.getSlice(start, startLocation);
      return { type: TokenType.NUMBER, value: parseInt(slice.text.substr(2), 16), slice: slice };
    }
  }, {
    key: "scanBinaryLiteral",
    value: function scanBinaryLiteral(start, startLocation) {
      var offset = this.index - start;

      while (this.index < this.source.length) {
        var ch = this.source.charAt(this.index);
        if (ch !== "0" && ch !== "1") {
          break;
        }
        this.index++;
      }

      if (this.index - start <= offset) {
        throw this.createILLEGAL();
      }

      if (this.index < this.source.length && ((0, _utils.isIdentifierStart)(this.source.charCodeAt(this.index)) || (0, _utils.isDecimalDigit)(this.source.charCodeAt(this.index)))) {
        throw this.createILLEGAL();
      }

      return {
        type: TokenType.NUMBER,
        value: parseInt(this.getSlice(start, startLocation).text.substr(offset), 2),
        slice: this.getSlice(start, startLocation),
        octal: false,
        noctal: false
      };
    }
  }, {
    key: "scanOctalLiteral",
    value: function scanOctalLiteral(start, startLocation) {
      while (this.index < this.source.length) {
        var ch = this.source.charAt(this.index);
        if ("0" <= ch && ch <= "7") {
          this.index++;
        } else if ((0, _utils.isIdentifierPart)(ch.charCodeAt(0))) {
          throw this.createILLEGAL();
        } else {
          break;
        }
      }

      if (this.index - start === 2) {
        throw this.createILLEGAL();
      }

      return {
        type: TokenType.NUMBER,
        value: parseInt(this.getSlice(start, startLocation).text.substr(2), 8),
        slice: this.getSlice(start, startLocation),
        octal: false,
        noctal: false
      };
    }
  }, {
    key: "scanLegacyOctalLiteral",
    value: function scanLegacyOctalLiteral(start, startLocation) {
      var isOctal = true;

      while (this.index < this.source.length) {
        var ch = this.source.charAt(this.index);
        if ("0" <= ch && ch <= "7") {
          this.index++;
        } else if (ch === "8" || ch === "9") {
          isOctal = false;
          this.index++;
        } else if ((0, _utils.isIdentifierPart)(ch.charCodeAt(0))) {
          throw this.createILLEGAL();
        } else {
          break;
        }
      }

      var slice = this.getSlice(start, startLocation);
      if (!isOctal) {
        this.eatDecimalLiteralSuffix();
        return {
          type: TokenType.NUMBER,
          slice: slice,
          value: +slice.text,
          octal: true,
          noctal: !isOctal
        };
      }

      return {
        type: TokenType.NUMBER,
        slice: slice,
        value: parseInt(slice.text.substr(1), 8),
        octal: true,
        noctal: !isOctal
      };
    }
  }, {
    key: "scanNumericLiteral",
    value: function scanNumericLiteral() {
      var ch = this.source.charAt(this.index);
      // assert(ch === "." || "0" <= ch && ch <= "9")
      var startLocation = this.getLocation();
      var start = this.index;

      if (ch === "0") {
        this.index++;
        if (this.index < this.source.length) {
          ch = this.source.charAt(this.index);
          if (ch === "x" || ch === "X") {
            this.index++;
            return this.scanHexLiteral(start, startLocation);
          } else if (ch === "b" || ch === "B") {
            this.index++;
            return this.scanBinaryLiteral(start, startLocation);
          } else if (ch === "o" || ch === "O") {
            this.index++;
            return this.scanOctalLiteral(start, startLocation);
          } else if ("0" <= ch && ch <= "9") {
            return this.scanLegacyOctalLiteral(start, startLocation);
          }
        } else {
          var _slice = this.getSlice(start, startLocation);
          return {
            type: TokenType.NUMBER,
            value: +_slice.text,
            slice: _slice,
            octal: false,
            noctal: false
          };
        }
      } else if (ch !== ".") {
        // Must be "1".."9"
        ch = this.source.charAt(this.index);
        while ("0" <= ch && ch <= "9") {
          this.index++;
          if (this.index === this.source.length) {
            var _slice2 = this.getSlice(start, startLocation);
            return {
              type: TokenType.NUMBER,
              value: +_slice2.text,
              slice: _slice2,
              octal: false,
              noctal: false
            };
          }
          ch = this.source.charAt(this.index);
        }
      }

      this.eatDecimalLiteralSuffix();

      if (this.index !== this.source.length && (0, _utils.isIdentifierStart)(this.source.charCodeAt(this.index))) {
        throw this.createILLEGAL();
      }

      var slice = this.getSlice(start, startLocation);
      return {
        type: TokenType.NUMBER,
        value: +slice.text,
        slice: slice,
        octal: false,
        noctal: false
      };
    }
  }, {
    key: "eatDecimalLiteralSuffix",
    value: function eatDecimalLiteralSuffix() {
      var ch = this.source.charAt(this.index);
      if (ch === ".") {
        this.index++;
        if (this.index === this.source.length) {
          return;
        }

        ch = this.source.charAt(this.index);
        while ("0" <= ch && ch <= "9") {
          this.index++;
          if (this.index === this.source.length) {
            return;
          }
          ch = this.source.charAt(this.index);
        }
      }

      // EOF not reached here
      if (ch === "e" || ch === "E") {
        this.index++;
        if (this.index === this.source.length) {
          throw this.createILLEGAL();
        }

        ch = this.source.charAt(this.index);
        if (ch === "+" || ch === "-") {
          this.index++;
          if (this.index === this.source.length) {
            throw this.createILLEGAL();
          }
          ch = this.source.charAt(this.index);
        }

        if ("0" <= ch && ch <= "9") {
          while ("0" <= ch && ch <= "9") {
            this.index++;
            if (this.index === this.source.length) {
              break;
            }
            ch = this.source.charAt(this.index);
          }
        } else {
          throw this.createILLEGAL();
        }
      }
    }
  }, {
    key: "scanStringEscape",
    value: function scanStringEscape(str, octal) {
      this.index++;
      if (this.index === this.source.length) {
        throw this.createILLEGAL();
      }
      var ch = this.source.charAt(this.index);
      if (!(0, _utils.isLineTerminator)(ch.charCodeAt(0))) {
        switch (ch) {
          case "n":
            str += "\n";
            this.index++;
            break;
          case "r":
            str += "\r";
            this.index++;
            break;
          case "t":
            str += "\t";
            this.index++;
            break;
          case "u":
          case "x":
            var unescaped = void 0;
            this.index++;
            if (this.index >= this.source.length) {
              throw this.createILLEGAL();
            }
            unescaped = ch === "u" ? this.scanUnicode() : this.scanHexEscape2();
            if (unescaped < 0) {
              throw this.createILLEGAL();
            }
            str += fromCodePoint(unescaped);
            break;
          case "b":
            str += "\b";
            this.index++;
            break;
          case "f":
            str += "\f";
            this.index++;
            break;
          case "v":
            str += "\u000b";
            this.index++;
            break;
          default:
            if ("0" <= ch && ch <= "7") {
              var octalStart = this.index;
              var octLen = 1;
              // 3 digits are only allowed when string starts
              // with 0, 1, 2, 3
              if ("0" <= ch && ch <= "3") {
                octLen = 0;
              }
              var code = 0;
              while (octLen < 3 && "0" <= ch && ch <= "7") {
                this.index++;
                if (octLen > 0 || ch !== "0") {
                  octal = this.source.slice(octalStart, this.index);
                }
                code *= 8;
                code += ch - "0";
                octLen++;
                if (this.index === this.source.length) {
                  throw this.createILLEGAL();
                }
                ch = this.source.charAt(this.index);
              }
              str += String.fromCharCode(code);
            } else if (ch === "8" || ch === "9") {
              throw this.createILLEGAL();
            } else {
              str += ch;
              this.index++;
            }
        }
      } else {
        this.index++;
        if (ch === "\r" && this.source.charAt(this.index) === "\n") {
          this.index++;
        }
        this.lineStart = this.index;
        this.line++;
      }
      return [str, octal];
    }
    // 7.8.4 String Literals

  }, {
    key: "scanStringLiteral",
    value: function scanStringLiteral() {
      var str = "";

      var quote = this.source.charAt(this.index);
      //  assert((quote === "\"" || quote === """), "String literal must starts with a quote")

      var startLocation = this.getLocation();
      var start = this.index;
      this.index++;

      var octal = null;
      while (this.index < this.source.length) {
        var ch = this.source.charAt(this.index);
        if (ch === quote) {
          this.index++;
          return { type: TokenType.STRING, slice: this.getSlice(start, startLocation), str: str, octal: octal };
        } else if (ch === "\\") {
          var _scanStringEscape = this.scanStringEscape(str, octal);

          var _scanStringEscape2 = _slicedToArray(_scanStringEscape, 2);

          str = _scanStringEscape2[0];
          octal = _scanStringEscape2[1];
        } else if ((0, _utils.isLineTerminator)(ch.charCodeAt(0))) {
          throw this.createILLEGAL();
        } else {
          str += ch;
          this.index++;
        }
      }

      throw this.createILLEGAL();
    }
  }, {
    key: "scanTemplateElement",
    value: function scanTemplateElement() {
      var startLocation = this.getLocation();
      var start = this.index;
      this.index++;
      while (this.index < this.source.length) {
        var ch = this.source.charCodeAt(this.index);
        switch (ch) {
          case 0x60:
            // `
            this.index++;
            return { type: TokenType.TEMPLATE, tail: true, slice: this.getSlice(start, startLocation) };
          case 0x24:
            // $
            if (this.source.charCodeAt(this.index + 1) === 0x7B) {
              // {
              this.index += 2;
              return { type: TokenType.TEMPLATE, tail: false, slice: this.getSlice(start, startLocation) };
            }
            this.index++;
            break;
          case 0x5C:
            // \\
            {
              var octal = this.scanStringEscape("", null)[1];
              if (octal != null) {
                throw this.createILLEGAL();
              }
              break;
            }
          default:
            this.index++;
        }
      }

      throw this.createILLEGAL();
    }
  }, {
    key: "scanRegExp",
    value: function scanRegExp(str) {
      var startLocation = this.getLocation();
      var start = this.index;

      var terminated = false;
      var classMarker = false;
      while (this.index < this.source.length) {
        var ch = this.source.charAt(this.index);
        if (ch === "\\") {
          str += ch;
          this.index++;
          ch = this.source.charAt(this.index);
          // ECMA-262 7.8.5
          if ((0, _utils.isLineTerminator)(ch.charCodeAt(0))) {
            throw this.createError(_errors.ErrorMessages.UNTERMINATED_REGEXP);
          }
          str += ch;
          this.index++;
        } else if ((0, _utils.isLineTerminator)(ch.charCodeAt(0))) {
          throw this.createError(_errors.ErrorMessages.UNTERMINATED_REGEXP);
        } else {
          if (classMarker) {
            if (ch === "]") {
              classMarker = false;
            }
          } else {
            if (ch === "/") {
              terminated = true;
              str += ch;
              this.index++;
              break;
            } else if (ch === "[") {
              classMarker = true;
            }
          }
          str += ch;
          this.index++;
        }
      }

      if (!terminated) {
        throw this.createError(_errors.ErrorMessages.UNTERMINATED_REGEXP);
      }

      while (this.index < this.source.length) {
        var _ch3 = this.source.charAt(this.index);
        if (_ch3 === "\\") {
          throw this.createError(_errors.ErrorMessages.INVALID_REGEXP_FLAGS);
        }
        if (!(0, _utils.isIdentifierPart)(_ch3.charCodeAt(0))) {
          break;
        }
        this.index++;
        str += _ch3;
      }
      return { type: TokenType.REGEXP, value: str, slice: this.getSlice(start, startLocation) };
    }
  }, {
    key: "advance",
    value: function advance() {
      var startLocation = this.getLocation();

      this.lastIndex = this.index;
      this.lastLine = this.line;
      this.lastLineStart = this.lineStart;

      this.skipComment();

      this.startIndex = this.index;
      this.startLine = this.line;
      this.startLineStart = this.lineStart;

      if (this.lastIndex === 0) {
        this.lastIndex = this.index;
        this.lastLine = this.line;
        this.lastLineStart = this.lineStart;
      }

      if (this.index >= this.source.length) {
        return { type: TokenType.EOS, slice: this.getSlice(this.index, startLocation) };
      }

      var charCode = this.source.charCodeAt(this.index);

      if (charCode < 0x80) {
        if (PUNCTUATOR_START[charCode]) {
          return this.scanPunctuator();
        }

        if ((0, _utils.isIdentifierStart)(charCode) || charCode === 0x5C /* backslash (\) */) {
            return this.scanIdentifier();
          }

        // Dot (.) U+002E can also start a floating-point number, hence the need
        // to check the next character.
        if (charCode === 0x2E) {
          if (this.index + 1 < this.source.length && (0, _utils.isDecimalDigit)(this.source.charCodeAt(this.index + 1))) {
            return this.scanNumericLiteral();
          }
          return this.scanPunctuator();
        }

        // String literal starts with single quote (U+0027) or double quote (U+0022).
        if (charCode === 0x27 || charCode === 0x22) {
          return this.scanStringLiteral();
        }

        // Template literal starts with back quote (U+0060)
        if (charCode === 0x60) {
          return this.scanTemplateElement();
        }

        if (0x30 /* "0" */ <= charCode && charCode <= 0x39 /* "9" */) {
            return this.scanNumericLiteral();
          }

        // Slash (/) U+002F can also start a regex.
        throw this.createILLEGAL();
      } else {
        if ((0, _utils.isIdentifierStart)(charCode) || 0xD800 <= charCode && charCode <= 0xDBFF) {
          return this.scanIdentifier();
        }

        throw this.createILLEGAL();
      }
    }
  }, {
    key: "eof",
    value: function eof() {
      return this.lookahead.type === TokenType.EOS;
    }
  }, {
    key: "lex",
    value: function lex() {
      var prevToken = this.lookahead;
      this.lookahead = this.advance();
      this.tokenIndex++;
      return prevToken;
    }
  }], [{
    key: "cse2",
    value: function cse2(id, ch1, ch2) {
      return id.charAt(1) === ch1 && id.charAt(2) === ch2;
    }
  }, {
    key: "cse3",
    value: function cse3(id, ch1, ch2, ch3) {
      return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3;
    }
  }, {
    key: "cse4",
    value: function cse4(id, ch1, ch2, ch3, ch4) {
      return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3 && id.charAt(4) === ch4;
    }
  }, {
    key: "cse5",
    value: function cse5(id, ch1, ch2, ch3, ch4, ch5) {
      return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3 && id.charAt(4) === ch4 && id.charAt(5) === ch5;
    }
  }, {
    key: "cse6",
    value: function cse6(id, ch1, ch2, ch3, ch4, ch5, ch6) {
      return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3 && id.charAt(4) === ch4 && id.charAt(5) === ch5 && id.charAt(6) === ch6;
    }
  }, {
    key: "cse7",
    value: function cse7(id, ch1, ch2, ch3, ch4, ch5, ch6, ch7) {
      return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3 && id.charAt(4) === ch4 && id.charAt(5) === ch5 && id.charAt(6) === ch6 && id.charAt(7) === ch7;
    }
  }]);

  return Tokenizer;
}();

exports.default = Tokenizer;