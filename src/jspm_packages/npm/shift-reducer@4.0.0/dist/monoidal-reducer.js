'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
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

var _shiftAst = require('shift-ast');

var _shiftAst2 = _interopRequireDefault(_shiftAst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MonoidalReducer = function () {
  function MonoidalReducer(monoid) {
    _classCallCheck(this, MonoidalReducer);

    this.identity = monoid.empty();
    var concat = monoid.prototype && monoid.prototype.concat || monoid.concat;
    this.append = function (a, b) {
      return concat.call(a, b);
    };
  }

  _createClass(MonoidalReducer, [{
    key: 'fold',
    value: function fold(list, a) {
      var _this = this;

      return list.reduce(function (memo, x) {
        return _this.append(memo, x);
      }, a == null ? this.identity : a);
    }
  }, {
    key: 'reduceArrayAssignmentTarget',
    value: function reduceArrayAssignmentTarget(node, _ref) {
      var elements = _ref.elements;
      var rest = _ref.rest;

      return this.append(this.fold(elements.filter(function (n) {
        return n !== null;
      })), rest === null ? this.identity : rest);
    }
  }, {
    key: 'reduceArrayBinding',
    value: function reduceArrayBinding(node, _ref2) {
      var elements = _ref2.elements;
      var rest = _ref2.rest;

      return this.append(this.fold(elements.filter(function (n) {
        return n !== null;
      })), rest === null ? this.identity : rest);
    }
  }, {
    key: 'reduceArrayExpression',
    value: function reduceArrayExpression(node, _ref3) {
      var elements = _ref3.elements;

      return this.fold(elements.filter(function (n) {
        return n !== null;
      }));
    }
  }, {
    key: 'reduceArrowExpression',
    value: function reduceArrowExpression(node, _ref4) {
      var params = _ref4.params;
      var body = _ref4.body;

      return this.append(params, body);
    }
  }, {
    key: 'reduceAssignmentExpression',
    value: function reduceAssignmentExpression(node, _ref5) {
      var binding = _ref5.binding;
      var expression = _ref5.expression;

      return this.append(binding, expression);
    }
  }, {
    key: 'reduceAssignmentTargetIdentifier',
    value: function reduceAssignmentTargetIdentifier(node) {
      return this.identity;
    }
  }, {
    key: 'reduceAssignmentTargetPropertyIdentifier',
    value: function reduceAssignmentTargetPropertyIdentifier(node, _ref6) {
      var binding = _ref6.binding;
      var init = _ref6.init;

      return this.append(binding, init === null ? this.identity : init);
    }
  }, {
    key: 'reduceAssignmentTargetPropertyProperty',
    value: function reduceAssignmentTargetPropertyProperty(node, _ref7) {
      var name = _ref7.name;
      var binding = _ref7.binding;

      return this.append(name, binding);
    }
  }, {
    key: 'reduceAssignmentTargetWithDefault',
    value: function reduceAssignmentTargetWithDefault(node, _ref8) {
      var binding = _ref8.binding;
      var init = _ref8.init;

      return this.append(binding, init);
    }
  }, {
    key: 'reduceBinaryExpression',
    value: function reduceBinaryExpression(node, _ref9) {
      var left = _ref9.left;
      var right = _ref9.right;

      return this.append(left, right);
    }
  }, {
    key: 'reduceBindingIdentifier',
    value: function reduceBindingIdentifier(node) {
      return this.identity;
    }
  }, {
    key: 'reduceBindingPropertyIdentifier',
    value: function reduceBindingPropertyIdentifier(node, _ref10) {
      var binding = _ref10.binding;
      var init = _ref10.init;

      return this.append(binding, init === null ? this.identity : init);
    }
  }, {
    key: 'reduceBindingPropertyProperty',
    value: function reduceBindingPropertyProperty(node, _ref11) {
      var name = _ref11.name;
      var binding = _ref11.binding;

      return this.append(name, binding);
    }
  }, {
    key: 'reduceBindingWithDefault',
    value: function reduceBindingWithDefault(node, _ref12) {
      var binding = _ref12.binding;
      var init = _ref12.init;

      return this.append(binding, init);
    }
  }, {
    key: 'reduceBlock',
    value: function reduceBlock(node, _ref13) {
      var statements = _ref13.statements;

      return this.fold(statements);
    }
  }, {
    key: 'reduceBlockStatement',
    value: function reduceBlockStatement(node, _ref14) {
      var block = _ref14.block;

      return block;
    }
  }, {
    key: 'reduceBreakStatement',
    value: function reduceBreakStatement(node) {
      return this.identity;
    }
  }, {
    key: 'reduceCallExpression',
    value: function reduceCallExpression(node, _ref15) {
      var callee = _ref15.callee;
      var _arguments = _ref15.arguments;

      return this.append(callee, this.fold(_arguments));
    }
  }, {
    key: 'reduceCatchClause',
    value: function reduceCatchClause(node, _ref16) {
      var binding = _ref16.binding;
      var body = _ref16.body;

      return this.append(binding, body);
    }
  }, {
    key: 'reduceClassDeclaration',
    value: function reduceClassDeclaration(node, _ref17) {
      var name = _ref17.name;
      var _super = _ref17.super;
      var elements = _ref17.elements;

      return this.fold([name, _super === null ? this.identity : _super, this.fold(elements)]);
    }
  }, {
    key: 'reduceClassElement',
    value: function reduceClassElement(node, _ref18) {
      var method = _ref18.method;

      return method;
    }
  }, {
    key: 'reduceClassExpression',
    value: function reduceClassExpression(node, _ref19) {
      var name = _ref19.name;
      var _super = _ref19.super;
      var elements = _ref19.elements;

      return this.fold([name === null ? this.identity : name, _super === null ? this.identity : _super, this.fold(elements)]);
    }
  }, {
    key: 'reduceCompoundAssignmentExpression',
    value: function reduceCompoundAssignmentExpression(node, _ref20) {
      var binding = _ref20.binding;
      var expression = _ref20.expression;

      return this.append(binding, expression);
    }
  }, {
    key: 'reduceComputedMemberAssignmentTarget',
    value: function reduceComputedMemberAssignmentTarget(node, _ref21) {
      var object = _ref21.object;
      var expression = _ref21.expression;

      return this.append(object, expression);
    }
  }, {
    key: 'reduceComputedMemberExpression',
    value: function reduceComputedMemberExpression(node, _ref22) {
      var object = _ref22.object;
      var expression = _ref22.expression;

      return this.append(object, expression);
    }
  }, {
    key: 'reduceComputedPropertyName',
    value: function reduceComputedPropertyName(node, _ref23) {
      var expression = _ref23.expression;

      return expression;
    }
  }, {
    key: 'reduceConditionalExpression',
    value: function reduceConditionalExpression(node, _ref24) {
      var test = _ref24.test;
      var consequent = _ref24.consequent;
      var alternate = _ref24.alternate;

      return this.fold([test, consequent, alternate]);
    }
  }, {
    key: 'reduceContinueStatement',
    value: function reduceContinueStatement(node) {
      return this.identity;
    }
  }, {
    key: 'reduceDataProperty',
    value: function reduceDataProperty(node, _ref25) {
      var name = _ref25.name;
      var expression = _ref25.expression;

      return this.append(name, expression);
    }
  }, {
    key: 'reduceDebuggerStatement',
    value: function reduceDebuggerStatement(node) {
      return this.identity;
    }
  }, {
    key: 'reduceDirective',
    value: function reduceDirective(node) {
      return this.identity;
    }
  }, {
    key: 'reduceDoWhileStatement',
    value: function reduceDoWhileStatement(node, _ref26) {
      var body = _ref26.body;
      var test = _ref26.test;

      return this.append(body, test);
    }
  }, {
    key: 'reduceEmptyStatement',
    value: function reduceEmptyStatement(node) {
      return this.identity;
    }
  }, {
    key: 'reduceExport',
    value: function reduceExport(node, _ref27) {
      var declaration = _ref27.declaration;

      return declaration;
    }
  }, {
    key: 'reduceExportAllFrom',
    value: function reduceExportAllFrom(node) {
      return this.identity;
    }
  }, {
    key: 'reduceExportDefault',
    value: function reduceExportDefault(node, _ref28) {
      var body = _ref28.body;

      return body;
    }
  }, {
    key: 'reduceExportFrom',
    value: function reduceExportFrom(node, _ref29) {
      var namedExports = _ref29.namedExports;

      return this.fold(namedExports);
    }
  }, {
    key: 'reduceExportFromSpecifier',
    value: function reduceExportFromSpecifier(node) {
      return this.identity;
    }
  }, {
    key: 'reduceExportLocalSpecifier',
    value: function reduceExportLocalSpecifier(node, _ref30) {
      var name = _ref30.name;

      return name;
    }
  }, {
    key: 'reduceExportLocals',
    value: function reduceExportLocals(node, _ref31) {
      var namedExports = _ref31.namedExports;

      return this.fold(namedExports);
    }
  }, {
    key: 'reduceExpressionStatement',
    value: function reduceExpressionStatement(node, _ref32) {
      var expression = _ref32.expression;

      return expression;
    }
  }, {
    key: 'reduceForInStatement',
    value: function reduceForInStatement(node, _ref33) {
      var left = _ref33.left;
      var right = _ref33.right;
      var body = _ref33.body;

      return this.fold([left, right, body]);
    }
  }, {
    key: 'reduceForOfStatement',
    value: function reduceForOfStatement(node, _ref34) {
      var left = _ref34.left;
      var right = _ref34.right;
      var body = _ref34.body;

      return this.fold([left, right, body]);
    }
  }, {
    key: 'reduceForStatement',
    value: function reduceForStatement(node, _ref35) {
      var init = _ref35.init;
      var test = _ref35.test;
      var update = _ref35.update;
      var body = _ref35.body;

      return this.fold([init === null ? this.identity : init, test === null ? this.identity : test, update === null ? this.identity : update, body]);
    }
  }, {
    key: 'reduceFormalParameters',
    value: function reduceFormalParameters(node, _ref36) {
      var items = _ref36.items;
      var rest = _ref36.rest;

      return this.append(this.fold(items), rest === null ? this.identity : rest);
    }
  }, {
    key: 'reduceFunctionBody',
    value: function reduceFunctionBody(node, _ref37) {
      var directives = _ref37.directives;
      var statements = _ref37.statements;

      return this.append(this.fold(directives), this.fold(statements));
    }
  }, {
    key: 'reduceFunctionDeclaration',
    value: function reduceFunctionDeclaration(node, _ref38) {
      var name = _ref38.name;
      var params = _ref38.params;
      var body = _ref38.body;

      return this.fold([name, params, body]);
    }
  }, {
    key: 'reduceFunctionExpression',
    value: function reduceFunctionExpression(node, _ref39) {
      var name = _ref39.name;
      var params = _ref39.params;
      var body = _ref39.body;

      return this.fold([name === null ? this.identity : name, params, body]);
    }
  }, {
    key: 'reduceGetter',
    value: function reduceGetter(node, _ref40) {
      var name = _ref40.name;
      var body = _ref40.body;

      return this.append(name, body);
    }
  }, {
    key: 'reduceIdentifierExpression',
    value: function reduceIdentifierExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceIfStatement',
    value: function reduceIfStatement(node, _ref41) {
      var test = _ref41.test;
      var consequent = _ref41.consequent;
      var alternate = _ref41.alternate;

      return this.fold([test, consequent, alternate === null ? this.identity : alternate]);
    }
  }, {
    key: 'reduceImport',
    value: function reduceImport(node, _ref42) {
      var defaultBinding = _ref42.defaultBinding;
      var namedImports = _ref42.namedImports;

      return this.append(defaultBinding === null ? this.identity : defaultBinding, this.fold(namedImports));
    }
  }, {
    key: 'reduceImportNamespace',
    value: function reduceImportNamespace(node, _ref43) {
      var defaultBinding = _ref43.defaultBinding;
      var namespaceBinding = _ref43.namespaceBinding;

      return this.append(defaultBinding === null ? this.identity : defaultBinding, namespaceBinding);
    }
  }, {
    key: 'reduceImportSpecifier',
    value: function reduceImportSpecifier(node, _ref44) {
      var binding = _ref44.binding;

      return binding;
    }
  }, {
    key: 'reduceLabeledStatement',
    value: function reduceLabeledStatement(node, _ref45) {
      var body = _ref45.body;

      return body;
    }
  }, {
    key: 'reduceLiteralBooleanExpression',
    value: function reduceLiteralBooleanExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceLiteralInfinityExpression',
    value: function reduceLiteralInfinityExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceLiteralNullExpression',
    value: function reduceLiteralNullExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceLiteralNumericExpression',
    value: function reduceLiteralNumericExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceLiteralRegExpExpression',
    value: function reduceLiteralRegExpExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceLiteralStringExpression',
    value: function reduceLiteralStringExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceMethod',
    value: function reduceMethod(node, _ref46) {
      var name = _ref46.name;
      var params = _ref46.params;
      var body = _ref46.body;

      return this.fold([name, params, body]);
    }
  }, {
    key: 'reduceModule',
    value: function reduceModule(node, _ref47) {
      var directives = _ref47.directives;
      var items = _ref47.items;

      return this.append(this.fold(directives), this.fold(items));
    }
  }, {
    key: 'reduceNewExpression',
    value: function reduceNewExpression(node, _ref48) {
      var callee = _ref48.callee;
      var _arguments = _ref48.arguments;

      return this.append(callee, this.fold(_arguments));
    }
  }, {
    key: 'reduceNewTargetExpression',
    value: function reduceNewTargetExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceObjectAssignmentTarget',
    value: function reduceObjectAssignmentTarget(node, _ref49) {
      var properties = _ref49.properties;

      return this.fold(properties);
    }
  }, {
    key: 'reduceObjectBinding',
    value: function reduceObjectBinding(node, _ref50) {
      var properties = _ref50.properties;

      return this.fold(properties);
    }
  }, {
    key: 'reduceObjectExpression',
    value: function reduceObjectExpression(node, _ref51) {
      var properties = _ref51.properties;

      return this.fold(properties);
    }
  }, {
    key: 'reduceReturnStatement',
    value: function reduceReturnStatement(node, _ref52) {
      var expression = _ref52.expression;

      return expression === null ? this.identity : expression;
    }
  }, {
    key: 'reduceScript',
    value: function reduceScript(node, _ref53) {
      var directives = _ref53.directives;
      var statements = _ref53.statements;

      return this.append(this.fold(directives), this.fold(statements));
    }
  }, {
    key: 'reduceSetter',
    value: function reduceSetter(node, _ref54) {
      var name = _ref54.name;
      var param = _ref54.param;
      var body = _ref54.body;

      return this.fold([name, param, body]);
    }
  }, {
    key: 'reduceShorthandProperty',
    value: function reduceShorthandProperty(node, _ref55) {
      var name = _ref55.name;

      return name;
    }
  }, {
    key: 'reduceSpreadElement',
    value: function reduceSpreadElement(node, _ref56) {
      var expression = _ref56.expression;

      return expression;
    }
  }, {
    key: 'reduceStaticMemberAssignmentTarget',
    value: function reduceStaticMemberAssignmentTarget(node, _ref57) {
      var object = _ref57.object;

      return object;
    }
  }, {
    key: 'reduceStaticMemberExpression',
    value: function reduceStaticMemberExpression(node, _ref58) {
      var object = _ref58.object;

      return object;
    }
  }, {
    key: 'reduceStaticPropertyName',
    value: function reduceStaticPropertyName(node) {
      return this.identity;
    }
  }, {
    key: 'reduceSuper',
    value: function reduceSuper(node) {
      return this.identity;
    }
  }, {
    key: 'reduceSwitchCase',
    value: function reduceSwitchCase(node, _ref59) {
      var test = _ref59.test;
      var consequent = _ref59.consequent;

      return this.append(test, this.fold(consequent));
    }
  }, {
    key: 'reduceSwitchDefault',
    value: function reduceSwitchDefault(node, _ref60) {
      var consequent = _ref60.consequent;

      return this.fold(consequent);
    }
  }, {
    key: 'reduceSwitchStatement',
    value: function reduceSwitchStatement(node, _ref61) {
      var discriminant = _ref61.discriminant;
      var cases = _ref61.cases;

      return this.append(discriminant, this.fold(cases));
    }
  }, {
    key: 'reduceSwitchStatementWithDefault',
    value: function reduceSwitchStatementWithDefault(node, _ref62) {
      var discriminant = _ref62.discriminant;
      var preDefaultCases = _ref62.preDefaultCases;
      var defaultCase = _ref62.defaultCase;
      var postDefaultCases = _ref62.postDefaultCases;

      return this.fold([discriminant, this.fold(preDefaultCases), defaultCase, this.fold(postDefaultCases)]);
    }
  }, {
    key: 'reduceTemplateElement',
    value: function reduceTemplateElement(node) {
      return this.identity;
    }
  }, {
    key: 'reduceTemplateExpression',
    value: function reduceTemplateExpression(node, _ref63) {
      var tag = _ref63.tag;
      var elements = _ref63.elements;

      return this.append(tag === null ? this.identity : tag, this.fold(elements));
    }
  }, {
    key: 'reduceThisExpression',
    value: function reduceThisExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceThrowStatement',
    value: function reduceThrowStatement(node, _ref64) {
      var expression = _ref64.expression;

      return expression;
    }
  }, {
    key: 'reduceTryCatchStatement',
    value: function reduceTryCatchStatement(node, _ref65) {
      var body = _ref65.body;
      var catchClause = _ref65.catchClause;

      return this.append(body, catchClause);
    }
  }, {
    key: 'reduceTryFinallyStatement',
    value: function reduceTryFinallyStatement(node, _ref66) {
      var body = _ref66.body;
      var catchClause = _ref66.catchClause;
      var finalizer = _ref66.finalizer;

      return this.fold([body, catchClause === null ? this.identity : catchClause, finalizer]);
    }
  }, {
    key: 'reduceUnaryExpression',
    value: function reduceUnaryExpression(node, _ref67) {
      var operand = _ref67.operand;

      return operand;
    }
  }, {
    key: 'reduceUpdateExpression',
    value: function reduceUpdateExpression(node, _ref68) {
      var operand = _ref68.operand;

      return operand;
    }
  }, {
    key: 'reduceVariableDeclaration',
    value: function reduceVariableDeclaration(node, _ref69) {
      var declarators = _ref69.declarators;

      return this.fold(declarators);
    }
  }, {
    key: 'reduceVariableDeclarationStatement',
    value: function reduceVariableDeclarationStatement(node, _ref70) {
      var declaration = _ref70.declaration;

      return declaration;
    }
  }, {
    key: 'reduceVariableDeclarator',
    value: function reduceVariableDeclarator(node, _ref71) {
      var binding = _ref71.binding;
      var init = _ref71.init;

      return this.append(binding, init === null ? this.identity : init);
    }
  }, {
    key: 'reduceWhileStatement',
    value: function reduceWhileStatement(node, _ref72) {
      var test = _ref72.test;
      var body = _ref72.body;

      return this.append(test, body);
    }
  }, {
    key: 'reduceWithStatement',
    value: function reduceWithStatement(node, _ref73) {
      var object = _ref73.object;
      var body = _ref73.body;

      return this.append(object, body);
    }
  }, {
    key: 'reduceYieldExpression',
    value: function reduceYieldExpression(node, _ref74) {
      var expression = _ref74.expression;

      return expression === null ? this.identity : expression;
    }
  }, {
    key: 'reduceYieldGeneratorExpression',
    value: function reduceYieldGeneratorExpression(node, _ref75) {
      var expression = _ref75.expression;

      return expression;
    }
  }]);

  return MonoidalReducer;
}();

exports.default = MonoidalReducer;