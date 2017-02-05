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

var Shift = _interopRequireWildcard(_shiftAst);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CloneReducer = function () {
  function CloneReducer() {
    _classCallCheck(this, CloneReducer);
  }

  _createClass(CloneReducer, [{
    key: 'reduceArrayAssignmentTarget',
    value: function reduceArrayAssignmentTarget(node, _ref) {
      var elements = _ref.elements;
      var rest = _ref.rest;

      return new Shift.ArrayAssignmentTarget(node, { elements: elements, rest: rest });
    }
  }, {
    key: 'reduceArrayBinding',
    value: function reduceArrayBinding(node, _ref2) {
      var elements = _ref2.elements;
      var rest = _ref2.rest;

      return new Shift.ArrayBinding(node, { elements: elements, rest: rest });
    }
  }, {
    key: 'reduceArrayExpression',
    value: function reduceArrayExpression(node, _ref3) {
      var elements = _ref3.elements;

      return new Shift.ArrayExpression(node, { elements: elements });
    }
  }, {
    key: 'reduceArrowExpression',
    value: function reduceArrowExpression(node, _ref4) {
      var params = _ref4.params;
      var body = _ref4.body;

      return new Shift.ArrowExpression(node, { params: params, body: body });
    }
  }, {
    key: 'reduceAssignmentExpression',
    value: function reduceAssignmentExpression(node, _ref5) {
      var binding = _ref5.binding;
      var expression = _ref5.expression;

      return new Shift.AssignmentExpression(node, { binding: binding, expression: expression });
    }
  }, {
    key: 'reduceAssignmentTargetIdentifier',
    value: function reduceAssignmentTargetIdentifier(node) {
      return new Shift.AssignmentTargetIdentifier(node, { name: node.name });
    }
  }, {
    key: 'reduceAssignmentTargetPropertyIdentifier',
    value: function reduceAssignmentTargetPropertyIdentifier(node, _ref6) {
      var binding = _ref6.binding;
      var init = _ref6.init;

      return new Shift.AssignmentTargetPropertyIdentifier(node, { binding: binding, init: init });
    }
  }, {
    key: 'reduceAssignmentTargetPropertyProperty',
    value: function reduceAssignmentTargetPropertyProperty(node, _ref7) {
      var name = _ref7.name;
      var binding = _ref7.binding;

      return new Shift.AssignmentTargetPropertyProperty(node, { name: name, binding: binding });
    }
  }, {
    key: 'reduceAssignmentTargetWithDefault',
    value: function reduceAssignmentTargetWithDefault(node, _ref8) {
      var binding = _ref8.binding;
      var init = _ref8.init;

      return new Shift.AssignmentTargetWithDefault(node, { binding: binding, init: init });
    }
  }, {
    key: 'reduceBinaryExpression',
    value: function reduceBinaryExpression(node, _ref9) {
      var left = _ref9.left;
      var right = _ref9.right;

      return new Shift.BinaryExpression(node, { left: left, operator: node.operator, right: right });
    }
  }, {
    key: 'reduceBindingIdentifier',
    value: function reduceBindingIdentifier(node) {
      return new Shift.BindingIdentifier(node, { name: node.name });
    }
  }, {
    key: 'reduceBindingPropertyIdentifier',
    value: function reduceBindingPropertyIdentifier(node, _ref10) {
      var binding = _ref10.binding;
      var init = _ref10.init;

      return new Shift.BindingPropertyIdentifier(node, { binding: binding, init: init });
    }
  }, {
    key: 'reduceBindingPropertyProperty',
    value: function reduceBindingPropertyProperty(node, _ref11) {
      var name = _ref11.name;
      var binding = _ref11.binding;

      return new Shift.BindingPropertyProperty(node, { name: name, binding: binding });
    }
  }, {
    key: 'reduceBindingWithDefault',
    value: function reduceBindingWithDefault(node, _ref12) {
      var binding = _ref12.binding;
      var init = _ref12.init;

      return new Shift.BindingWithDefault(node, { binding: binding, init: init });
    }
  }, {
    key: 'reduceBlock',
    value: function reduceBlock(node, _ref13) {
      var statements = _ref13.statements;

      return new Shift.Block(node, { statements: statements });
    }
  }, {
    key: 'reduceBlockStatement',
    value: function reduceBlockStatement(node, _ref14) {
      var block = _ref14.block;

      return new Shift.BlockStatement(node, { block: block });
    }
  }, {
    key: 'reduceBreakStatement',
    value: function reduceBreakStatement(node) {
      return new Shift.BreakStatement(node, { label: node.label });
    }
  }, {
    key: 'reduceCallExpression',
    value: function reduceCallExpression(node, _ref15) {
      var callee = _ref15.callee;
      var _arguments = _ref15.arguments;

      return new Shift.CallExpression(node, { callee: callee, arguments: _arguments });
    }
  }, {
    key: 'reduceCatchClause',
    value: function reduceCatchClause(node, _ref16) {
      var binding = _ref16.binding;
      var body = _ref16.body;

      return new Shift.CatchClause(node, { binding: binding, body: body });
    }
  }, {
    key: 'reduceClassDeclaration',
    value: function reduceClassDeclaration(node, _ref17) {
      var name = _ref17.name;
      var _super = _ref17.super;
      var elements = _ref17.elements;

      return new Shift.ClassDeclaration(node, { name: name, super: _super, elements: elements });
    }
  }, {
    key: 'reduceClassElement',
    value: function reduceClassElement(node, _ref18) {
      var method = _ref18.method;

      return new Shift.ClassElement(node, { isStatic: node.isStatic, method: method });
    }
  }, {
    key: 'reduceClassExpression',
    value: function reduceClassExpression(node, _ref19) {
      var name = _ref19.name;
      var _super = _ref19.super;
      var elements = _ref19.elements;

      return new Shift.ClassExpression(node, { name: name, super: _super, elements: elements });
    }
  }, {
    key: 'reduceCompoundAssignmentExpression',
    value: function reduceCompoundAssignmentExpression(node, _ref20) {
      var binding = _ref20.binding;
      var expression = _ref20.expression;

      return new Shift.CompoundAssignmentExpression(node, { binding: binding, operator: node.operator, expression: expression });
    }
  }, {
    key: 'reduceComputedMemberAssignmentTarget',
    value: function reduceComputedMemberAssignmentTarget(node, _ref21) {
      var object = _ref21.object;
      var expression = _ref21.expression;

      return new Shift.ComputedMemberAssignmentTarget(node, { object: object, expression: expression });
    }
  }, {
    key: 'reduceComputedMemberExpression',
    value: function reduceComputedMemberExpression(node, _ref22) {
      var object = _ref22.object;
      var expression = _ref22.expression;

      return new Shift.ComputedMemberExpression(node, { object: object, expression: expression });
    }
  }, {
    key: 'reduceComputedPropertyName',
    value: function reduceComputedPropertyName(node, _ref23) {
      var expression = _ref23.expression;

      return new Shift.ComputedPropertyName(node, { expression: expression });
    }
  }, {
    key: 'reduceConditionalExpression',
    value: function reduceConditionalExpression(node, _ref24) {
      var test = _ref24.test;
      var consequent = _ref24.consequent;
      var alternate = _ref24.alternate;

      return new Shift.ConditionalExpression(node, { test: test, consequent: consequent, alternate: alternate });
    }
  }, {
    key: 'reduceContinueStatement',
    value: function reduceContinueStatement(node) {
      return new Shift.ContinueStatement(node, { label: node.label });
    }
  }, {
    key: 'reduceDataProperty',
    value: function reduceDataProperty(node, _ref25) {
      var name = _ref25.name;
      var expression = _ref25.expression;

      return new Shift.DataProperty(node, { name: name, expression: expression });
    }
  }, {
    key: 'reduceDebuggerStatement',
    value: function reduceDebuggerStatement(node) {
      return new Shift.DebuggerStatement();
    }
  }, {
    key: 'reduceDirective',
    value: function reduceDirective(node) {
      return new Shift.Directive(node, { rawValue: node.rawValue });
    }
  }, {
    key: 'reduceDoWhileStatement',
    value: function reduceDoWhileStatement(node, _ref26) {
      var body = _ref26.body;
      var test = _ref26.test;

      return new Shift.DoWhileStatement(node, { body: body, test: test });
    }
  }, {
    key: 'reduceEmptyStatement',
    value: function reduceEmptyStatement(node) {
      return new Shift.EmptyStatement();
    }
  }, {
    key: 'reduceExport',
    value: function reduceExport(node, _ref27) {
      var declaration = _ref27.declaration;

      return new Shift.Export(node, { declaration: declaration });
    }
  }, {
    key: 'reduceExportAllFrom',
    value: function reduceExportAllFrom(node) {
      return new Shift.ExportAllFrom(node, { moduleSpecifier: node.moduleSpecifier });
    }
  }, {
    key: 'reduceExportDefault',
    value: function reduceExportDefault(node, _ref28) {
      var body = _ref28.body;

      return new Shift.ExportDefault(node, { body: body });
    }
  }, {
    key: 'reduceExportFrom',
    value: function reduceExportFrom(node, _ref29) {
      var namedExports = _ref29.namedExports;

      return new Shift.ExportFrom(node, { namedExports: namedExports, moduleSpecifier: node.moduleSpecifier });
    }
  }, {
    key: 'reduceExportFromSpecifier',
    value: function reduceExportFromSpecifier(node) {
      return new Shift.ExportFromSpecifier(node, { name: node.name, exportedName: node.exportedName });
    }
  }, {
    key: 'reduceExportLocalSpecifier',
    value: function reduceExportLocalSpecifier(node, _ref30) {
      var name = _ref30.name;

      return new Shift.ExportLocalSpecifier(node, { name: name, exportedName: node.exportedName });
    }
  }, {
    key: 'reduceExportLocals',
    value: function reduceExportLocals(node, _ref31) {
      var namedExports = _ref31.namedExports;

      return new Shift.ExportLocals(node, { namedExports: namedExports });
    }
  }, {
    key: 'reduceExpressionStatement',
    value: function reduceExpressionStatement(node, _ref32) {
      var expression = _ref32.expression;

      return new Shift.ExpressionStatement(node, { expression: expression });
    }
  }, {
    key: 'reduceForInStatement',
    value: function reduceForInStatement(node, _ref33) {
      var left = _ref33.left;
      var right = _ref33.right;
      var body = _ref33.body;

      return new Shift.ForInStatement(node, { left: left, right: right, body: body });
    }
  }, {
    key: 'reduceForOfStatement',
    value: function reduceForOfStatement(node, _ref34) {
      var left = _ref34.left;
      var right = _ref34.right;
      var body = _ref34.body;

      return new Shift.ForOfStatement(node, { left: left, right: right, body: body });
    }
  }, {
    key: 'reduceForStatement',
    value: function reduceForStatement(node, _ref35) {
      var init = _ref35.init;
      var test = _ref35.test;
      var update = _ref35.update;
      var body = _ref35.body;

      return new Shift.ForStatement(node, { init: init, test: test, update: update, body: body });
    }
  }, {
    key: 'reduceFormalParameters',
    value: function reduceFormalParameters(node, _ref36) {
      var items = _ref36.items;
      var rest = _ref36.rest;

      return new Shift.FormalParameters(node, { items: items, rest: rest });
    }
  }, {
    key: 'reduceFunctionBody',
    value: function reduceFunctionBody(node, _ref37) {
      var directives = _ref37.directives;
      var statements = _ref37.statements;

      return new Shift.FunctionBody(node, { directives: directives, statements: statements });
    }
  }, {
    key: 'reduceFunctionDeclaration',
    value: function reduceFunctionDeclaration(node, _ref38) {
      var name = _ref38.name;
      var params = _ref38.params;
      var body = _ref38.body;

      return new Shift.FunctionDeclaration(node, { isGenerator: node.isGenerator, name: name, params: params, body: body });
    }
  }, {
    key: 'reduceFunctionExpression',
    value: function reduceFunctionExpression(node, _ref39) {
      var name = _ref39.name;
      var params = _ref39.params;
      var body = _ref39.body;

      return new Shift.FunctionExpression(node, { isGenerator: node.isGenerator, name: name, params: params, body: body });
    }
  }, {
    key: 'reduceGetter',
    value: function reduceGetter(node, _ref40) {
      var name = _ref40.name;
      var body = _ref40.body;

      return new Shift.Getter(node, { name: name, body: body });
    }
  }, {
    key: 'reduceIdentifierExpression',
    value: function reduceIdentifierExpression(node) {
      return new Shift.IdentifierExpression(node, { name: node.name });
    }
  }, {
    key: 'reduceIfStatement',
    value: function reduceIfStatement(node, _ref41) {
      var test = _ref41.test;
      var consequent = _ref41.consequent;
      var alternate = _ref41.alternate;

      return new Shift.IfStatement(node, { test: test, consequent: consequent, alternate: alternate });
    }
  }, {
    key: 'reduceImport',
    value: function reduceImport(node, _ref42) {
      var defaultBinding = _ref42.defaultBinding;
      var namedImports = _ref42.namedImports;

      return new Shift.Import(node, { defaultBinding: defaultBinding, namedImports: namedImports, moduleSpecifier: node.moduleSpecifier });
    }
  }, {
    key: 'reduceImportNamespace',
    value: function reduceImportNamespace(node, _ref43) {
      var defaultBinding = _ref43.defaultBinding;
      var namespaceBinding = _ref43.namespaceBinding;

      return new Shift.ImportNamespace(node, { defaultBinding: defaultBinding, namespaceBinding: namespaceBinding, moduleSpecifier: node.moduleSpecifier });
    }
  }, {
    key: 'reduceImportSpecifier',
    value: function reduceImportSpecifier(node, _ref44) {
      var binding = _ref44.binding;

      return new Shift.ImportSpecifier(node, { name: node.name, binding: binding });
    }
  }, {
    key: 'reduceLabeledStatement',
    value: function reduceLabeledStatement(node, _ref45) {
      var body = _ref45.body;

      return new Shift.LabeledStatement(node, { label: node.label, body: body });
    }
  }, {
    key: 'reduceLiteralBooleanExpression',
    value: function reduceLiteralBooleanExpression(node) {
      return new Shift.LiteralBooleanExpression(node, { value: node.value });
    }
  }, {
    key: 'reduceLiteralInfinityExpression',
    value: function reduceLiteralInfinityExpression(node) {
      return new Shift.LiteralInfinityExpression();
    }
  }, {
    key: 'reduceLiteralNullExpression',
    value: function reduceLiteralNullExpression(node) {
      return new Shift.LiteralNullExpression();
    }
  }, {
    key: 'reduceLiteralNumericExpression',
    value: function reduceLiteralNumericExpression(node) {
      return new Shift.LiteralNumericExpression(node, { value: node.value });
    }
  }, {
    key: 'reduceLiteralRegExpExpression',
    value: function reduceLiteralRegExpExpression(node) {
      return new Shift.LiteralRegExpExpression(node, { pattern: node.pattern, global: node.global, ignoreCase: node.ignoreCase, multiLine: node.multiLine, sticky: node.sticky, unicode: node.unicode });
    }
  }, {
    key: 'reduceLiteralStringExpression',
    value: function reduceLiteralStringExpression(node) {
      return new Shift.LiteralStringExpression(node, { value: node.value });
    }
  }, {
    key: 'reduceMethod',
    value: function reduceMethod(node, _ref46) {
      var name = _ref46.name;
      var params = _ref46.params;
      var body = _ref46.body;

      return new Shift.Method(node, { isGenerator: node.isGenerator, name: name, params: params, body: body });
    }
  }, {
    key: 'reduceModule',
    value: function reduceModule(node, _ref47) {
      var directives = _ref47.directives;
      var items = _ref47.items;

      return new Shift.Module(node, { directives: directives, items: items });
    }
  }, {
    key: 'reduceNewExpression',
    value: function reduceNewExpression(node, _ref48) {
      var callee = _ref48.callee;
      var _arguments = _ref48.arguments;

      return new Shift.NewExpression(node, { callee: callee, arguments: _arguments });
    }
  }, {
    key: 'reduceNewTargetExpression',
    value: function reduceNewTargetExpression(node) {
      return new Shift.NewTargetExpression();
    }
  }, {
    key: 'reduceObjectAssignmentTarget',
    value: function reduceObjectAssignmentTarget(node, _ref49) {
      var properties = _ref49.properties;

      return new Shift.ObjectAssignmentTarget(node, { properties: properties });
    }
  }, {
    key: 'reduceObjectBinding',
    value: function reduceObjectBinding(node, _ref50) {
      var properties = _ref50.properties;

      return new Shift.ObjectBinding(node, { properties: properties });
    }
  }, {
    key: 'reduceObjectExpression',
    value: function reduceObjectExpression(node, _ref51) {
      var properties = _ref51.properties;

      return new Shift.ObjectExpression(node, { properties: properties });
    }
  }, {
    key: 'reduceReturnStatement',
    value: function reduceReturnStatement(node, _ref52) {
      var expression = _ref52.expression;

      return new Shift.ReturnStatement(node, { expression: expression });
    }
  }, {
    key: 'reduceScript',
    value: function reduceScript(node, _ref53) {
      var directives = _ref53.directives;
      var statements = _ref53.statements;

      return new Shift.Script(node, { directives: directives, statements: statements });
    }
  }, {
    key: 'reduceSetter',
    value: function reduceSetter(node, _ref54) {
      var name = _ref54.name;
      var param = _ref54.param;
      var body = _ref54.body;

      return new Shift.Setter(node, { name: name, param: param, body: body });
    }
  }, {
    key: 'reduceShorthandProperty',
    value: function reduceShorthandProperty(node, _ref55) {
      var name = _ref55.name;

      return new Shift.ShorthandProperty(node, { name: name });
    }
  }, {
    key: 'reduceSpreadElement',
    value: function reduceSpreadElement(node, _ref56) {
      var expression = _ref56.expression;

      return new Shift.SpreadElement(node, { expression: expression });
    }
  }, {
    key: 'reduceStaticMemberAssignmentTarget',
    value: function reduceStaticMemberAssignmentTarget(node, _ref57) {
      var object = _ref57.object;

      return new Shift.StaticMemberAssignmentTarget(node, { object: object, property: node.property });
    }
  }, {
    key: 'reduceStaticMemberExpression',
    value: function reduceStaticMemberExpression(node, _ref58) {
      var object = _ref58.object;

      return new Shift.StaticMemberExpression(node, { object: object, property: node.property });
    }
  }, {
    key: 'reduceStaticPropertyName',
    value: function reduceStaticPropertyName(node) {
      return new Shift.StaticPropertyName(node, { value: node.value });
    }
  }, {
    key: 'reduceSuper',
    value: function reduceSuper(node) {
      return new Shift.Super();
    }
  }, {
    key: 'reduceSwitchCase',
    value: function reduceSwitchCase(node, _ref59) {
      var test = _ref59.test;
      var consequent = _ref59.consequent;

      return new Shift.SwitchCase(node, { test: test, consequent: consequent });
    }
  }, {
    key: 'reduceSwitchDefault',
    value: function reduceSwitchDefault(node, _ref60) {
      var consequent = _ref60.consequent;

      return new Shift.SwitchDefault(node, { consequent: consequent });
    }
  }, {
    key: 'reduceSwitchStatement',
    value: function reduceSwitchStatement(node, _ref61) {
      var discriminant = _ref61.discriminant;
      var cases = _ref61.cases;

      return new Shift.SwitchStatement(node, { discriminant: discriminant, cases: cases });
    }
  }, {
    key: 'reduceSwitchStatementWithDefault',
    value: function reduceSwitchStatementWithDefault(node, _ref62) {
      var discriminant = _ref62.discriminant;
      var preDefaultCases = _ref62.preDefaultCases;
      var defaultCase = _ref62.defaultCase;
      var postDefaultCases = _ref62.postDefaultCases;

      return new Shift.SwitchStatementWithDefault(node, { discriminant: discriminant, preDefaultCases: preDefaultCases, defaultCase: defaultCase, postDefaultCases: postDefaultCases });
    }
  }, {
    key: 'reduceTemplateElement',
    value: function reduceTemplateElement(node) {
      return new Shift.TemplateElement(node, { rawValue: node.rawValue });
    }
  }, {
    key: 'reduceTemplateExpression',
    value: function reduceTemplateExpression(node, _ref63) {
      var tag = _ref63.tag;
      var elements = _ref63.elements;

      return new Shift.TemplateExpression(node, { tag: tag, elements: elements });
    }
  }, {
    key: 'reduceThisExpression',
    value: function reduceThisExpression(node) {
      return new Shift.ThisExpression();
    }
  }, {
    key: 'reduceThrowStatement',
    value: function reduceThrowStatement(node, _ref64) {
      var expression = _ref64.expression;

      return new Shift.ThrowStatement(node, { expression: expression });
    }
  }, {
    key: 'reduceTryCatchStatement',
    value: function reduceTryCatchStatement(node, _ref65) {
      var body = _ref65.body;
      var catchClause = _ref65.catchClause;

      return new Shift.TryCatchStatement(node, { body: body, catchClause: catchClause });
    }
  }, {
    key: 'reduceTryFinallyStatement',
    value: function reduceTryFinallyStatement(node, _ref66) {
      var body = _ref66.body;
      var catchClause = _ref66.catchClause;
      var finalizer = _ref66.finalizer;

      return new Shift.TryFinallyStatement(node, { body: body, catchClause: catchClause, finalizer: finalizer });
    }
  }, {
    key: 'reduceUnaryExpression',
    value: function reduceUnaryExpression(node, _ref67) {
      var operand = _ref67.operand;

      return new Shift.UnaryExpression(node, { operator: node.operator, operand: operand });
    }
  }, {
    key: 'reduceUpdateExpression',
    value: function reduceUpdateExpression(node, _ref68) {
      var operand = _ref68.operand;

      return new Shift.UpdateExpression(node, { isPrefix: node.isPrefix, operator: node.operator, operand: operand });
    }
  }, {
    key: 'reduceVariableDeclaration',
    value: function reduceVariableDeclaration(node, _ref69) {
      var declarators = _ref69.declarators;

      return new Shift.VariableDeclaration(node, { kind: node.kind, declarators: declarators });
    }
  }, {
    key: 'reduceVariableDeclarationStatement',
    value: function reduceVariableDeclarationStatement(node, _ref70) {
      var declaration = _ref70.declaration;

      return new Shift.VariableDeclarationStatement(node, { declaration: declaration });
    }
  }, {
    key: 'reduceVariableDeclarator',
    value: function reduceVariableDeclarator(node, _ref71) {
      var binding = _ref71.binding;
      var init = _ref71.init;

      return new Shift.VariableDeclarator(node, { binding: binding, init: init });
    }
  }, {
    key: 'reduceWhileStatement',
    value: function reduceWhileStatement(node, _ref72) {
      var test = _ref72.test;
      var body = _ref72.body;

      return new Shift.WhileStatement(node, { test: test, body: body });
    }
  }, {
    key: 'reduceWithStatement',
    value: function reduceWithStatement(node, _ref73) {
      var object = _ref73.object;
      var body = _ref73.body;

      return new Shift.WithStatement(node, { object: object, body: body });
    }
  }, {
    key: 'reduceYieldExpression',
    value: function reduceYieldExpression(node, _ref74) {
      var expression = _ref74.expression;

      return new Shift.YieldExpression(node, { expression: expression });
    }
  }, {
    key: 'reduceYieldGeneratorExpression',
    value: function reduceYieldGeneratorExpression(node, _ref75) {
      var expression = _ref75.expression;

      return new Shift.YieldGeneratorExpression(node, { expression: expression });
    }
  }]);

  return CloneReducer;
}();

exports.default = CloneReducer;