"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errors = require("./errors");

var _tokenizer = require("./tokenizer");

var _tokenizer2 = _interopRequireDefault(_tokenizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

// Empty parameter list for ArrowExpression
var ARROW_EXPRESSION_PARAMS = "CoverParenthesizedExpressionAndArrowParameterList";

var Precedence = {
  Sequence: 0,
  Yield: 1,
  Assignment: 1,
  Conditional: 2,
  ArrowFunction: 2,
  LogicalOR: 3,
  LogicalAND: 4,
  BitwiseOR: 5,
  BitwiseXOR: 6,
  BitwiseAND: 7,
  Equality: 8,
  Relational: 9,
  BitwiseSHIFT: 10,
  Additive: 11,
  Multiplicative: 12,
  Unary: 13,
  Postfix: 14,
  Call: 15,
  New: 16,
  TaggedTemplate: 17,
  Member: 18,
  Primary: 19
};

var BinaryPrecedence = {
  "||": Precedence.LogicalOR,
  "&&": Precedence.LogicalAND,
  "|": Precedence.BitwiseOR,
  "^": Precedence.BitwiseXOR,
  "&": Precedence.BitwiseAND,
  "==": Precedence.Equality,
  "!=": Precedence.Equality,
  "===": Precedence.Equality,
  "!==": Precedence.Equality,
  "<": Precedence.Relational,
  ">": Precedence.Relational,
  "<=": Precedence.Relational,
  ">=": Precedence.Relational,
  "in": Precedence.Relational,
  "instanceof": Precedence.Relational,
  "<<": Precedence.BitwiseSHIFT,
  ">>": Precedence.BitwiseSHIFT,
  ">>>": Precedence.BitwiseSHIFT,
  "+": Precedence.Additive,
  "-": Precedence.Additive,
  "*": Precedence.Multiplicative,
  "%": Precedence.Multiplicative,
  "/": Precedence.Multiplicative
};

function copyLocation(from, to) {
  if ("loc" in from) {
    to.loc = from.loc;
  }
  return to;
}

function isValidSimpleAssignmentTarget(node) {
  if (node == null) return false;
  switch (node.type) {
    case "IdentifierExpression":
    case "ComputedMemberExpression":
    case "StaticMemberExpression":
      return true;
  }
  return false;
}

function isPrefixOperator(token) {
  switch (token.type) {
    case _tokenizer.TokenType.INC:
    case _tokenizer.TokenType.DEC:
    case _tokenizer.TokenType.ADD:
    case _tokenizer.TokenType.SUB:
    case _tokenizer.TokenType.BIT_NOT:
    case _tokenizer.TokenType.NOT:
    case _tokenizer.TokenType.DELETE:
    case _tokenizer.TokenType.VOID:
    case _tokenizer.TokenType.TYPEOF:
      return true;
  }
  return false;
}

function isUpdateOperator(token) {
  return token.type === _tokenizer.TokenType.INC || token.type === _tokenizer.TokenType.DEC;
}

var Parser = exports.Parser = function (_Tokenizer) {
  _inherits(Parser, _Tokenizer);

  function Parser(source) {
    _classCallCheck(this, Parser);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Parser).call(this, source));

    _this.allowIn = true;
    _this.inFunctionBody = false;
    _this.inParameter = false;
    _this.allowYieldExpression = false;
    _this.module = false;
    _this.moduleIsTheGoalSymbol = false;
    _this.strict = false;

    // Cover grammar
    _this.isBindingElement = true;
    _this.isAssignmentTarget = true;
    _this.firstExprError = null;
    return _this;
  }

  _createClass(Parser, [{
    key: "match",
    value: function match(subType) {
      return this.lookahead.type === subType;
    }
  }, {
    key: "eat",
    value: function eat(tokenType) {
      if (this.lookahead.type === tokenType) {
        return this.lex();
      }
    }
  }, {
    key: "expect",
    value: function expect(tokenType) {
      if (this.lookahead.type === tokenType) {
        return this.lex();
      }
      throw this.createUnexpected(this.lookahead);
    }
  }, {
    key: "matchContextualKeyword",
    value: function matchContextualKeyword(keyword) {
      return this.lookahead.type === _tokenizer.TokenType.IDENTIFIER && this.lookahead.value === keyword;
    }
  }, {
    key: "expectContextualKeyword",
    value: function expectContextualKeyword(keyword) {
      if (this.lookahead.type === _tokenizer.TokenType.IDENTIFIER && this.lookahead.value === keyword) {
        return this.lex();
      } else {
        throw this.createUnexpected(this.lookahead);
      }
    }
  }, {
    key: "eatContextualKeyword",
    value: function eatContextualKeyword(keyword) {
      if (this.lookahead.type === _tokenizer.TokenType.IDENTIFIER && this.lookahead.value === keyword) {
        return this.lex();
      }
    }
  }, {
    key: "consumeSemicolon",
    value: function consumeSemicolon() {
      if (this.eat(_tokenizer.TokenType.SEMICOLON)) return;
      if (this.hasLineTerminatorBeforeNext) return;
      if (!this.eof() && !this.match(_tokenizer.TokenType.RBRACE)) {
        throw this.createUnexpected(this.lookahead);
      }
    }

    // this is a no-op, reserved for future use

  }, {
    key: "markLocation",
    value: function markLocation(node /*, startLocation*/) {
      return node;
    }
  }, {
    key: "parseModule",
    value: function parseModule() {
      this.moduleIsTheGoalSymbol = this.module = this.strict = true;
      this.lookahead = this.advance();

      var startLocation = this.getLocation();

      var _parseBody = this.parseBody();

      var directives = _parseBody.directives;
      var statements = _parseBody.statements;

      if (!this.match(_tokenizer.TokenType.EOS)) {
        throw this.createUnexpected(this.lookahead);
      }
      return this.markLocation({ type: "Module", directives: directives, items: statements }, startLocation);
    }
  }, {
    key: "parseScript",
    value: function parseScript() {
      this.lookahead = this.advance();

      var startLocation = this.getLocation();

      var _parseBody2 = this.parseBody();

      var directives = _parseBody2.directives;
      var statements = _parseBody2.statements;

      if (!this.match(_tokenizer.TokenType.EOS)) {
        throw this.createUnexpected(this.lookahead);
      }
      return this.markLocation({ type: "Script", directives: directives, statements: statements }, startLocation);
    }
  }, {
    key: "parseFunctionBody",
    value: function parseFunctionBody() {
      var startLocation = this.getLocation();

      var oldInFunctionBody = this.inFunctionBody;
      var oldModule = this.module;
      var oldStrict = this.strict;
      this.inFunctionBody = true;
      this.module = false;

      this.expect(_tokenizer.TokenType.LBRACE);
      var body = this.parseBody();
      this.expect(_tokenizer.TokenType.RBRACE);

      this.inFunctionBody = oldInFunctionBody;
      this.module = oldModule;
      this.strict = oldStrict;

      return this.markLocation(body, startLocation);
    }
  }, {
    key: "parseBody",
    value: function parseBody() {
      var directives = [],
          statements = [],
          parsingDirectives = true,
          directiveOctal = null;

      while (true) {
        if (this.eof() || this.match(_tokenizer.TokenType.RBRACE)) break;
        var token = this.lookahead;
        var text = token.slice.text;
        var isStringLiteral = token.type === _tokenizer.TokenType.STRING;
        var isModule = this.module;
        var directiveLocation = this.getLocation();
        var stmt = isModule ? this.parseModuleItem() : this.parseStatementListItem();
        if (parsingDirectives) {
          if (isStringLiteral && stmt.type === "ExpressionStatement" && stmt.expression.type === "LiteralStringExpression") {
            if (!directiveOctal && token.octal) {
              directiveOctal = this.createErrorWithLocation(directiveLocation, "Unexpected legacy octal escape sequence: \\" + token.octal);
            }
            var rawValue = text.slice(1, -1);
            if (rawValue === "use strict") {
              this.strict = true;
            }
            directives.push(this.markLocation({ type: "Directive", rawValue: rawValue }, directiveLocation));
          } else {
            parsingDirectives = false;
            if (directiveOctal && this.strict) {
              throw directiveOctal;
            }
            statements.push(stmt);
          }
        } else {
          statements.push(stmt);
        }
      }
      if (directiveOctal && this.strict) {
        throw directiveOctal;
      }

      return { type: "FunctionBody", directives: directives, statements: statements };
    }
  }, {
    key: "parseImportSpecifier",
    value: function parseImportSpecifier() {
      var startLocation = this.getLocation(),
          name = void 0;
      if (this.match(_tokenizer.TokenType.IDENTIFIER) || this.match(_tokenizer.TokenType.YIELD) || this.match(_tokenizer.TokenType.LET)) {
        name = this.parseIdentifier();
        if (!this.eatContextualKeyword("as")) {
          return this.markLocation({
            type: "ImportSpecifier",
            name: null,
            binding: this.markLocation({ type: "BindingIdentifier", name: name }, startLocation)
          }, startLocation);
        }
      } else if (this.lookahead.type.klass.isIdentifierName) {
        name = this.parseIdentifierName();
        this.expectContextualKeyword("as");
      }

      return this.markLocation({ type: "ImportSpecifier", name: name, binding: this.parseBindingIdentifier() }, startLocation);
    }
  }, {
    key: "parseNameSpaceBinding",
    value: function parseNameSpaceBinding() {
      this.expect(_tokenizer.TokenType.MUL);
      this.expectContextualKeyword("as");
      return this.parseBindingIdentifier();
    }
  }, {
    key: "parseNamedImports",
    value: function parseNamedImports() {
      var result = [];
      this.expect(_tokenizer.TokenType.LBRACE);
      while (!this.eat(_tokenizer.TokenType.RBRACE)) {
        result.push(this.parseImportSpecifier());
        if (!this.eat(_tokenizer.TokenType.COMMA)) {
          this.expect(_tokenizer.TokenType.RBRACE);
          break;
        }
      }
      return result;
    }
  }, {
    key: "parseFromClause",
    value: function parseFromClause() {
      this.expectContextualKeyword("from");
      var value = this.expect(_tokenizer.TokenType.STRING).str;
      return value;
    }
  }, {
    key: "parseImportDeclaration",
    value: function parseImportDeclaration() {
      var startLocation = this.getLocation(),
          defaultBinding = null,
          moduleSpecifier = void 0;
      this.expect(_tokenizer.TokenType.IMPORT);
      switch (this.lookahead.type) {
        case _tokenizer.TokenType.STRING:
          moduleSpecifier = this.lex().str;
          this.consumeSemicolon();
          return this.markLocation({ type: "Import", defaultBinding: null, namedImports: [], moduleSpecifier: moduleSpecifier }, startLocation);
        case _tokenizer.TokenType.IDENTIFIER:
        case _tokenizer.TokenType.YIELD:
        case _tokenizer.TokenType.LET:
          defaultBinding = this.parseBindingIdentifier();
          if (!this.eat(_tokenizer.TokenType.COMMA)) {
            var decl = { type: "Import", defaultBinding: defaultBinding, namedImports: [], moduleSpecifier: this.parseFromClause() };
            this.consumeSemicolon();
            return this.markLocation(decl, startLocation);
          }
          break;
      }
      if (this.match(_tokenizer.TokenType.MUL)) {
        var _decl = {
          type: "ImportNamespace",
          defaultBinding: defaultBinding,
          namespaceBinding: this.parseNameSpaceBinding(),
          moduleSpecifier: this.parseFromClause()
        };
        this.consumeSemicolon();
        return this.markLocation(_decl, startLocation);
      } else if (this.match(_tokenizer.TokenType.LBRACE)) {
        var _decl2 = {
          type: "Import",
          defaultBinding: defaultBinding,
          namedImports: this.parseNamedImports(),
          moduleSpecifier: this.parseFromClause()
        };
        this.consumeSemicolon();
        return this.markLocation(_decl2, startLocation);
      } else {
        throw this.createUnexpected(this.lookahead);
      }
    }
  }, {
    key: "parseExportSpecifier",
    value: function parseExportSpecifier() {
      var startLocation = this.getLocation();
      var name = this.parseIdentifierName();
      if (this.eatContextualKeyword("as")) {
        var exportedName = this.parseIdentifierName();
        return this.markLocation({ type: "ExportSpecifier", name: name, exportedName: exportedName }, startLocation);
      }
      return this.markLocation({ type: "ExportSpecifier", name: null, exportedName: name }, startLocation);
    }
  }, {
    key: "parseExportClause",
    value: function parseExportClause() {
      this.expect(_tokenizer.TokenType.LBRACE);
      var result = [];
      while (!this.eat(_tokenizer.TokenType.RBRACE)) {
        result.push(this.parseExportSpecifier());
        if (!this.eat(_tokenizer.TokenType.COMMA)) {
          this.expect(_tokenizer.TokenType.RBRACE);
          break;
        }
      }
      return result;
    }
  }, {
    key: "parseExportDeclaration",
    value: function parseExportDeclaration() {
      var startLocation = this.getLocation(),
          decl = void 0;
      this.expect(_tokenizer.TokenType.EXPORT);
      switch (this.lookahead.type) {
        case _tokenizer.TokenType.MUL:
          this.lex();
          // export * FromClause ;
          decl = { type: "ExportAllFrom", moduleSpecifier: this.parseFromClause() };
          this.consumeSemicolon();
          break;
        case _tokenizer.TokenType.LBRACE:
          // export ExportClause FromClause ;
          // export ExportClause ;
          var namedExports = this.parseExportClause();
          var moduleSpecifier = null;
          if (this.matchContextualKeyword("from")) {
            moduleSpecifier = this.parseFromClause();
          }
          decl = { type: "ExportFrom", namedExports: namedExports, moduleSpecifier: moduleSpecifier };
          this.consumeSemicolon();
          break;
        case _tokenizer.TokenType.CLASS:
          // export ClassDeclaration
          decl = { type: "Export", declaration: this.parseClass({ isExpr: false, inDefault: false }) };
          break;
        case _tokenizer.TokenType.FUNCTION:
          // export HoistableDeclaration
          decl = { type: "Export", declaration: this.parseFunction({ isExpr: false, inDefault: false, allowGenerator: true }) };
          break;
        case _tokenizer.TokenType.DEFAULT:
          this.lex();
          switch (this.lookahead.type) {
            case _tokenizer.TokenType.FUNCTION:
              // export default HoistableDeclaration[Default]
              decl = {
                type: "ExportDefault",
                body: this.parseFunction({ isExpr: false, inDefault: true, allowGenerator: true })
              };
              break;
            case _tokenizer.TokenType.CLASS:
              // export default ClassDeclaration[Default]
              decl = { type: "ExportDefault", body: this.parseClass({ isExpr: false, inDefault: true }) };
              break;
            default:
              // export default [lookahead ∉ {function, class}] AssignmentExpression[In] ;
              decl = { type: "ExportDefault", body: this.parseAssignmentExpression() };
              this.consumeSemicolon();
              break;
          }
          break;
        case _tokenizer.TokenType.VAR:
        case _tokenizer.TokenType.LET:
        case _tokenizer.TokenType.CONST:
          // export LexicalDeclaration
          decl = { type: "Export", declaration: this.parseVariableDeclaration(true) };
          this.consumeSemicolon();
          break;
        default:
          throw this.createUnexpected(this.lookahead);
      }
      return this.markLocation(decl, startLocation);
    }
  }, {
    key: "parseModuleItem",
    value: function parseModuleItem() {
      switch (this.lookahead.type) {
        case _tokenizer.TokenType.IMPORT:
          return this.parseImportDeclaration();
        case _tokenizer.TokenType.EXPORT:
          return this.parseExportDeclaration();
        default:
          return this.parseStatementListItem();
      }
    }
  }, {
    key: "lookaheadLexicalDeclaration",
    value: function lookaheadLexicalDeclaration() {
      if (this.match(_tokenizer.TokenType.LET) || this.match(_tokenizer.TokenType.CONST)) {
        var lexerState = this.saveLexerState();
        this.lex();
        if (this.match(_tokenizer.TokenType.IDENTIFIER) || this.match(_tokenizer.TokenType.YIELD) || this.match(_tokenizer.TokenType.LET) || this.match(_tokenizer.TokenType.LBRACE) || this.match(_tokenizer.TokenType.LBRACK)) {
          this.restoreLexerState(lexerState);
          return true;
        } else {
          this.restoreLexerState(lexerState);
        }
      }
      return false;
    }
  }, {
    key: "parseStatementListItem",
    value: function parseStatementListItem() {
      if (this.eof()) throw this.createUnexpected(this.lookahead);

      switch (this.lookahead.type) {
        case _tokenizer.TokenType.FUNCTION:
          return this.parseFunction({ isExpr: false, inDefault: false, allowGenerator: true });
        case _tokenizer.TokenType.CLASS:
          return this.parseClass({ isExpr: false, inDefault: false });
        default:
          if (this.lookaheadLexicalDeclaration()) {
            var startLocation = this.getLocation();
            return this.markLocation(this.parseVariableDeclarationStatement(), startLocation);
          } else {
            return this.parseStatement();
          }
      }
    }
  }, {
    key: "parseStatement",
    value: function parseStatement() {
      var startLocation = this.getLocation();
      var stmt = this.isolateCoverGrammar(this.parseStatementHelper);
      return this.markLocation(stmt, startLocation);
    }
  }, {
    key: "parseStatementHelper",
    value: function parseStatementHelper() {
      if (this.eof()) {
        throw this.createUnexpected(this.lookahead);
      }

      switch (this.lookahead.type) {
        case _tokenizer.TokenType.SEMICOLON:
          return this.parseEmptyStatement();
        case _tokenizer.TokenType.LBRACE:
          return this.parseBlockStatement();
        case _tokenizer.TokenType.LPAREN:
          return this.parseExpressionStatement();
        case _tokenizer.TokenType.BREAK:
          return this.parseBreakStatement();
        case _tokenizer.TokenType.CONTINUE:
          return this.parseContinueStatement();
        case _tokenizer.TokenType.DEBUGGER:
          return this.parseDebuggerStatement();
        case _tokenizer.TokenType.DO:
          return this.parseDoWhileStatement();
        case _tokenizer.TokenType.FOR:
          return this.parseForStatement();
        case _tokenizer.TokenType.IF:
          return this.parseIfStatement();
        case _tokenizer.TokenType.RETURN:
          return this.parseReturnStatement();
        case _tokenizer.TokenType.SWITCH:
          return this.parseSwitchStatement();
        case _tokenizer.TokenType.THROW:
          return this.parseThrowStatement();
        case _tokenizer.TokenType.TRY:
          return this.parseTryStatement();
        case _tokenizer.TokenType.VAR:
          return this.parseVariableDeclarationStatement();
        case _tokenizer.TokenType.WHILE:
          return this.parseWhileStatement();
        case _tokenizer.TokenType.WITH:
          return this.parseWithStatement();
        case _tokenizer.TokenType.FUNCTION:
        case _tokenizer.TokenType.CLASS:
          throw this.createUnexpected(this.lookahead);

        default:
          {
            if (this.lookaheadLexicalDeclaration()) {
              throw this.createUnexpected(this.lookahead);
            }
            var expr = this.parseExpression();
            // 12.12 Labelled Statements;
            if (expr.type === "IdentifierExpression" && this.eat(_tokenizer.TokenType.COLON)) {
              var labeledBody = this.match(_tokenizer.TokenType.FUNCTION) ? this.parseFunction({ isExpr: false, inDefault: false, allowGenerator: false }) : this.parseStatement();
              return { type: "LabeledStatement", label: expr.name, body: labeledBody };
            } else {
              this.consumeSemicolon();
              return { type: "ExpressionStatement", expression: expr };
            }
          }
      }
    }
  }, {
    key: "parseEmptyStatement",
    value: function parseEmptyStatement() {
      this.lex();
      return { type: "EmptyStatement" };
    }
  }, {
    key: "parseBlockStatement",
    value: function parseBlockStatement() {
      return { type: "BlockStatement", block: this.parseBlock() };
    }
  }, {
    key: "parseExpressionStatement",
    value: function parseExpressionStatement() {
      var expr = this.parseExpression();
      this.consumeSemicolon();
      return { type: "ExpressionStatement", expression: expr };
    }
  }, {
    key: "parseBreakStatement",
    value: function parseBreakStatement() {
      this.lex();

      // Catch the very common case first: immediately a semicolon (U+003B).
      if (this.eat(_tokenizer.TokenType.SEMICOLON) || this.hasLineTerminatorBeforeNext) {
        return { type: "BreakStatement", label: null };
      }

      var label = null;
      if (this.match(_tokenizer.TokenType.IDENTIFIER) || this.match(_tokenizer.TokenType.YIELD) || this.match(_tokenizer.TokenType.LET)) {
        label = this.parseIdentifier();
      }

      this.consumeSemicolon();

      return { type: "BreakStatement", label: label };
    }
  }, {
    key: "parseContinueStatement",
    value: function parseContinueStatement() {
      this.lex();

      // Catch the very common case first: immediately a semicolon (U+003B).
      if (this.eat(_tokenizer.TokenType.SEMICOLON) || this.hasLineTerminatorBeforeNext) {
        return { type: "ContinueStatement", label: null };
      }

      var label = null;
      if (this.match(_tokenizer.TokenType.IDENTIFIER) || this.match(_tokenizer.TokenType.YIELD) || this.match(_tokenizer.TokenType.LET)) {
        label = this.parseIdentifier();
      }

      this.consumeSemicolon();

      return { type: "ContinueStatement", label: label };
    }
  }, {
    key: "parseDebuggerStatement",
    value: function parseDebuggerStatement() {
      this.lex();
      this.consumeSemicolon();
      return { type: "DebuggerStatement" };
    }
  }, {
    key: "parseDoWhileStatement",
    value: function parseDoWhileStatement() {
      this.lex();
      var body = this.parseStatement();
      this.expect(_tokenizer.TokenType.WHILE);
      this.expect(_tokenizer.TokenType.LPAREN);
      var test = this.parseExpression();
      this.expect(_tokenizer.TokenType.RPAREN);
      this.eat(_tokenizer.TokenType.SEMICOLON);
      return { type: "DoWhileStatement", body: body, test: test };
    }
  }, {
    key: "parseForStatement",
    value: function parseForStatement() {
      this.lex();
      this.expect(_tokenizer.TokenType.LPAREN);
      var test = null;
      var right = null;
      if (this.eat(_tokenizer.TokenType.SEMICOLON)) {
        if (!this.match(_tokenizer.TokenType.SEMICOLON)) {
          test = this.parseExpression();
        }
        this.expect(_tokenizer.TokenType.SEMICOLON);
        if (!this.match(_tokenizer.TokenType.RPAREN)) {
          right = this.parseExpression();
        }
        return { type: "ForStatement", init: null, test: test, update: right, body: this.getIteratorStatementEpilogue() };
      } else {
        var startsWithLet = this.match(_tokenizer.TokenType.LET);
        var isForDecl = this.lookaheadLexicalDeclaration();
        var leftLocation = this.getLocation();
        if (this.match(_tokenizer.TokenType.VAR) || isForDecl) {
          var previousAllowIn = this.allowIn;
          this.allowIn = false;
          var init = this.parseVariableDeclaration(false);
          this.allowIn = previousAllowIn;

          if (init.declarators.length === 1 && (this.match(_tokenizer.TokenType.IN) || this.matchContextualKeyword("of"))) {
            var type = void 0;

            if (this.match(_tokenizer.TokenType.IN)) {
              if (init.declarators[0].init != null) {
                throw this.createError(_errors.ErrorMessages.INVALID_VAR_INIT_FOR_IN);
              }
              type = "ForInStatement";
              this.lex();
              right = this.parseExpression();
            } else {
              if (init.declarators[0].init != null) {
                throw this.createError(_errors.ErrorMessages.INVALID_VAR_INIT_FOR_OF);
              }
              type = "ForOfStatement";
              this.lex();
              right = this.parseAssignmentExpression();
            }

            var body = this.getIteratorStatementEpilogue();

            return { type: type, left: init, right: right, body: body };
          } else {
            this.expect(_tokenizer.TokenType.SEMICOLON);
            if (!this.match(_tokenizer.TokenType.SEMICOLON)) {
              test = this.parseExpression();
            }
            this.expect(_tokenizer.TokenType.SEMICOLON);
            if (!this.match(_tokenizer.TokenType.RPAREN)) {
              right = this.parseExpression();
            }
            return { type: "ForStatement", init: init, test: test, update: right, body: this.getIteratorStatementEpilogue() };
          }
        } else {
          var _previousAllowIn = this.allowIn;
          this.allowIn = false;
          var expr = this.inheritCoverGrammar(this.parseAssignmentExpressionOrBindingElement);
          this.allowIn = _previousAllowIn;

          if ((isValidSimpleAssignmentTarget(expr) || this.isAssignmentTarget) && expr.type !== "AssignmentExpression" && (this.match(_tokenizer.TokenType.IN) || this.matchContextualKeyword("of"))) {
            // the first condition is an `or` because groups are not assignment targets, but `for((a) in 0);` is a program
            if (expr.type === "ObjectExpression" || expr.type === "ArrayExpression") {
              this.firstExprError = null;
            }
            if (startsWithLet && this.matchContextualKeyword("of")) {
              throw this.createError(_errors.ErrorMessages.INVALID_LHS_IN_FOR_OF);
            }
            var _type = this.match(_tokenizer.TokenType.IN) ? "ForInStatement" : "ForOfStatement";

            this.lex();
            right = this.parseExpression();

            return { type: _type, left: this.transformDestructuring(expr), right: right, body: this.getIteratorStatementEpilogue() };
          } else {
            if (this.firstExprError) {
              throw this.firstExprError;
            }
            while (this.eat(_tokenizer.TokenType.COMMA)) {
              var rhs = this.parseAssignmentExpression();
              expr = this.markLocation({ type: "BinaryExpression", left: expr, operator: ",", right: rhs }, leftLocation);
            }
            if (this.match(_tokenizer.TokenType.IN)) {
              throw this.createError(_errors.ErrorMessages.INVALID_LHS_IN_FOR_IN);
            }
            if (this.matchContextualKeyword("of")) {
              throw this.createError(_errors.ErrorMessages.INVALID_LHS_IN_FOR_OF);
            }
            this.expect(_tokenizer.TokenType.SEMICOLON);
            if (!this.match(_tokenizer.TokenType.SEMICOLON)) {
              test = this.parseExpression();
            }
            this.expect(_tokenizer.TokenType.SEMICOLON);
            if (!this.match(_tokenizer.TokenType.RPAREN)) {
              right = this.parseExpression();
            }
            return { type: "ForStatement", init: expr, test: test, update: right, body: this.getIteratorStatementEpilogue() };
          }
        }
      }
    }
  }, {
    key: "getIteratorStatementEpilogue",
    value: function getIteratorStatementEpilogue() {
      this.expect(_tokenizer.TokenType.RPAREN);
      var body = this.parseStatement();
      return body;
    }
  }, {
    key: "parseIfStatementChild",
    value: function parseIfStatementChild() {
      return this.match(_tokenizer.TokenType.FUNCTION) ? this.parseFunction({ isExpr: false, inDefault: false, allowGenerator: false }) : this.parseStatement();
    }
  }, {
    key: "parseIfStatement",
    value: function parseIfStatement() {
      this.lex();
      this.expect(_tokenizer.TokenType.LPAREN);
      var test = this.parseExpression();
      this.expect(_tokenizer.TokenType.RPAREN);
      var consequent = this.parseIfStatementChild();
      var alternate = null;
      if (this.eat(_tokenizer.TokenType.ELSE)) {
        alternate = this.parseIfStatementChild();
      }
      return { type: "IfStatement", test: test, consequent: consequent, alternate: alternate };
    }
  }, {
    key: "parseReturnStatement",
    value: function parseReturnStatement() {
      if (!this.inFunctionBody) {
        throw this.createError(_errors.ErrorMessages.ILLEGAL_RETURN);
      }

      this.lex();

      // Catch the very common case first: immediately a semicolon (U+003B).
      if (this.eat(_tokenizer.TokenType.SEMICOLON) || this.hasLineTerminatorBeforeNext) {
        return { type: "ReturnStatement", expression: null };
      }

      var expression = null;
      if (!this.match(_tokenizer.TokenType.RBRACE) && !this.eof()) {
        expression = this.parseExpression();
      }

      this.consumeSemicolon();
      return { type: "ReturnStatement", expression: expression };
    }
  }, {
    key: "parseSwitchStatement",
    value: function parseSwitchStatement() {
      this.lex();
      this.expect(_tokenizer.TokenType.LPAREN);
      var discriminant = this.parseExpression();
      this.expect(_tokenizer.TokenType.RPAREN);
      this.expect(_tokenizer.TokenType.LBRACE);

      if (this.eat(_tokenizer.TokenType.RBRACE)) {
        return { type: "SwitchStatement", discriminant: discriminant, cases: [] };
      }

      var cases = this.parseSwitchCases();
      if (this.match(_tokenizer.TokenType.DEFAULT)) {
        var defaultCase = this.parseSwitchDefault();
        var postDefaultCases = this.parseSwitchCases();
        if (this.match(_tokenizer.TokenType.DEFAULT)) {
          throw this.createError(_errors.ErrorMessages.MULTIPLE_DEFAULTS_IN_SWITCH);
        }
        this.expect(_tokenizer.TokenType.RBRACE);
        return {
          type: "SwitchStatementWithDefault",
          discriminant: discriminant,
          preDefaultCases: cases,
          defaultCase: defaultCase,
          postDefaultCases: postDefaultCases
        };
      } else {
        this.expect(_tokenizer.TokenType.RBRACE);
        return { type: "SwitchStatement", discriminant: discriminant, cases: cases };
      }
    }
  }, {
    key: "parseSwitchCases",
    value: function parseSwitchCases() {
      var result = [];
      while (!(this.eof() || this.match(_tokenizer.TokenType.RBRACE) || this.match(_tokenizer.TokenType.DEFAULT))) {
        result.push(this.parseSwitchCase());
      }
      return result;
    }
  }, {
    key: "parseSwitchCase",
    value: function parseSwitchCase() {
      var startLocation = this.getLocation();
      this.expect(_tokenizer.TokenType.CASE);
      return this.markLocation({
        type: "SwitchCase",
        test: this.parseExpression(),
        consequent: this.parseSwitchCaseBody()
      }, startLocation);
    }
  }, {
    key: "parseSwitchDefault",
    value: function parseSwitchDefault() {
      var startLocation = this.getLocation();
      this.expect(_tokenizer.TokenType.DEFAULT);
      return this.markLocation({ type: "SwitchDefault", consequent: this.parseSwitchCaseBody() }, startLocation);
    }
  }, {
    key: "parseSwitchCaseBody",
    value: function parseSwitchCaseBody() {
      this.expect(_tokenizer.TokenType.COLON);
      return this.parseStatementListInSwitchCaseBody();
    }
  }, {
    key: "parseStatementListInSwitchCaseBody",
    value: function parseStatementListInSwitchCaseBody() {
      var result = [];
      while (!(this.eof() || this.match(_tokenizer.TokenType.RBRACE) || this.match(_tokenizer.TokenType.DEFAULT) || this.match(_tokenizer.TokenType.CASE))) {
        result.push(this.parseStatementListItem());
      }
      return result;
    }
  }, {
    key: "parseThrowStatement",
    value: function parseThrowStatement() {
      var token = this.lex();
      if (this.hasLineTerminatorBeforeNext) {
        throw this.createErrorWithLocation(token, _errors.ErrorMessages.NEWLINE_AFTER_THROW);
      }
      var expression = this.parseExpression();
      this.consumeSemicolon();
      return { type: "ThrowStatement", expression: expression };
    }
  }, {
    key: "parseTryStatement",
    value: function parseTryStatement() {
      this.lex();
      var body = this.parseBlock();

      if (this.match(_tokenizer.TokenType.CATCH)) {
        var catchClause = this.parseCatchClause();
        if (this.eat(_tokenizer.TokenType.FINALLY)) {
          var finalizer = this.parseBlock();
          return { type: "TryFinallyStatement", body: body, catchClause: catchClause, finalizer: finalizer };
        }
        return { type: "TryCatchStatement", body: body, catchClause: catchClause };
      }

      if (this.eat(_tokenizer.TokenType.FINALLY)) {
        var _finalizer = this.parseBlock();
        return { type: "TryFinallyStatement", body: body, catchClause: null, finalizer: _finalizer };
      } else {
        throw this.createError(_errors.ErrorMessages.NO_CATCH_OR_FINALLY);
      }
    }
  }, {
    key: "parseVariableDeclarationStatement",
    value: function parseVariableDeclarationStatement() {
      var declaration = this.parseVariableDeclaration(true);
      this.consumeSemicolon();
      return { type: "VariableDeclarationStatement", declaration: declaration };
    }
  }, {
    key: "parseWhileStatement",
    value: function parseWhileStatement() {
      this.lex();
      this.expect(_tokenizer.TokenType.LPAREN);
      var test = this.parseExpression();
      var body = this.getIteratorStatementEpilogue();
      return { type: "WhileStatement", test: test, body: body };
    }
  }, {
    key: "parseWithStatement",
    value: function parseWithStatement() {
      this.lex();
      this.expect(_tokenizer.TokenType.LPAREN);
      var object = this.parseExpression();
      this.expect(_tokenizer.TokenType.RPAREN);
      var body = this.parseStatement();
      return { type: "WithStatement", object: object, body: body };
    }
  }, {
    key: "parseCatchClause",
    value: function parseCatchClause() {
      var startLocation = this.getLocation();

      this.lex();
      this.expect(_tokenizer.TokenType.LPAREN);
      if (this.match(_tokenizer.TokenType.RPAREN) || this.match(_tokenizer.TokenType.LPAREN)) {
        throw this.createUnexpected(this.lookahead);
      }
      var binding = this.parseBindingTarget();
      this.expect(_tokenizer.TokenType.RPAREN);
      var body = this.parseBlock();

      return this.markLocation({ type: "CatchClause", binding: binding, body: body }, startLocation);
    }
  }, {
    key: "parseBlock",
    value: function parseBlock() {
      var startLocation = this.getLocation();
      this.expect(_tokenizer.TokenType.LBRACE);
      var body = [];
      while (!this.match(_tokenizer.TokenType.RBRACE)) {
        body.push(this.parseStatementListItem());
      }
      this.expect(_tokenizer.TokenType.RBRACE);
      return this.markLocation({ type: "Block", statements: body }, startLocation);
    }
  }, {
    key: "parseVariableDeclaration",
    value: function parseVariableDeclaration(bindingPatternsMustHaveInit) {
      var startLocation = this.getLocation();
      var token = this.lex();

      // preceded by this.match(TokenSubType.VAR) || this.match(TokenSubType.LET);
      var kind = token.type === _tokenizer.TokenType.VAR ? "var" : token.type === _tokenizer.TokenType.CONST ? "const" : "let";
      var declarators = this.parseVariableDeclaratorList(bindingPatternsMustHaveInit);
      return this.markLocation({ type: "VariableDeclaration", kind: kind, declarators: declarators }, startLocation);
    }
  }, {
    key: "parseVariableDeclaratorList",
    value: function parseVariableDeclaratorList(bindingPatternsMustHaveInit) {
      var result = [];
      do {
        result.push(this.parseVariableDeclarator(bindingPatternsMustHaveInit));
      } while (this.eat(_tokenizer.TokenType.COMMA));
      return result;
    }
  }, {
    key: "parseVariableDeclarator",
    value: function parseVariableDeclarator(bindingPatternsMustHaveInit) {
      var startLocation = this.getLocation();

      if (this.match(_tokenizer.TokenType.LPAREN)) {
        throw this.createUnexpected(this.lookahead);
      }

      var binding = this.parseBindingTarget();
      if (bindingPatternsMustHaveInit && binding.type !== "BindingIdentifier" && !this.match(_tokenizer.TokenType.ASSIGN)) {
        this.expect(_tokenizer.TokenType.ASSIGN);
      }

      var init = null;
      if (this.eat(_tokenizer.TokenType.ASSIGN)) {
        init = this.parseAssignmentExpression();
      }

      return this.markLocation({ type: "VariableDeclarator", binding: binding, init: init }, startLocation);
    }
  }, {
    key: "isolateCoverGrammar",
    value: function isolateCoverGrammar(parser) {
      var oldIsBindingElement = this.isBindingElement,
          oldIsAssignmentTarget = this.isAssignmentTarget,
          oldFirstExprError = this.firstExprError,
          result;
      this.isBindingElement = this.isAssignmentTarget = true;
      this.firstExprError = null;
      result = parser.call(this);
      if (this.firstExprError !== null) {
        throw this.firstExprError;
      }
      this.isBindingElement = oldIsBindingElement;
      this.isAssignmentTarget = oldIsAssignmentTarget;
      this.firstExprError = oldFirstExprError;
      return result;
    }
  }, {
    key: "inheritCoverGrammar",
    value: function inheritCoverGrammar(parser) {
      var oldIsBindingElement = this.isBindingElement,
          oldIsAssignmentTarget = this.isAssignmentTarget,
          oldFirstExprError = this.firstExprError,
          result;
      this.isBindingElement = this.isAssignmentTarget = true;
      this.firstExprError = null;
      result = parser.call(this);
      this.isBindingElement = this.isBindingElement && oldIsBindingElement;
      this.isAssignmentTarget = this.isAssignmentTarget && oldIsAssignmentTarget;
      this.firstExprError = oldFirstExprError || this.firstExprError;
      return result;
    }
  }, {
    key: "parseExpression",
    value: function parseExpression() {
      var startLocation = this.getLocation();

      var left = this.parseAssignmentExpression();
      if (this.match(_tokenizer.TokenType.COMMA)) {
        while (!this.eof()) {
          if (!this.match(_tokenizer.TokenType.COMMA)) break;
          this.lex();
          var right = this.parseAssignmentExpression();
          left = this.markLocation({ type: "BinaryExpression", left: left, operator: ",", right: right }, startLocation);
        }
      }
      return left;
    }
  }, {
    key: "parseArrowExpressionTail",
    value: function parseArrowExpressionTail(head, startLocation) {
      // Convert param list.
      var _head$params = head.params;
      var params = _head$params === undefined ? null : _head$params;
      var _head$rest = head.rest;
      var rest = _head$rest === undefined ? null : _head$rest;

      if (head.type !== ARROW_EXPRESSION_PARAMS) {
        if (head.type === "IdentifierExpression") {
          params = [this.transformDestructuring(head)];
        } else {
          throw this.createUnexpected(this.lookahead);
        }
      }

      var paramsNode = this.markLocation({ type: "FormalParameters", items: params, rest: rest }, startLocation);

      var arrow = this.expect(_tokenizer.TokenType.ARROW);

      var previousYield = this.allowYieldExpression;
      this.allowYieldExpression = false;
      var body = this.match(_tokenizer.TokenType.LBRACE) ? this.parseFunctionBody() : this.parseAssignmentExpression();
      this.allowYieldExpression = previousYield;
      return this.markLocation({ type: "ArrowExpression", params: paramsNode, body: body }, startLocation);
    }
  }, {
    key: "parseAssignmentExpression",
    value: function parseAssignmentExpression() {
      return this.isolateCoverGrammar(this.parseAssignmentExpressionOrBindingElement);
    }
  }, {
    key: "parseAssignmentExpressionOrBindingElement",
    value: function parseAssignmentExpressionOrBindingElement() {
      var startLocation = this.getLocation();

      if (this.allowYieldExpression && this.match(_tokenizer.TokenType.YIELD)) {
        this.isBindingElement = this.isAssignmentTarget = false;
        return this.parseYieldExpression();
      }

      var expr = this.parseConditionalExpression();

      if (!this.hasLineTerminatorBeforeNext && this.match(_tokenizer.TokenType.ARROW)) {
        this.isBindingElement = this.isAssignmentTarget = false;
        this.firstExprError = null;
        return this.parseArrowExpressionTail(expr, startLocation);
      }

      var isAssignmentOperator = false;
      var operator = this.lookahead;
      switch (operator.type) {
        case _tokenizer.TokenType.ASSIGN_BIT_OR:
        case _tokenizer.TokenType.ASSIGN_BIT_XOR:
        case _tokenizer.TokenType.ASSIGN_BIT_AND:
        case _tokenizer.TokenType.ASSIGN_SHL:
        case _tokenizer.TokenType.ASSIGN_SHR:
        case _tokenizer.TokenType.ASSIGN_SHR_UNSIGNED:
        case _tokenizer.TokenType.ASSIGN_ADD:
        case _tokenizer.TokenType.ASSIGN_SUB:
        case _tokenizer.TokenType.ASSIGN_MUL:
        case _tokenizer.TokenType.ASSIGN_DIV:
        case _tokenizer.TokenType.ASSIGN_MOD:
          isAssignmentOperator = true;
          break;
      }
      if (isAssignmentOperator) {
        if (!this.isAssignmentTarget || !isValidSimpleAssignmentTarget(expr)) {
          throw this.createError(_errors.ErrorMessages.INVALID_LHS_IN_ASSIGNMENT);
        }
        expr = this.transformDestructuring(expr);
      } else if (operator.type === _tokenizer.TokenType.ASSIGN) {
        if (!isValidSimpleAssignmentTarget(expr) && !this.isAssignmentTarget) {
          // the first condition is present because groups do not have isAssignmentTarget set, but `(a)=1` is a program.
          throw this.createError(_errors.ErrorMessages.INVALID_LHS_IN_ASSIGNMENT);
        }
        expr = this.transformDestructuring(expr);
      } else {
        return expr;
      }

      this.lex();
      var rhs = this.parseAssignmentExpression();

      this.firstExprError = null;
      var node = void 0;
      if (operator.type === _tokenizer.TokenType.ASSIGN) {
        node = { type: "AssignmentExpression", binding: expr, expression: rhs };
      } else {
        node = { type: "CompoundAssignmentExpression", binding: expr, operator: operator.type.name, expression: rhs };
        this.isBindingElement = this.isAssignmentTarget = false;
      }
      return this.markLocation(node, startLocation);
    }
  }, {
    key: "transformDestructuring",
    value: function transformDestructuring(node) {
      var _this2 = this;

      switch (node.type) {

        case "DataProperty":
          return copyLocation(node, {
            type: "BindingPropertyProperty",
            name: node.name,
            binding: this.transformDestructuringWithDefault(node.expression)
          });
        case "ShorthandProperty":
          return copyLocation(node, {
            type: "BindingPropertyIdentifier",
            binding: copyLocation(node, { type: "BindingIdentifier", name: node.name }),
            init: null
          });

        case "ObjectExpression":
          return copyLocation(node, {
            type: "ObjectBinding",
            properties: node.properties.map(function (x) {
              return _this2.transformDestructuring(x);
            })
          });
        case "ArrayExpression":
          var last = node.elements[node.elements.length - 1];
          if (last != null && last.type === "SpreadElement") {
            return copyLocation(node, {
              type: "ArrayBinding",
              elements: node.elements.slice(0, -1).map(function (e) {
                return e && _this2.transformDestructuringWithDefault(e);
              }),
              restElement: copyLocation(last.expression, this.transformDestructuring(last.expression))
            });
          } else {
            return copyLocation(node, {
              type: "ArrayBinding",
              elements: node.elements.map(function (e) {
                return e && _this2.transformDestructuringWithDefault(e);
              }),
              restElement: null
            });
          }
          /* istanbul ignore next */
          break;
        case "IdentifierExpression":
          return copyLocation(node, { type: "BindingIdentifier", name: node.name });
        case "AssignmentExpression":
          throw this.createError(_errors.ErrorMessages.INVALID_LHS_IN_ASSIGNMENT);

        case "StaticPropertyName":
          return copyLocation(node, { type: "BindingIdentifier", name: node.value });

        case "ComputedMemberExpression":
        case "StaticMemberExpression":
        case "ArrayBinding":
        case "BindingIdentifier":
        case "BindingPropertyIdentifier":
        case "BindingPropertyProperty":
        case "BindingWithDefault":
        case "ObjectBinding":
          return node;
      }

      // istanbul ignore next
      throw new Error("Not reached");
    }
  }, {
    key: "transformDestructuringWithDefault",
    value: function transformDestructuringWithDefault(node) {
      switch (node.type) {
        case "AssignmentExpression":
          return copyLocation(node, {
            type: "BindingWithDefault",
            binding: this.transformDestructuring(node.binding),
            init: node.expression
          });
      }
      return this.transformDestructuring(node);
    }
  }, {
    key: "lookaheadAssignmentExpression",
    value: function lookaheadAssignmentExpression() {
      switch (this.lookahead.type) {
        case _tokenizer.TokenType.ADD:
        case _tokenizer.TokenType.ASSIGN_DIV:
        case _tokenizer.TokenType.CLASS:
        case _tokenizer.TokenType.DEC:
        case _tokenizer.TokenType.DIV:
        case _tokenizer.TokenType.FALSE:
        case _tokenizer.TokenType.FUNCTION:
        case _tokenizer.TokenType.IDENTIFIER:
        case _tokenizer.TokenType.INC:
        case _tokenizer.TokenType.LET:
        case _tokenizer.TokenType.LBRACE:
        case _tokenizer.TokenType.LBRACK:
        case _tokenizer.TokenType.LPAREN:
        case _tokenizer.TokenType.NEW:
        case _tokenizer.TokenType.NOT:
        case _tokenizer.TokenType.NULL:
        case _tokenizer.TokenType.NUMBER:
        case _tokenizer.TokenType.STRING:
        case _tokenizer.TokenType.SUB:
        case _tokenizer.TokenType.SUPER:
        case _tokenizer.TokenType.THIS:
        case _tokenizer.TokenType.TRUE:
        case _tokenizer.TokenType.YIELD:
        case _tokenizer.TokenType.TEMPLATE:
          return true;
      }
      return false;
    }
  }, {
    key: "parseYieldExpression",
    value: function parseYieldExpression() {
      var startLocation = this.getLocation();

      this.lex();
      if (this.hasLineTerminatorBeforeNext) {
        return this.markLocation({ type: "YieldExpression", expression: null }, startLocation);
      }
      var isGenerator = !!this.eat(_tokenizer.TokenType.MUL);
      var expr = null;
      if (isGenerator || this.lookaheadAssignmentExpression()) {
        expr = this.parseAssignmentExpression();
      }
      var type = isGenerator ? "YieldGeneratorExpression" : "YieldExpression";
      return this.markLocation({ type: type, expression: expr }, startLocation);
    }
  }, {
    key: "parseConditionalExpression",
    value: function parseConditionalExpression() {
      var startLocation = this.getLocation();
      var test = this.parseBinaryExpression();
      if (this.firstExprError) return test;
      if (this.eat(_tokenizer.TokenType.CONDITIONAL)) {
        this.isBindingElement = this.isAssignmentTarget = false;
        var previousAllowIn = this.allowIn;
        this.allowIn = true;
        var consequent = this.isolateCoverGrammar(this.parseAssignmentExpression);
        this.allowIn = previousAllowIn;
        this.expect(_tokenizer.TokenType.COLON);
        var alternate = this.isolateCoverGrammar(this.parseAssignmentExpression);
        return this.markLocation({ type: "ConditionalExpression", test: test, consequent: consequent, alternate: alternate }, startLocation);
      }
      return test;
    }
  }, {
    key: "isBinaryOperator",
    value: function isBinaryOperator(type) {
      switch (type) {
        case _tokenizer.TokenType.OR:
        case _tokenizer.TokenType.AND:
        case _tokenizer.TokenType.BIT_OR:
        case _tokenizer.TokenType.BIT_XOR:
        case _tokenizer.TokenType.BIT_AND:
        case _tokenizer.TokenType.EQ:
        case _tokenizer.TokenType.NE:
        case _tokenizer.TokenType.EQ_STRICT:
        case _tokenizer.TokenType.NE_STRICT:
        case _tokenizer.TokenType.LT:
        case _tokenizer.TokenType.GT:
        case _tokenizer.TokenType.LTE:
        case _tokenizer.TokenType.GTE:
        case _tokenizer.TokenType.INSTANCEOF:
        case _tokenizer.TokenType.SHL:
        case _tokenizer.TokenType.SHR:
        case _tokenizer.TokenType.SHR_UNSIGNED:
        case _tokenizer.TokenType.ADD:
        case _tokenizer.TokenType.SUB:
        case _tokenizer.TokenType.MUL:
        case _tokenizer.TokenType.DIV:
        case _tokenizer.TokenType.MOD:
          return true;
        case _tokenizer.TokenType.IN:
          return this.allowIn;
        default:
          return false;
      }
    }
  }, {
    key: "parseBinaryExpression",
    value: function parseBinaryExpression() {
      var _this3 = this;

      var startLocation = this.getLocation();
      var left = this.parseUnaryExpression();
      if (this.firstExprError) {
        return left;
      }

      var operator = this.lookahead.type;

      if (!this.isBinaryOperator(operator)) return left;

      this.isBindingElement = this.isAssignmentTarget = false;

      this.lex();
      var stack = [];
      stack.push({ startLocation: startLocation, left: left, operator: operator, precedence: BinaryPrecedence[operator.name] });
      startLocation = this.getLocation();
      var right = this.isolateCoverGrammar(this.parseUnaryExpression);
      operator = this.lookahead.type;
      while (this.isBinaryOperator(operator)) {
        var precedence = BinaryPrecedence[operator.name];
        // Reduce: make a binary expression from the three topmost entries.
        while (stack.length && precedence <= stack[stack.length - 1].precedence) {
          var stackItem = stack[stack.length - 1];
          var stackOperator = stackItem.operator;
          left = stackItem.left;
          stack.pop();
          startLocation = stackItem.startLocation;
          right = this.markLocation({ type: "BinaryExpression", left: left, operator: stackOperator.name, right: right }, startLocation);
        }

        this.lex();
        stack.push({ startLocation: startLocation, left: right, operator: operator, precedence: precedence });

        startLocation = this.getLocation();
        right = this.isolateCoverGrammar(this.parseUnaryExpression);
        operator = this.lookahead.type;
      }

      // Final reduce to clean-up the stack.
      return stack.reduceRight(function (expr, stackItem) {
        return _this3.markLocation({
          type: "BinaryExpression",
          left: stackItem.left,
          operator: stackItem.operator.name,
          right: expr
        }, stackItem.startLocation);
      }, right);
    }
  }, {
    key: "parseUnaryExpression",
    value: function parseUnaryExpression() {
      if (this.lookahead.type.klass !== _tokenizer.TokenClass.Punctuator && this.lookahead.type.klass !== _tokenizer.TokenClass.Keyword) {
        return this.parseUpdateExpression();
      }
      var startLocation = this.getLocation();
      var operator = this.lookahead;
      if (!isPrefixOperator(operator)) {
        return this.parseUpdateExpression();
      }

      this.lex();
      this.isBindingElement = this.isAssignmentTarget = false;

      var node = void 0;
      if (isUpdateOperator(operator)) {
        var operandStartLocation = this.getLocation();
        var operand = this.isolateCoverGrammar(this.parseUnaryExpression);
        if (operand.type === "IdentifierExpression") {
          operand.type = "BindingIdentifier";
        } else if (!isValidSimpleAssignmentTarget(operand)) {
          throw this.createErrorWithLocation(operandStartLocation, _errors.ErrorMessages.INVALID_UPDATE_OPERAND);
        }
        node = { type: "UpdateExpression", isPrefix: true, operator: operator.value, operand: operand };
      } else {
        var _operand = this.isolateCoverGrammar(this.parseUnaryExpression);
        node = { type: "UnaryExpression", operator: operator.value, operand: _operand };
      }

      return this.markLocation(node, startLocation);
    }
  }, {
    key: "parseUpdateExpression",
    value: function parseUpdateExpression() {
      var startLocation = this.getLocation();

      var operand = this.parseLeftHandSideExpression({ allowCall: true });
      if (this.firstExprError || this.hasLineTerminatorBeforeNext) return operand;

      var operator = this.lookahead;
      if (!isUpdateOperator(operator)) return operand;
      this.lex();
      this.isBindingElement = this.isAssignmentTarget = false;
      if (operand.type === "IdentifierExpression") {
        operand.type = "BindingIdentifier";
      } else if (!isValidSimpleAssignmentTarget(operand)) {
        throw this.createErrorWithLocation(startLocation, _errors.ErrorMessages.INVALID_UPDATE_OPERAND);
      }

      return this.markLocation({ type: "UpdateExpression", isPrefix: false, operator: operator.value, operand: operand }, startLocation);
    }
  }, {
    key: "parseLeftHandSideExpression",
    value: function parseLeftHandSideExpression(_ref) {
      var allowCall = _ref.allowCall;

      var startLocation = this.getLocation();
      var previousAllowIn = this.allowIn;
      this.allowIn = allowCall;

      var expr = void 0,
          token = this.lookahead;

      if (this.eat(_tokenizer.TokenType.SUPER)) {
        this.isBindingElement = false;
        this.isAssignmentTarget = false;
        expr = this.markLocation({ type: "Super" }, startLocation);
        if (this.match(_tokenizer.TokenType.LPAREN)) {
          if (allowCall) {
            expr = this.markLocation({
              type: "CallExpression",
              callee: expr,
              arguments: this.parseArgumentList()
            }, startLocation);
          } else {
            throw this.createUnexpected(token);
          }
        } else if (this.match(_tokenizer.TokenType.LBRACK)) {
          expr = this.markLocation({
            type: "ComputedMemberExpression",
            object: expr,
            expression: this.parseComputedMember()
          }, startLocation);
          this.isAssignmentTarget = true;
        } else if (this.match(_tokenizer.TokenType.PERIOD)) {
          expr = this.markLocation({
            type: "StaticMemberExpression",
            object: expr,
            property: this.parseStaticMember()
          }, startLocation);
          this.isAssignmentTarget = true;
        } else {
          throw this.createUnexpected(token);
        }
      } else if (this.match(_tokenizer.TokenType.NEW)) {
        this.isBindingElement = this.isAssignmentTarget = false;
        expr = this.parseNewExpression();
      } else {
        expr = this.parsePrimaryExpression();
        if (this.firstExprError) {
          return expr;
        }
      }

      while (true) {
        if (allowCall && this.match(_tokenizer.TokenType.LPAREN)) {
          this.isBindingElement = this.isAssignmentTarget = false;
          expr = this.markLocation({
            type: "CallExpression",
            callee: expr,
            arguments: this.parseArgumentList()
          }, startLocation);
        } else if (this.match(_tokenizer.TokenType.LBRACK)) {
          this.isBindingElement = false;
          this.isAssignmentTarget = true;
          expr = this.markLocation({
            type: "ComputedMemberExpression",
            object: expr,
            expression: this.parseComputedMember()
          }, startLocation);
        } else if (this.match(_tokenizer.TokenType.PERIOD)) {
          this.isBindingElement = false;
          this.isAssignmentTarget = true;
          expr = this.markLocation({
            type: "StaticMemberExpression",
            object: expr,
            property: this.parseStaticMember()
          }, startLocation);
        } else if (this.match(_tokenizer.TokenType.TEMPLATE)) {
          this.isBindingElement = this.isAssignmentTarget = false;
          expr = this.markLocation({
            type: "TemplateExpression",
            tag: expr,
            elements: this.parseTemplateElements()
          }, startLocation);
        } else {
          break;
        }
      }

      this.allowIn = previousAllowIn;

      return expr;
    }
  }, {
    key: "parseTemplateElements",
    value: function parseTemplateElements() {
      var startLocation = this.getLocation();
      var token = this.lookahead;
      if (token.tail) {
        this.lex();
        return [this.markLocation({ type: "TemplateElement", rawValue: token.slice.text.slice(1, -1) }, startLocation)];
      }
      var result = [this.markLocation({ type: "TemplateElement", rawValue: this.lex().slice.text.slice(1, -2) }, startLocation)];
      while (true) {
        result.push(this.parseExpression());
        if (!this.match(_tokenizer.TokenType.RBRACE)) {
          throw this.createILLEGAL();
        }
        this.index = this.startIndex;
        this.line = this.startLine;
        this.lineStart = this.startLineStart;
        this.lookahead = this.scanTemplateElement();
        startLocation = this.getLocation();
        token = this.lex();
        if (token.tail) {
          result.push(this.markLocation({ type: "TemplateElement", rawValue: token.slice.text.slice(1, -1) }, startLocation));
          return result;
        } else {
          result.push(this.markLocation({ type: "TemplateElement", rawValue: token.slice.text.slice(1, -2) }, startLocation));
        }
      }
    }
  }, {
    key: "parseStaticMember",
    value: function parseStaticMember() {
      this.lex();
      if (!this.lookahead.type.klass.isIdentifierName) {
        throw this.createUnexpected(this.lookahead);
      } else {
        return this.lex().value;
      }
    }
  }, {
    key: "parseComputedMember",
    value: function parseComputedMember() {
      this.lex();
      var expr = this.parseExpression();
      this.expect(_tokenizer.TokenType.RBRACK);
      return expr;
    }
  }, {
    key: "parseNewExpression",
    value: function parseNewExpression() {
      var _this4 = this;

      var startLocation = this.getLocation();
      this.lex();
      if (this.eat(_tokenizer.TokenType.PERIOD)) {
        var ident = this.expect(_tokenizer.TokenType.IDENTIFIER);
        if (ident.value !== "target") {
          throw this.createUnexpected(ident);
        }
        return this.markLocation({ type: "NewTargetExpression" }, startLocation);
      }
      var callee = this.isolateCoverGrammar(function () {
        return _this4.parseLeftHandSideExpression({ allowCall: false });
      });
      return this.markLocation({
        type: "NewExpression",
        callee: callee,
        arguments: this.match(_tokenizer.TokenType.LPAREN) ? this.parseArgumentList() : []
      }, startLocation);
    }
  }, {
    key: "parsePrimaryExpression",
    value: function parsePrimaryExpression() {
      if (this.match(_tokenizer.TokenType.LPAREN)) {
        return this.parseGroupExpression();
      }

      var startLocation = this.getLocation();

      switch (this.lookahead.type) {
        case _tokenizer.TokenType.IDENTIFIER:
        case _tokenizer.TokenType.YIELD:
        case _tokenizer.TokenType.LET:
          return this.markLocation({ type: "IdentifierExpression", name: this.parseIdentifier() }, startLocation);
        case _tokenizer.TokenType.STRING:
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.parseStringLiteral();
        case _tokenizer.TokenType.NUMBER:
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.parseNumericLiteral();
        case _tokenizer.TokenType.THIS:
          this.lex();
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.markLocation({ type: "ThisExpression" }, startLocation);
        case _tokenizer.TokenType.FUNCTION:
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.markLocation(this.parseFunction({ isExpr: true, inDefault: false, allowGenerator: true }), startLocation);
        case _tokenizer.TokenType.TRUE:
          this.lex();
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.markLocation({ type: "LiteralBooleanExpression", value: true }, startLocation);
        case _tokenizer.TokenType.FALSE:
          this.lex();
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.markLocation({ type: "LiteralBooleanExpression", value: false }, startLocation);
        case _tokenizer.TokenType.NULL:
          this.lex();
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.markLocation({ type: "LiteralNullExpression" }, startLocation);
        case _tokenizer.TokenType.LBRACK:
          return this.parseArrayExpression();
        case _tokenizer.TokenType.LBRACE:
          return this.parseObjectExpression();
        case _tokenizer.TokenType.TEMPLATE:
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.markLocation({ type: "TemplateExpression", tag: null, elements: this.parseTemplateElements() }, startLocation);
        case _tokenizer.TokenType.DIV:
        case _tokenizer.TokenType.ASSIGN_DIV:
          this.isBindingElement = this.isAssignmentTarget = false;
          this.lookahead = this.scanRegExp(this.match(_tokenizer.TokenType.DIV) ? "/" : "/=");
          var token = this.lex();
          var lastSlash = token.value.lastIndexOf("/");
          var pattern = token.value.slice(1, lastSlash);
          var flags = token.value.slice(lastSlash + 1);
          return this.markLocation({ type: "LiteralRegExpExpression", pattern: pattern, flags: flags }, startLocation);
        case _tokenizer.TokenType.CLASS:
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.parseClass({ isExpr: true, inDefault: false });
        default:
          throw this.createUnexpected(this.lookahead);
      }
    }
  }, {
    key: "parseNumericLiteral",
    value: function parseNumericLiteral() {
      var startLocation = this.getLocation();
      var token = this.lex();
      if (token.octal && this.strict) {
        if (token.noctal) {
          throw this.createErrorWithLocation(startLocation, "Unexpected noctal integer literal");
        } else {
          throw this.createErrorWithLocation(startLocation, "Unexpected legacy octal integer literal");
        }
      }
      var node = token.value === 1 / 0 ? { type: "LiteralInfinityExpression" } : { type: "LiteralNumericExpression", value: token.value };
      return this.markLocation(node, startLocation);
    }
  }, {
    key: "parseStringLiteral",
    value: function parseStringLiteral() {
      var startLocation = this.getLocation();
      var token = this.lex();
      if (token.octal != null && this.strict) {
        throw this.createErrorWithLocation(startLocation, "Unexpected legacy octal escape sequence: \\" + token.octal);
      }
      return this.markLocation({ type: "LiteralStringExpression", value: token.str }, startLocation);
    }
  }, {
    key: "parseIdentifierName",
    value: function parseIdentifierName() {
      if (this.lookahead.type.klass.isIdentifierName) {
        return this.lex().value;
      } else {
        throw this.createUnexpected(this.lookahead);
      }
    }
  }, {
    key: "parseBindingIdentifier",
    value: function parseBindingIdentifier() {
      var startLocation = this.getLocation();
      return this.markLocation({ type: "BindingIdentifier", name: this.parseIdentifier() }, startLocation);
    }
  }, {
    key: "parseIdentifier",
    value: function parseIdentifier() {
      var type = this.lookahead.type;
      if (type === _tokenizer.TokenType.IDENTIFIER || type === _tokenizer.TokenType.YIELD && !this.allowYieldExpression || type === _tokenizer.TokenType.LET) {
        return this.lex().value;
      }
      throw this.createUnexpected(this.lookahead);
    }
  }, {
    key: "parseArgumentList",
    value: function parseArgumentList() {
      this.lex();
      var args = this.parseArguments();
      this.expect(_tokenizer.TokenType.RPAREN);
      return args;
    }
  }, {
    key: "parseArguments",
    value: function parseArguments() {
      var result = [];
      while (true) {
        if (this.match(_tokenizer.TokenType.RPAREN) || this.eof()) {
          return result;
        }
        var arg = void 0;
        if (this.eat(_tokenizer.TokenType.ELLIPSIS)) {
          var startLocation = this.getLocation();
          arg = this.markLocation({ type: "SpreadElement", expression: this.parseAssignmentExpression() }, startLocation);
        } else {
          arg = this.parseAssignmentExpression();
        }
        result.push(arg);
        if (!this.eat(_tokenizer.TokenType.COMMA)) break;
      }
      return result;
    }

    // 11.2 Left-Hand-Side Expressions;

  }, {
    key: "ensureArrow",
    value: function ensureArrow() {
      if (this.hasLineTerminatorBeforeNext) {
        throw this.createError(_errors.ErrorMessages.UNEXPECTED_LINE_TERMINATOR);
      }
      if (!this.match(_tokenizer.TokenType.ARROW)) {
        this.expect(_tokenizer.TokenType.ARROW);
      }
    }
  }, {
    key: "parseGroupExpression",
    value: function parseGroupExpression() {
      // At this point, we need to parse 3 things:
      //  1. Group expression
      //  2. Assignment target of assignment expression
      //  3. Parameter list of arrow function
      var rest = null;
      var start = this.expect(_tokenizer.TokenType.LPAREN);
      if (this.eat(_tokenizer.TokenType.RPAREN)) {
        this.ensureArrow();
        this.isBindingElement = this.isAssignmentTarget = false;
        return {
          type: ARROW_EXPRESSION_PARAMS,
          params: [],
          rest: null
        };
      } else if (this.eat(_tokenizer.TokenType.ELLIPSIS)) {
        rest = this.parseBindingIdentifier();
        this.expect(_tokenizer.TokenType.RPAREN);
        this.ensureArrow();
        this.isBindingElement = this.isAssignmentTarget = false;
        return {
          type: ARROW_EXPRESSION_PARAMS,
          params: [],
          rest: rest
        };
      }

      var startLocation = this.getLocation();
      var group = this.inheritCoverGrammar(this.parseAssignmentExpressionOrBindingElement);

      var params = this.isBindingElement ? [this.transformDestructuringWithDefault(group)] : null;

      while (this.eat(_tokenizer.TokenType.COMMA)) {
        this.isAssignmentTarget = false;
        if (this.match(_tokenizer.TokenType.ELLIPSIS)) {
          if (!this.isBindingElement) {
            throw this.createUnexpected(this.lookahead);
          }
          this.lex();
          rest = this.parseBindingIdentifier();
          break;
        }

        if (!group) {
          // Can be only binding elements.
          var binding = this.parseBindingElement();
          params.push(binding);
        } else {
          // Can be either binding element or assignment target.
          var expr = this.inheritCoverGrammar(this.parseAssignmentExpressionOrBindingElement);
          if (!this.isBindingElement) {
            params = null;
          } else {
            params.push(this.transformDestructuringWithDefault(expr));
          }

          if (this.firstExprError) {
            group = null;
          } else {
            group = this.markLocation({
              type: "BinaryExpression",
              left: group,
              operator: ",",
              right: expr
            }, startLocation);
          }
        }
      }

      this.expect(_tokenizer.TokenType.RPAREN);

      if (!this.hasLineTerminatorBeforeNext && this.match(_tokenizer.TokenType.ARROW)) {
        if (!this.isBindingElement) {
          throw this.createErrorWithLocation(start, _errors.ErrorMessages.ILLEGAL_ARROW_FUNCTION_PARAMS);
        }

        this.isBindingElement = false;
        return { type: ARROW_EXPRESSION_PARAMS, params: params, rest: rest };
      } else {
        // Ensure assignment pattern:
        if (rest) {
          this.ensureArrow();
        }
        this.isBindingElement = this.isAssignmentTarget = false;
        return group;
      }
    }
  }, {
    key: "parseArrayExpression",
    value: function parseArrayExpression() {
      var startLocation = this.getLocation();

      this.lex();

      var exprs = [];

      while (true) {
        if (this.match(_tokenizer.TokenType.RBRACK)) {
          break;
        }
        if (this.eat(_tokenizer.TokenType.COMMA)) {
          exprs.push(null);
        } else {
          var elementLocation = this.getLocation();
          var expr = void 0;
          if (this.eat(_tokenizer.TokenType.ELLIPSIS)) {
            // Spread/Rest element
            expr = this.inheritCoverGrammar(this.parseAssignmentExpressionOrBindingElement);
            if (!this.isAssignmentTarget && this.firstExprError) {
              throw this.firstExprError;
            }
            expr = this.markLocation({ type: "SpreadElement", expression: expr }, elementLocation);
            if (!this.match(_tokenizer.TokenType.RBRACK)) {
              this.isBindingElement = this.isAssignmentTarget = false;
            }
          } else {
            expr = this.inheritCoverGrammar(this.parseAssignmentExpressionOrBindingElement);
            if (!this.isAssignmentTarget && this.firstExprError) {
              throw this.firstExprError;
            }
          }
          exprs.push(expr);

          if (!this.match(_tokenizer.TokenType.RBRACK)) {
            this.expect(_tokenizer.TokenType.COMMA);
          }
        }
      }

      this.expect(_tokenizer.TokenType.RBRACK);

      return this.markLocation({ type: "ArrayExpression", elements: exprs }, startLocation);
    }
  }, {
    key: "parseObjectExpression",
    value: function parseObjectExpression() {
      var startLocation = this.getLocation();

      this.lex();

      var properties = [];
      while (!this.match(_tokenizer.TokenType.RBRACE)) {
        var property = this.inheritCoverGrammar(this.parsePropertyDefinition);
        properties.push(property);
        if (!this.match(_tokenizer.TokenType.RBRACE)) {
          this.expect(_tokenizer.TokenType.COMMA);
        }
      }
      this.expect(_tokenizer.TokenType.RBRACE);
      return this.markLocation({ type: "ObjectExpression", properties: properties }, startLocation);
    }
  }, {
    key: "parsePropertyDefinition",
    value: function parsePropertyDefinition() {
      var startLocation = this.getLocation();
      var token = this.lookahead;

      var _parseMethodDefinitio = this.parseMethodDefinition();

      var methodOrKey = _parseMethodDefinitio.methodOrKey;
      var kind = _parseMethodDefinitio.kind;

      switch (kind) {
        case "method":
          this.isBindingElement = this.isAssignmentTarget = false;
          return methodOrKey;
        case "identifier":
          if (this.eat(_tokenizer.TokenType.ASSIGN)) {
            // CoverInitializedName
            var init = this.isolateCoverGrammar(this.parseAssignmentExpression);
            this.firstExprError = this.createErrorWithLocation(startLocation, _errors.ErrorMessages.ILLEGAL_PROPERTY);
            return this.markLocation({
              type: "BindingPropertyIdentifier",
              binding: this.transformDestructuring(methodOrKey),
              init: init
            }, startLocation);
          } else if (!this.match(_tokenizer.TokenType.COLON)) {
            if (token.type !== _tokenizer.TokenType.IDENTIFIER && token.type !== _tokenizer.TokenType.YIELD && token.type !== _tokenizer.TokenType.LET) {
              throw this.createUnexpected(token);
            }
            return this.markLocation({ type: "ShorthandProperty", name: methodOrKey.value }, startLocation);
          }
      }

      // DataProperty
      this.expect(_tokenizer.TokenType.COLON);

      var expr = this.inheritCoverGrammar(this.parseAssignmentExpressionOrBindingElement);
      return this.markLocation({ type: "DataProperty", name: methodOrKey, expression: expr }, startLocation);
    }
  }, {
    key: "parsePropertyName",
    value: function parsePropertyName() {
      // PropertyName[Yield,GeneratorParameter]:
      var token = this.lookahead;
      var startLocation = this.getLocation();

      if (this.eof()) {
        throw this.createUnexpected(token);
      }

      switch (token.type) {
        case _tokenizer.TokenType.STRING:
          return {
            name: this.markLocation({
              type: "StaticPropertyName",
              value: this.parseStringLiteral().value
            }, startLocation),
            binding: null
          };
        case _tokenizer.TokenType.NUMBER:
          var numLiteral = this.parseNumericLiteral();
          return {
            name: this.markLocation({
              type: "StaticPropertyName",
              value: "" + (numLiteral.type === "LiteralInfinityExpression" ? 1 / 0 : numLiteral.value)
            }, startLocation),
            binding: null
          };
        case _tokenizer.TokenType.LBRACK:
          var previousYield = this.allowYieldExpression;
          this.lex();
          var expr = this.parseAssignmentExpression();
          this.expect(_tokenizer.TokenType.RBRACK);
          this.allowYieldExpression = previousYield;
          return { name: this.markLocation({ type: "ComputedPropertyName", expression: expr }, startLocation), binding: null };
      }

      var name = this.parseIdentifierName();
      return {
        name: this.markLocation({ type: "StaticPropertyName", value: name }, startLocation),
        binding: this.markLocation({ type: "BindingIdentifier", name: name }, startLocation)
      };
    }

    /**
     * Test if lookahead can be the beginning of a `PropertyName`.
     * @returns {boolean}
     */

  }, {
    key: "lookaheadPropertyName",
    value: function lookaheadPropertyName() {
      switch (this.lookahead.type) {
        case _tokenizer.TokenType.NUMBER:
        case _tokenizer.TokenType.STRING:
        case _tokenizer.TokenType.LBRACK:
          return true;
        default:
          return this.lookahead.type.klass.isIdentifierName;
      }
    }

    /**
     * Try to parse a method definition.
     *
     * If it turns out to be one of:
     *  * `IdentifierReference`
     *  * `CoverInitializedName` (`IdentifierReference "=" AssignmentExpression`)
     *  * `PropertyName : AssignmentExpression`
     * The parser will stop at the end of the leading `Identifier` or `PropertyName` and return it.
     *
     * @returns {{methodOrKey: (Method|PropertyName), kind: string}}
     */

  }, {
    key: "parseMethodDefinition",
    value: function parseMethodDefinition() {
      var token = this.lookahead;
      var startLocation = this.getLocation();

      var isGenerator = !!this.eat(_tokenizer.TokenType.MUL);

      var _parsePropertyName = this.parsePropertyName();

      var name = _parsePropertyName.name;
      var binding = _parsePropertyName.binding;


      if (!isGenerator && token.type === _tokenizer.TokenType.IDENTIFIER) {
        var _name = token.value;
        if (_name.length === 3) {
          // Property Assignment: Getter and Setter.
          if (_name === "get" && this.lookaheadPropertyName()) {
            var _parsePropertyName2 = this.parsePropertyName();

            _name = _parsePropertyName2.name;

            this.expect(_tokenizer.TokenType.LPAREN);
            this.expect(_tokenizer.TokenType.RPAREN);
            var body = this.parseFunctionBody();
            return {
              methodOrKey: this.markLocation({ type: "Getter", name: _name, body: body }, startLocation),
              kind: "method"
            };
          } else if (_name === "set" && this.lookaheadPropertyName()) {
            var _parsePropertyName3 = this.parsePropertyName();

            _name = _parsePropertyName3.name;

            this.expect(_tokenizer.TokenType.LPAREN);
            var param = this.parseBindingElement();
            this.expect(_tokenizer.TokenType.RPAREN);
            var previousYield = this.allowYieldExpression;
            this.allowYieldExpression = false;
            var _body = this.parseFunctionBody();
            this.allowYieldExpression = previousYield;
            return {
              methodOrKey: this.markLocation({ type: "Setter", name: _name, param: param, body: _body }, startLocation),
              kind: "method"
            };
          }
        }
      }

      if (this.match(_tokenizer.TokenType.LPAREN)) {
        var _previousYield = this.allowYieldExpression;
        this.allowYieldExpression = isGenerator;
        var params = this.parseParams();
        this.allowYieldExpression = isGenerator;
        var _body2 = this.parseFunctionBody();
        this.allowYieldExpression = _previousYield;

        return {
          methodOrKey: this.markLocation({ type: "Method", isGenerator: isGenerator, name: name, params: params, body: _body2 }, startLocation),
          kind: "method"
        };
      }

      if (isGenerator && this.match(_tokenizer.TokenType.COLON)) {
        throw this.createUnexpected(this.lookahead);
      }

      return {
        methodOrKey: name,
        kind: token.type.klass.isIdentifierName ? "identifier" : "property",
        binding: binding
      };
    }
  }, {
    key: "parseClass",
    value: function parseClass(_ref2) {
      var _this5 = this;

      var isExpr = _ref2.isExpr;
      var inDefault = _ref2.inDefault;

      var startLocation = this.getLocation();

      this.lex();
      var name = null;
      var heritage = null;

      if (this.match(_tokenizer.TokenType.IDENTIFIER)) {
        name = this.parseBindingIdentifier();
      } else if (!isExpr) {
        if (inDefault) {
          name = { type: "BindingIdentifier", name: "*default*" };
        } else {
          throw this.createUnexpected(this.lookahead);
        }
      }

      var previousParamYield = this.allowYieldExpression;

      if (isExpr) {
        this.allowYieldExpression = false;
      }

      if (this.eat(_tokenizer.TokenType.EXTENDS)) {
        heritage = this.isolateCoverGrammar(function () {
          return _this5.parseLeftHandSideExpression({ allowCall: true });
        });
      }

      this.expect(_tokenizer.TokenType.LBRACE);
      var elements = [];
      while (!this.eat(_tokenizer.TokenType.RBRACE)) {
        if (this.eat(_tokenizer.TokenType.SEMICOLON)) {
          continue;
        }
        var isStatic = false;

        var _parseMethodDefinitio2 = this.parseMethodDefinition();

        var methodOrKey = _parseMethodDefinitio2.methodOrKey;
        var kind = _parseMethodDefinitio2.kind;

        if (kind === "identifier" && methodOrKey.value === "static") {
          isStatic = true;

          var _parseMethodDefinitio3 = this.parseMethodDefinition();

          methodOrKey = _parseMethodDefinitio3.methodOrKey;
          kind = _parseMethodDefinitio3.kind;
        }
        if (kind === "method") {
          elements.push(copyLocation(methodOrKey, { type: "ClassElement", isStatic: isStatic, method: methodOrKey }));
        } else {
          throw this.createError("Only methods are allowed in classes");
        }
      }
      this.allowYieldExpression = previousParamYield;
      return this.markLocation({ type: isExpr ? "ClassExpression" : "ClassDeclaration", name: name, super: heritage, elements: elements }, startLocation);
    }
  }, {
    key: "parseFunction",
    value: function parseFunction(_ref3) {
      var isExpr = _ref3.isExpr;
      var inDefault = _ref3.inDefault;
      var allowGenerator = _ref3.allowGenerator;

      var startLocation = this.getLocation();

      this.lex();

      var name = null;
      var isGenerator = allowGenerator && !!this.eat(_tokenizer.TokenType.MUL);

      var previousYield = this.allowYieldExpression;

      if (isExpr) {
        this.allowYieldExpression = isGenerator;
      }

      if (!this.match(_tokenizer.TokenType.LPAREN)) {
        name = this.parseBindingIdentifier();
      } else if (!isExpr) {
        if (inDefault) {
          name = { type: "BindingIdentifier", name: "*default*" };
        } else {
          throw this.createUnexpected(this.lookahead);
        }
      }

      this.allowYieldExpression = isGenerator;
      var params = this.parseParams();
      this.allowYieldExpression = isGenerator;
      var body = this.parseFunctionBody();
      this.allowYieldExpression = previousYield;

      var type = isExpr ? "FunctionExpression" : "FunctionDeclaration";
      return this.markLocation({ type: type, isGenerator: isGenerator, name: name, params: params, body: body }, startLocation);
    }
  }, {
    key: "parseArrayBinding",
    value: function parseArrayBinding() {
      var startLocation = this.getLocation();

      this.expect(_tokenizer.TokenType.LBRACK);

      var elements = [],
          restElement = null;

      while (true) {
        if (this.match(_tokenizer.TokenType.RBRACK)) {
          break;
        }
        var el = void 0;

        if (this.eat(_tokenizer.TokenType.COMMA)) {
          el = null;
        } else {
          if (this.eat(_tokenizer.TokenType.ELLIPSIS)) {
            restElement = this.parseBindingTarget();
            break;
          } else {
            el = this.parseBindingElement();
          }
          if (!this.match(_tokenizer.TokenType.RBRACK)) {
            this.expect(_tokenizer.TokenType.COMMA);
          }
        }
        elements.push(el);
      }

      this.expect(_tokenizer.TokenType.RBRACK);

      return this.markLocation({ type: "ArrayBinding", elements: elements, restElement: restElement }, startLocation);
    }
  }, {
    key: "parseBindingProperty",
    value: function parseBindingProperty() {
      var startLocation = this.getLocation();
      var token = this.lookahead;

      var _parsePropertyName4 = this.parsePropertyName();

      var name = _parsePropertyName4.name;
      var binding = _parsePropertyName4.binding;

      if ((token.type === _tokenizer.TokenType.IDENTIFIER || token.type === _tokenizer.TokenType.LET || token.type === _tokenizer.TokenType.YIELD) && name.type === "StaticPropertyName") {
        if (!this.match(_tokenizer.TokenType.COLON)) {
          var defaultValue = null;
          if (this.eat(_tokenizer.TokenType.ASSIGN)) {
            var previousAllowYieldExpression = this.allowYieldExpression;
            var expr = this.parseAssignmentExpression();
            defaultValue = expr;
            this.allowYieldExpression = previousAllowYieldExpression;
          } else if (token.type === _tokenizer.TokenType.YIELD && this.allowYieldExpression) {
            throw this.createUnexpected(token);
          }
          return this.markLocation({
            type: "BindingPropertyIdentifier",
            binding: binding,
            init: defaultValue
          }, startLocation);
        }
      }
      this.expect(_tokenizer.TokenType.COLON);
      binding = this.parseBindingElement();
      return this.markLocation({ type: "BindingPropertyProperty", name: name, binding: binding }, startLocation);
    }
  }, {
    key: "parseObjectBinding",
    value: function parseObjectBinding() {
      var startLocation = this.getLocation();

      this.expect(_tokenizer.TokenType.LBRACE);

      var properties = [];
      while (!this.match(_tokenizer.TokenType.RBRACE)) {
        properties.push(this.parseBindingProperty());
        if (!this.match(_tokenizer.TokenType.RBRACE)) {
          this.expect(_tokenizer.TokenType.COMMA);
        }
      }

      this.expect(_tokenizer.TokenType.RBRACE);

      return this.markLocation({ type: "ObjectBinding", properties: properties }, startLocation);
    }
  }, {
    key: "parseBindingTarget",
    value: function parseBindingTarget() {
      switch (this.lookahead.type) {
        case _tokenizer.TokenType.IDENTIFIER:
        case _tokenizer.TokenType.LET:
        case _tokenizer.TokenType.YIELD:
          return this.parseBindingIdentifier();
        case _tokenizer.TokenType.LBRACK:
          return this.parseArrayBinding();
        case _tokenizer.TokenType.LBRACE:
          return this.parseObjectBinding();
      }
      throw this.createUnexpected(this.lookahead);
    }
  }, {
    key: "parseBindingElement",
    value: function parseBindingElement() {
      var startLocation = this.getLocation();
      var binding = this.parseBindingTarget();

      if (this.eat(_tokenizer.TokenType.ASSIGN)) {
        var previousYieldExpression = this.allowYieldExpression;
        var init = this.parseAssignmentExpression();
        binding = this.markLocation({ type: "BindingWithDefault", binding: binding, init: init }, startLocation);
        this.allowYieldExpression = previousYieldExpression;
      }
      return binding;
    }
  }, {
    key: "parseParam",
    value: function parseParam() {
      var previousInParameter = this.inParameter;
      this.inParameter = true;
      var param = this.parseBindingElement();
      this.inParameter = previousInParameter;
      return param;
    }
  }, {
    key: "parseParams",
    value: function parseParams() {
      var paramsLocation = this.getLocation();

      this.expect(_tokenizer.TokenType.LPAREN);

      var items = [],
          rest = null;
      if (!this.match(_tokenizer.TokenType.RPAREN)) {
        while (!this.eof()) {
          if (this.eat(_tokenizer.TokenType.ELLIPSIS)) {
            rest = this.parseBindingIdentifier();
            break;
          }
          items.push(this.parseParam());
          if (this.match(_tokenizer.TokenType.RPAREN)) break;
          this.expect(_tokenizer.TokenType.COMMA);
        }
      }

      this.expect(_tokenizer.TokenType.RPAREN);

      return this.markLocation({ type: "FormalParameters", items: items, rest: rest }, paramsLocation);
    }
  }]);

  return Parser;
}(_tokenizer2.default);