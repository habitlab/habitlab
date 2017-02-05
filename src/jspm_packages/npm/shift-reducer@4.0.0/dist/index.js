"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reduce;

var _cloneReducer = require("./clone-reducer");

Object.defineProperty(exports, "CloneReducer", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_cloneReducer).default;
  }
});

var _monoidalReducer = require("./monoidal-reducer");

Object.defineProperty(exports, "MonoidalReducer", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_monoidalReducer).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
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

var director = {
  ArrayAssignmentTarget: function ArrayAssignmentTarget(reducer, node) {
    var _this = this;

    return reducer.reduceArrayAssignmentTarget(node, { elements: node.elements.map(function (v) {
        return v && _this[v.type](reducer, v);
      }), rest: node.rest && this[node.rest.type](reducer, node.rest) });
  },
  ArrayBinding: function ArrayBinding(reducer, node) {
    var _this2 = this;

    return reducer.reduceArrayBinding(node, { elements: node.elements.map(function (v) {
        return v && _this2[v.type](reducer, v);
      }), rest: node.rest && this[node.rest.type](reducer, node.rest) });
  },
  ArrayExpression: function ArrayExpression(reducer, node) {
    var _this3 = this;

    return reducer.reduceArrayExpression(node, { elements: node.elements.map(function (v) {
        return v && _this3[v.type](reducer, v);
      }) });
  },
  ArrowExpression: function ArrowExpression(reducer, node) {
    return reducer.reduceArrowExpression(node, { params: this.FormalParameters(reducer, node.params), body: this[node.body.type](reducer, node.body) });
  },
  AssignmentExpression: function AssignmentExpression(reducer, node) {
    return reducer.reduceAssignmentExpression(node, { binding: this[node.binding.type](reducer, node.binding), expression: this[node.expression.type](reducer, node.expression) });
  },
  AssignmentTargetIdentifier: function AssignmentTargetIdentifier(reducer, node) {
    return reducer.reduceAssignmentTargetIdentifier(node);
  },
  AssignmentTargetPropertyIdentifier: function AssignmentTargetPropertyIdentifier(reducer, node) {
    return reducer.reduceAssignmentTargetPropertyIdentifier(node, { binding: this.AssignmentTargetIdentifier(reducer, node.binding), init: node.init && this[node.init.type](reducer, node.init) });
  },
  AssignmentTargetPropertyProperty: function AssignmentTargetPropertyProperty(reducer, node) {
    return reducer.reduceAssignmentTargetPropertyProperty(node, { name: this[node.name.type](reducer, node.name), binding: this[node.binding.type](reducer, node.binding) });
  },
  AssignmentTargetWithDefault: function AssignmentTargetWithDefault(reducer, node) {
    return reducer.reduceAssignmentTargetWithDefault(node, { binding: this[node.binding.type](reducer, node.binding), init: this[node.init.type](reducer, node.init) });
  },
  BinaryExpression: function BinaryExpression(reducer, node) {
    return reducer.reduceBinaryExpression(node, { left: this[node.left.type](reducer, node.left), right: this[node.right.type](reducer, node.right) });
  },
  BindingIdentifier: function BindingIdentifier(reducer, node) {
    return reducer.reduceBindingIdentifier(node);
  },
  BindingPropertyIdentifier: function BindingPropertyIdentifier(reducer, node) {
    return reducer.reduceBindingPropertyIdentifier(node, { binding: this.BindingIdentifier(reducer, node.binding), init: node.init && this[node.init.type](reducer, node.init) });
  },
  BindingPropertyProperty: function BindingPropertyProperty(reducer, node) {
    return reducer.reduceBindingPropertyProperty(node, { name: this[node.name.type](reducer, node.name), binding: this[node.binding.type](reducer, node.binding) });
  },
  BindingWithDefault: function BindingWithDefault(reducer, node) {
    return reducer.reduceBindingWithDefault(node, { binding: this[node.binding.type](reducer, node.binding), init: this[node.init.type](reducer, node.init) });
  },
  Block: function Block(reducer, node) {
    var _this4 = this;

    return reducer.reduceBlock(node, { statements: node.statements.map(function (v) {
        return _this4[v.type](reducer, v);
      }) });
  },
  BlockStatement: function BlockStatement(reducer, node) {
    return reducer.reduceBlockStatement(node, { block: this.Block(reducer, node.block) });
  },
  BreakStatement: function BreakStatement(reducer, node) {
    return reducer.reduceBreakStatement(node);
  },
  CallExpression: function CallExpression(reducer, node) {
    var _this5 = this;

    return reducer.reduceCallExpression(node, { callee: this[node.callee.type](reducer, node.callee), arguments: node.arguments.map(function (v) {
        return _this5[v.type](reducer, v);
      }) });
  },
  CatchClause: function CatchClause(reducer, node) {
    return reducer.reduceCatchClause(node, { binding: this[node.binding.type](reducer, node.binding), body: this.Block(reducer, node.body) });
  },
  ClassDeclaration: function ClassDeclaration(reducer, node) {
    var _this6 = this;

    return reducer.reduceClassDeclaration(node, { name: this.BindingIdentifier(reducer, node.name), super: node.super && this[node.super.type](reducer, node.super), elements: node.elements.map(function (v) {
        return _this6.ClassElement(reducer, v);
      }) });
  },
  ClassElement: function ClassElement(reducer, node) {
    return reducer.reduceClassElement(node, { method: this[node.method.type](reducer, node.method) });
  },
  ClassExpression: function ClassExpression(reducer, node) {
    var _this7 = this;

    return reducer.reduceClassExpression(node, { name: node.name && this.BindingIdentifier(reducer, node.name), super: node.super && this[node.super.type](reducer, node.super), elements: node.elements.map(function (v) {
        return _this7.ClassElement(reducer, v);
      }) });
  },
  CompoundAssignmentExpression: function CompoundAssignmentExpression(reducer, node) {
    return reducer.reduceCompoundAssignmentExpression(node, { binding: this[node.binding.type](reducer, node.binding), expression: this[node.expression.type](reducer, node.expression) });
  },
  ComputedMemberAssignmentTarget: function ComputedMemberAssignmentTarget(reducer, node) {
    return reducer.reduceComputedMemberAssignmentTarget(node, { object: this[node.object.type](reducer, node.object), expression: this[node.expression.type](reducer, node.expression) });
  },
  ComputedMemberExpression: function ComputedMemberExpression(reducer, node) {
    return reducer.reduceComputedMemberExpression(node, { object: this[node.object.type](reducer, node.object), expression: this[node.expression.type](reducer, node.expression) });
  },
  ComputedPropertyName: function ComputedPropertyName(reducer, node) {
    return reducer.reduceComputedPropertyName(node, { expression: this[node.expression.type](reducer, node.expression) });
  },
  ConditionalExpression: function ConditionalExpression(reducer, node) {
    return reducer.reduceConditionalExpression(node, { test: this[node.test.type](reducer, node.test), consequent: this[node.consequent.type](reducer, node.consequent), alternate: this[node.alternate.type](reducer, node.alternate) });
  },
  ContinueStatement: function ContinueStatement(reducer, node) {
    return reducer.reduceContinueStatement(node);
  },
  DataProperty: function DataProperty(reducer, node) {
    return reducer.reduceDataProperty(node, { name: this[node.name.type](reducer, node.name), expression: this[node.expression.type](reducer, node.expression) });
  },
  DebuggerStatement: function DebuggerStatement(reducer, node) {
    return reducer.reduceDebuggerStatement(node);
  },
  Directive: function Directive(reducer, node) {
    return reducer.reduceDirective(node);
  },
  DoWhileStatement: function DoWhileStatement(reducer, node) {
    return reducer.reduceDoWhileStatement(node, { body: this[node.body.type](reducer, node.body), test: this[node.test.type](reducer, node.test) });
  },
  EmptyStatement: function EmptyStatement(reducer, node) {
    return reducer.reduceEmptyStatement(node);
  },
  Export: function Export(reducer, node) {
    return reducer.reduceExport(node, { declaration: this[node.declaration.type](reducer, node.declaration) });
  },
  ExportAllFrom: function ExportAllFrom(reducer, node) {
    return reducer.reduceExportAllFrom(node);
  },
  ExportDefault: function ExportDefault(reducer, node) {
    return reducer.reduceExportDefault(node, { body: this[node.body.type](reducer, node.body) });
  },
  ExportFrom: function ExportFrom(reducer, node) {
    var _this8 = this;

    return reducer.reduceExportFrom(node, { namedExports: node.namedExports.map(function (v) {
        return _this8.ExportFromSpecifier(reducer, v);
      }) });
  },
  ExportFromSpecifier: function ExportFromSpecifier(reducer, node) {
    return reducer.reduceExportFromSpecifier(node);
  },
  ExportLocalSpecifier: function ExportLocalSpecifier(reducer, node) {
    return reducer.reduceExportLocalSpecifier(node, { name: this.IdentifierExpression(reducer, node.name) });
  },
  ExportLocals: function ExportLocals(reducer, node) {
    var _this9 = this;

    return reducer.reduceExportLocals(node, { namedExports: node.namedExports.map(function (v) {
        return _this9.ExportLocalSpecifier(reducer, v);
      }) });
  },
  ExpressionStatement: function ExpressionStatement(reducer, node) {
    return reducer.reduceExpressionStatement(node, { expression: this[node.expression.type](reducer, node.expression) });
  },
  ForInStatement: function ForInStatement(reducer, node) {
    return reducer.reduceForInStatement(node, { left: this[node.left.type](reducer, node.left), right: this[node.right.type](reducer, node.right), body: this[node.body.type](reducer, node.body) });
  },
  ForOfStatement: function ForOfStatement(reducer, node) {
    return reducer.reduceForOfStatement(node, { left: this[node.left.type](reducer, node.left), right: this[node.right.type](reducer, node.right), body: this[node.body.type](reducer, node.body) });
  },
  ForStatement: function ForStatement(reducer, node) {
    return reducer.reduceForStatement(node, { init: node.init && this[node.init.type](reducer, node.init), test: node.test && this[node.test.type](reducer, node.test), update: node.update && this[node.update.type](reducer, node.update), body: this[node.body.type](reducer, node.body) });
  },
  FormalParameters: function FormalParameters(reducer, node) {
    var _this10 = this;

    return reducer.reduceFormalParameters(node, { items: node.items.map(function (v) {
        return _this10[v.type](reducer, v);
      }), rest: node.rest && this[node.rest.type](reducer, node.rest) });
  },
  FunctionBody: function FunctionBody(reducer, node) {
    var _this11 = this;

    return reducer.reduceFunctionBody(node, { directives: node.directives.map(function (v) {
        return _this11.Directive(reducer, v);
      }), statements: node.statements.map(function (v) {
        return _this11[v.type](reducer, v);
      }) });
  },
  FunctionDeclaration: function FunctionDeclaration(reducer, node) {
    return reducer.reduceFunctionDeclaration(node, { name: this.BindingIdentifier(reducer, node.name), params: this.FormalParameters(reducer, node.params), body: this.FunctionBody(reducer, node.body) });
  },
  FunctionExpression: function FunctionExpression(reducer, node) {
    return reducer.reduceFunctionExpression(node, { name: node.name && this.BindingIdentifier(reducer, node.name), params: this.FormalParameters(reducer, node.params), body: this.FunctionBody(reducer, node.body) });
  },
  Getter: function Getter(reducer, node) {
    return reducer.reduceGetter(node, { name: this[node.name.type](reducer, node.name), body: this.FunctionBody(reducer, node.body) });
  },
  IdentifierExpression: function IdentifierExpression(reducer, node) {
    return reducer.reduceIdentifierExpression(node);
  },
  IfStatement: function IfStatement(reducer, node) {
    return reducer.reduceIfStatement(node, { test: this[node.test.type](reducer, node.test), consequent: this[node.consequent.type](reducer, node.consequent), alternate: node.alternate && this[node.alternate.type](reducer, node.alternate) });
  },
  Import: function Import(reducer, node) {
    var _this12 = this;

    return reducer.reduceImport(node, { defaultBinding: node.defaultBinding && this.BindingIdentifier(reducer, node.defaultBinding), namedImports: node.namedImports.map(function (v) {
        return _this12.ImportSpecifier(reducer, v);
      }) });
  },
  ImportNamespace: function ImportNamespace(reducer, node) {
    return reducer.reduceImportNamespace(node, { defaultBinding: node.defaultBinding && this.BindingIdentifier(reducer, node.defaultBinding), namespaceBinding: this.BindingIdentifier(reducer, node.namespaceBinding) });
  },
  ImportSpecifier: function ImportSpecifier(reducer, node) {
    return reducer.reduceImportSpecifier(node, { binding: this.BindingIdentifier(reducer, node.binding) });
  },
  LabeledStatement: function LabeledStatement(reducer, node) {
    return reducer.reduceLabeledStatement(node, { body: this[node.body.type](reducer, node.body) });
  },
  LiteralBooleanExpression: function LiteralBooleanExpression(reducer, node) {
    return reducer.reduceLiteralBooleanExpression(node);
  },
  LiteralInfinityExpression: function LiteralInfinityExpression(reducer, node) {
    return reducer.reduceLiteralInfinityExpression(node);
  },
  LiteralNullExpression: function LiteralNullExpression(reducer, node) {
    return reducer.reduceLiteralNullExpression(node);
  },
  LiteralNumericExpression: function LiteralNumericExpression(reducer, node) {
    return reducer.reduceLiteralNumericExpression(node);
  },
  LiteralRegExpExpression: function LiteralRegExpExpression(reducer, node) {
    return reducer.reduceLiteralRegExpExpression(node);
  },
  LiteralStringExpression: function LiteralStringExpression(reducer, node) {
    return reducer.reduceLiteralStringExpression(node);
  },
  Method: function Method(reducer, node) {
    return reducer.reduceMethod(node, { name: this[node.name.type](reducer, node.name), params: this.FormalParameters(reducer, node.params), body: this.FunctionBody(reducer, node.body) });
  },
  Module: function Module(reducer, node) {
    var _this13 = this;

    return reducer.reduceModule(node, { directives: node.directives.map(function (v) {
        return _this13.Directive(reducer, v);
      }), items: node.items.map(function (v) {
        return _this13[v.type](reducer, v);
      }) });
  },
  NewExpression: function NewExpression(reducer, node) {
    var _this14 = this;

    return reducer.reduceNewExpression(node, { callee: this[node.callee.type](reducer, node.callee), arguments: node.arguments.map(function (v) {
        return _this14[v.type](reducer, v);
      }) });
  },
  NewTargetExpression: function NewTargetExpression(reducer, node) {
    return reducer.reduceNewTargetExpression(node);
  },
  ObjectAssignmentTarget: function ObjectAssignmentTarget(reducer, node) {
    var _this15 = this;

    return reducer.reduceObjectAssignmentTarget(node, { properties: node.properties.map(function (v) {
        return _this15[v.type](reducer, v);
      }) });
  },
  ObjectBinding: function ObjectBinding(reducer, node) {
    var _this16 = this;

    return reducer.reduceObjectBinding(node, { properties: node.properties.map(function (v) {
        return _this16[v.type](reducer, v);
      }) });
  },
  ObjectExpression: function ObjectExpression(reducer, node) {
    var _this17 = this;

    return reducer.reduceObjectExpression(node, { properties: node.properties.map(function (v) {
        return _this17[v.type](reducer, v);
      }) });
  },
  ReturnStatement: function ReturnStatement(reducer, node) {
    return reducer.reduceReturnStatement(node, { expression: node.expression && this[node.expression.type](reducer, node.expression) });
  },
  Script: function Script(reducer, node) {
    var _this18 = this;

    return reducer.reduceScript(node, { directives: node.directives.map(function (v) {
        return _this18.Directive(reducer, v);
      }), statements: node.statements.map(function (v) {
        return _this18[v.type](reducer, v);
      }) });
  },
  Setter: function Setter(reducer, node) {
    return reducer.reduceSetter(node, { name: this[node.name.type](reducer, node.name), param: this[node.param.type](reducer, node.param), body: this.FunctionBody(reducer, node.body) });
  },
  ShorthandProperty: function ShorthandProperty(reducer, node) {
    return reducer.reduceShorthandProperty(node, { name: this.IdentifierExpression(reducer, node.name) });
  },
  SpreadElement: function SpreadElement(reducer, node) {
    return reducer.reduceSpreadElement(node, { expression: this[node.expression.type](reducer, node.expression) });
  },
  StaticMemberAssignmentTarget: function StaticMemberAssignmentTarget(reducer, node) {
    return reducer.reduceStaticMemberAssignmentTarget(node, { object: this[node.object.type](reducer, node.object) });
  },
  StaticMemberExpression: function StaticMemberExpression(reducer, node) {
    return reducer.reduceStaticMemberExpression(node, { object: this[node.object.type](reducer, node.object) });
  },
  StaticPropertyName: function StaticPropertyName(reducer, node) {
    return reducer.reduceStaticPropertyName(node);
  },
  Super: function Super(reducer, node) {
    return reducer.reduceSuper(node);
  },
  SwitchCase: function SwitchCase(reducer, node) {
    var _this19 = this;

    return reducer.reduceSwitchCase(node, { test: this[node.test.type](reducer, node.test), consequent: node.consequent.map(function (v) {
        return _this19[v.type](reducer, v);
      }) });
  },
  SwitchDefault: function SwitchDefault(reducer, node) {
    var _this20 = this;

    return reducer.reduceSwitchDefault(node, { consequent: node.consequent.map(function (v) {
        return _this20[v.type](reducer, v);
      }) });
  },
  SwitchStatement: function SwitchStatement(reducer, node) {
    var _this21 = this;

    return reducer.reduceSwitchStatement(node, { discriminant: this[node.discriminant.type](reducer, node.discriminant), cases: node.cases.map(function (v) {
        return _this21.SwitchCase(reducer, v);
      }) });
  },
  SwitchStatementWithDefault: function SwitchStatementWithDefault(reducer, node) {
    var _this22 = this;

    return reducer.reduceSwitchStatementWithDefault(node, { discriminant: this[node.discriminant.type](reducer, node.discriminant), preDefaultCases: node.preDefaultCases.map(function (v) {
        return _this22.SwitchCase(reducer, v);
      }), defaultCase: this.SwitchDefault(reducer, node.defaultCase), postDefaultCases: node.postDefaultCases.map(function (v) {
        return _this22.SwitchCase(reducer, v);
      }) });
  },
  TemplateElement: function TemplateElement(reducer, node) {
    return reducer.reduceTemplateElement(node);
  },
  TemplateExpression: function TemplateExpression(reducer, node) {
    var _this23 = this;

    return reducer.reduceTemplateExpression(node, { tag: node.tag && this[node.tag.type](reducer, node.tag), elements: node.elements.map(function (v) {
        return _this23[v.type](reducer, v);
      }) });
  },
  ThisExpression: function ThisExpression(reducer, node) {
    return reducer.reduceThisExpression(node);
  },
  ThrowStatement: function ThrowStatement(reducer, node) {
    return reducer.reduceThrowStatement(node, { expression: this[node.expression.type](reducer, node.expression) });
  },
  TryCatchStatement: function TryCatchStatement(reducer, node) {
    return reducer.reduceTryCatchStatement(node, { body: this.Block(reducer, node.body), catchClause: this.CatchClause(reducer, node.catchClause) });
  },
  TryFinallyStatement: function TryFinallyStatement(reducer, node) {
    return reducer.reduceTryFinallyStatement(node, { body: this.Block(reducer, node.body), catchClause: node.catchClause && this.CatchClause(reducer, node.catchClause), finalizer: this.Block(reducer, node.finalizer) });
  },
  UnaryExpression: function UnaryExpression(reducer, node) {
    return reducer.reduceUnaryExpression(node, { operand: this[node.operand.type](reducer, node.operand) });
  },
  UpdateExpression: function UpdateExpression(reducer, node) {
    return reducer.reduceUpdateExpression(node, { operand: this[node.operand.type](reducer, node.operand) });
  },
  VariableDeclaration: function VariableDeclaration(reducer, node) {
    var _this24 = this;

    return reducer.reduceVariableDeclaration(node, { declarators: node.declarators.map(function (v) {
        return _this24.VariableDeclarator(reducer, v);
      }) });
  },
  VariableDeclarationStatement: function VariableDeclarationStatement(reducer, node) {
    return reducer.reduceVariableDeclarationStatement(node, { declaration: this.VariableDeclaration(reducer, node.declaration) });
  },
  VariableDeclarator: function VariableDeclarator(reducer, node) {
    return reducer.reduceVariableDeclarator(node, { binding: this[node.binding.type](reducer, node.binding), init: node.init && this[node.init.type](reducer, node.init) });
  },
  WhileStatement: function WhileStatement(reducer, node) {
    return reducer.reduceWhileStatement(node, { test: this[node.test.type](reducer, node.test), body: this[node.body.type](reducer, node.body) });
  },
  WithStatement: function WithStatement(reducer, node) {
    return reducer.reduceWithStatement(node, { object: this[node.object.type](reducer, node.object), body: this[node.body.type](reducer, node.body) });
  },
  YieldExpression: function YieldExpression(reducer, node) {
    return reducer.reduceYieldExpression(node, { expression: node.expression && this[node.expression.type](reducer, node.expression) });
  },
  YieldGeneratorExpression: function YieldGeneratorExpression(reducer, node) {
    return reducer.reduceYieldGeneratorExpression(node, { expression: this[node.expression.type](reducer, node.expression) });
  }
};

function reduce(reducer, node) {
  return director[node.type](reducer, node);
}