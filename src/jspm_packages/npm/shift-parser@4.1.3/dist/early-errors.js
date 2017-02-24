"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EarlyErrorChecker = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _shiftReducer = require("shift-reducer");

var _shiftReducer2 = _interopRequireDefault(_shiftReducer);

var _utils = require("./utils");

var _earlyErrorState = require("./early-error-state");

var _patternAcceptor = require("./pattern-acceptor");

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

function isStrictFunctionBody(_ref) {
  var directives = _ref.directives;

  return directives.some(function (directive) {
    return directive.rawValue === "use strict";
  });
}

function containsDuplicates(list) {
  var uniqs = [];
  for (var i = 0, l = list.length; i < l; ++i) {
    var item = list[i];
    if (uniqs.indexOf(item) >= 0) {
      return true;
    }
    uniqs.push(item);
  }
  return false;
}

function isLabelledFunction(node) {
  return node.type === "LabeledStatement" && (node.body.type === "FunctionDeclaration" || isLabelledFunction(node.body));
}

function isIterationStatement(node) {
  switch (node.type) {
    case "LabeledStatement":
      return isIterationStatement(node.body);
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForOfStatement":
    case "ForStatement":
    case "WhileStatement":
      return true;
  }
  return false;
}

function isSpecialMethod(methodDefinition) {
  if (methodDefinition.name.type !== "StaticPropertyName" || methodDefinition.name.value !== "constructor") {
    return false;
  }
  switch (methodDefinition.type) {
    case "Getter":
    case "Setter":
      return true;
    case "Method":
      return methodDefinition.isGenerator;
  }
  /* istanbul ignore next */
  throw new Error("not reached");
}

function enforceDuplicateConstructorMethods(node, s) {
  var ctors = node.elements.filter(function (e) {
    return !e.isStatic && e.method.type === "Method" && !e.method.isGenerator && e.method.name.type === "StaticPropertyName" && e.method.name.value === "constructor";
  });
  if (ctors.length > 1) {
    ctors.slice(1).forEach(function (ctor) {
      s = s.addError(new _earlyErrorState.EarlyError(ctor, "Duplicate constructor method in class"));
    });
  }
  return s;
}

var SUPERCALL_ERROR = function SUPERCALL_ERROR(node) {
  return new _earlyErrorState.EarlyError(node, "Calls to super must be in the \"constructor\" method of a class expression or class declaration that has a superclass");
};
var SUPERPROPERTY_ERROR = function SUPERPROPERTY_ERROR(node) {
  return new _earlyErrorState.EarlyError(node, "Member access on super must be in a method");
};
var DUPLICATE_BINDING = function DUPLICATE_BINDING(node) {
  return new _earlyErrorState.EarlyError(node, "Duplicate binding " + JSON.stringify(node.name));
};
var FREE_CONTINUE = function FREE_CONTINUE(node) {
  return new _earlyErrorState.EarlyError(node, "Continue statement must be nested within an iteration statement");
};
var UNBOUND_CONTINUE = function UNBOUND_CONTINUE(node) {
  return new _earlyErrorState.EarlyError(node, "Continue statement must be nested within an iteration statement with label " + JSON.stringify(node.label));
};
var FREE_BREAK = function FREE_BREAK(node) {
  return new _earlyErrorState.EarlyError(node, "Break statement must be nested within an iteration statement or a switch statement");
};
var UNBOUND_BREAK = function UNBOUND_BREAK(node) {
  return new _earlyErrorState.EarlyError(node, "Break statement must be nested within a statement with label " + JSON.stringify(node.label));
};

var EarlyErrorChecker = exports.EarlyErrorChecker = function (_MonoidalReducer) {
  _inherits(EarlyErrorChecker, _MonoidalReducer);

  function EarlyErrorChecker() {
    _classCallCheck(this, EarlyErrorChecker);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(EarlyErrorChecker).call(this, _earlyErrorState.EarlyErrorState));
  }

  _createClass(EarlyErrorChecker, [{
    key: "reduceAssignmentExpression",
    value: function reduceAssignmentExpression() {
      return _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceAssignmentExpression", this).apply(this, arguments).clearBoundNames();
    }
  }, {
    key: "reduceArrowExpression",
    value: function reduceArrowExpression(node, _ref2) {
      var params = _ref2.params;
      var body = _ref2.body;

      params = params.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      if (node.body.type === "FunctionBody") {
        body = body.enforceConflictingLexicallyDeclaredNames(params.lexicallyDeclaredNames, DUPLICATE_BINDING);
        if (isStrictFunctionBody(node.body)) {
          params = params.enforceStrictErrors();
          body = body.enforceStrictErrors();
        }
      }
      body.yieldExpressions.forEach(function (node) {
        body = body.addError(new _earlyErrorState.EarlyError(node, "Concise arrow bodies must not contain yield expressions"));
      });
      params.yieldExpressions.forEach(function (node) {
        params = params.addError(new _earlyErrorState.EarlyError(node, "Arrow parameters must not contain yield expressions"));
      });
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceArrowExpression", this).call(this, node, { params: params, body: body });
      s = s.clearYieldExpressions();
      s = s.observeVarBoundary();
      return s;
    }
  }, {
    key: "reduceBindingIdentifier",
    value: function reduceBindingIdentifier(node) {
      var s = this.identity;
      if ((0, _utils.isRestrictedWord)(node.name) || (0, _utils.isStrictModeReservedWord)(node.name)) {
        s = s.addStrictError(new _earlyErrorState.EarlyError(node, "The identifier " + JSON.stringify(node.name) + " must not be in binding position in strict mode"));
      }
      s = s.bindName(node.name, node);
      return s;
    }
  }, {
    key: "reduceBlock",
    value: function reduceBlock() {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceBlock", this).apply(this, arguments);
      s = s.functionDeclarationNamesAreLexical();
      s = s.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      s = s.enforceConflictingLexicallyDeclaredNames(s.varDeclaredNames, DUPLICATE_BINDING);
      s = s.observeLexicalBoundary();
      return s;
    }
  }, {
    key: "reduceBreakStatement",
    value: function reduceBreakStatement(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceBreakStatement", this).apply(this, arguments);
      s = node.label == null ? s.addFreeBreakStatement(node) : s.addFreeLabeledBreakStatement(node);
      return s;
    }
  }, {
    key: "reduceCallExpression",
    value: function reduceCallExpression(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceCallExpression", this).apply(this, arguments);
      if (node.callee.type === "Super") {
        s = s.observeSuperCallExpression(node);
      }
      return s;
    }
  }, {
    key: "reduceCatchClause",
    value: function reduceCatchClause(node, _ref3) {
      var binding = _ref3.binding;
      var body = _ref3.body;

      binding = binding.observeLexicalDeclaration();
      binding = binding.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      binding = binding.enforceConflictingLexicallyDeclaredNames(body.previousLexicallyDeclaredNames, DUPLICATE_BINDING);
      binding.lexicallyDeclaredNames.forEachEntry(function (nodes, bindingName) {
        if (body.varDeclaredNames.has(bindingName)) {
          body.varDeclaredNames.get(bindingName).forEach(function (conflictingNode) {
            if (body.forOfVarDeclaredNames.indexOf(conflictingNode) >= 0) {
              binding = binding.addError(DUPLICATE_BINDING(conflictingNode));
            }
          });
        }
      });
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceCatchClause", this).call(this, node, { binding: binding, body: body });
      s = s.observeLexicalBoundary();
      return s;
    }
  }, {
    key: "reduceClassDeclaration",
    value: function reduceClassDeclaration(node, _ref4) {
      var name = _ref4.name;
      var _super = _ref4.super;
      var elements = _ref4.elements;

      var s = name;
      var sElements = this.fold(elements);
      sElements = sElements.enforceStrictErrors();
      if (node.super != null) {
        _super = _super.enforceStrictErrors();
        s = this.append(s, _super);
        sElements = sElements.clearSuperCallExpressionsInConstructorMethod();
      }
      sElements = sElements.enforceSuperCallExpressions(SUPERCALL_ERROR);
      sElements = sElements.enforceSuperPropertyExpressions(SUPERPROPERTY_ERROR);
      s = this.append(s, sElements);
      s = enforceDuplicateConstructorMethods(node, s);
      s = s.observeLexicalDeclaration();
      return s;
    }
  }, {
    key: "reduceClassElement",
    value: function reduceClassElement(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceClassElement", this).apply(this, arguments);
      if (!node.isStatic && isSpecialMethod(node.method)) {
        s = s.addError(new _earlyErrorState.EarlyError(node, "Constructors cannot be generators, getters or setters"));
      }
      if (node.isStatic && node.method.name.type === "StaticPropertyName" && node.method.name.value === "prototype") {
        s = s.addError(new _earlyErrorState.EarlyError(node, "Static class methods cannot be named \"prototype\""));
      }
      return s;
    }
  }, {
    key: "reduceClassExpression",
    value: function reduceClassExpression(node, _ref5) {
      var name = _ref5.name;
      var _super = _ref5.super;
      var elements = _ref5.elements;

      var s = node.name == null ? this.identity : name;
      var sElements = this.fold(elements);
      sElements = sElements.enforceStrictErrors();
      if (node.super != null) {
        _super = _super.enforceStrictErrors();
        s = this.append(s, _super);
        sElements = sElements.clearSuperCallExpressionsInConstructorMethod();
      }
      sElements = sElements.enforceSuperCallExpressions(SUPERCALL_ERROR);
      sElements = sElements.enforceSuperPropertyExpressions(SUPERPROPERTY_ERROR);
      s = this.append(s, sElements);
      s = enforceDuplicateConstructorMethods(node, s);
      s = s.clearBoundNames();
      return s;
    }
  }, {
    key: "reduceCompoundAssignmentExpression",
    value: function reduceCompoundAssignmentExpression() {
      return _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceCompoundAssignmentExpression", this).apply(this, arguments).clearBoundNames();
    }
  }, {
    key: "reduceComputedMemberExpression",
    value: function reduceComputedMemberExpression(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceComputedMemberExpression", this).apply(this, arguments);
      if (node.object.type === "Super") {
        s = s.observeSuperPropertyExpression(node);
      }
      return s;
    }
  }, {
    key: "reduceContinueStatement",
    value: function reduceContinueStatement(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceContinueStatement", this).apply(this, arguments);
      s = node.label == null ? s.addFreeContinueStatement(node) : s.addFreeLabeledContinueStatement(node);
      return s;
    }
  }, {
    key: "reduceDoWhileStatement",
    value: function reduceDoWhileStatement(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceDoWhileStatement", this).apply(this, arguments);
      if (isLabelledFunction(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node.body, "The body of a do-while statement must not be a labeled function declaration"));
      }
      s = s.clearFreeContinueStatements();
      s = s.clearFreeBreakStatements();
      return s;
    }
  }, {
    key: "reduceExport",
    value: function reduceExport() {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceExport", this).apply(this, arguments);
      s = s.functionDeclarationNamesAreLexical();
      s = s.exportDeclaredNames();
      return s;
    }
  }, {
    key: "reduceExportFrom",
    value: function reduceExportFrom(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceExportFrom", this).apply(this, arguments);
      if (node.moduleSpecifier != null) {
        s = s.clearExportedBindings();
      }
      return s;
    }
  }, {
    key: "reduceExportSpecifier",
    value: function reduceExportSpecifier(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceExportSpecifier", this).apply(this, arguments);
      s = s.exportName(node.exportedName, node);
      s = s.exportBinding(node.name || node.exportedName, node);
      return s;
    }
  }, {
    key: "reduceExportDefault",
    value: function reduceExportDefault(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceExportDefault", this).apply(this, arguments);
      s = s.functionDeclarationNamesAreLexical();
      switch (node.body.type) {
        case "FunctionDeclaration":
        case "ClassDeclaration":
          if (node.body.name.name !== "*default*") {
            s = s.exportDeclaredNames();
          }
          break;
      }
      s = s.exportName("*default*", node);
      return s;
    }
  }, {
    key: "reduceFormalParameters",
    value: function reduceFormalParameters() {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceFormalParameters", this).apply(this, arguments);
      s = s.observeLexicalDeclaration();
      return s;
    }
  }, {
    key: "reduceForStatement",
    value: function reduceForStatement(node, _ref6) {
      var init = _ref6.init;
      var test = _ref6.test;
      var update = _ref6.update;
      var body = _ref6.body;

      if (init != null) {
        init = init.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
        init = init.enforceConflictingLexicallyDeclaredNames(body.varDeclaredNames, DUPLICATE_BINDING);
      }
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceForStatement", this).call(this, node, { init: init, test: test, update: update, body: body });
      if (node.init != null && node.init.type === "VariableDeclaration" && node.init.kind === "const") {
        node.init.declarators.forEach(function (declarator) {
          if (declarator.init == null) {
            s = s.addError(new _earlyErrorState.EarlyError(declarator, "Constant lexical declarations must have an initialiser"));
          }
        });
      }
      if (isLabelledFunction(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node.body, "The body of a for statement must not be a labeled function declaration"));
      }
      s = s.clearFreeContinueStatements();
      s = s.clearFreeBreakStatements();
      s = s.observeLexicalBoundary();
      return s;
    }
  }, {
    key: "reduceForInStatement",
    value: function reduceForInStatement(node, _ref7) {
      var left = _ref7.left;
      var right = _ref7.right;
      var body = _ref7.body;

      left = left.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      left = left.enforceConflictingLexicallyDeclaredNames(body.varDeclaredNames, DUPLICATE_BINDING);
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceForInStatement", this).call(this, node, { left: left, right: right, body: body });
      if (isLabelledFunction(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node.body, "The body of a for-in statement must not be a labeled function declaration"));
      }
      s = s.clearFreeContinueStatements();
      s = s.clearFreeBreakStatements();
      s = s.observeLexicalBoundary();
      return s;
    }
  }, {
    key: "reduceForOfStatement",
    value: function reduceForOfStatement(node, _ref8) {
      var left = _ref8.left;
      var right = _ref8.right;
      var body = _ref8.body;

      left = left.recordForOfVars();
      left = left.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      left = left.enforceConflictingLexicallyDeclaredNames(body.varDeclaredNames, DUPLICATE_BINDING);
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceForOfStatement", this).call(this, node, { left: left, right: right, body: body });
      if (isLabelledFunction(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node.body, "The body of a for-of statement must not be a labeled function declaration"));
      }
      s = s.clearFreeContinueStatements();
      s = s.clearFreeBreakStatements();
      s = s.observeLexicalBoundary();
      return s;
    }
  }, {
    key: "reduceFunctionBody",
    value: function reduceFunctionBody(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceFunctionBody", this).apply(this, arguments);
      s = s.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      s = s.enforceConflictingLexicallyDeclaredNames(s.varDeclaredNames, DUPLICATE_BINDING);
      s = s.enforceFreeContinueStatementErrors(FREE_CONTINUE);
      s = s.enforceFreeLabeledContinueStatementErrors(UNBOUND_CONTINUE);
      s = s.enforceFreeBreakStatementErrors(FREE_BREAK);
      s = s.enforceFreeLabeledBreakStatementErrors(UNBOUND_BREAK);
      s = s.clearUsedLabelNames();
      s = s.clearYieldExpressions();
      if (isStrictFunctionBody(node)) {
        s = s.enforceStrictErrors();
      }
      return s;
    }
  }, {
    key: "reduceFunctionDeclaration",
    value: function reduceFunctionDeclaration(node, _ref9) {
      var name = _ref9.name;
      var params = _ref9.params;
      var body = _ref9.body;

      var isSimpleParameterList = node.params.rest == null && node.params.items.every(function (i) {
        return i.type === "BindingIdentifier";
      });
      var addError = !isSimpleParameterList || node.isGenerator ? "addError" : "addStrictError";
      params.lexicallyDeclaredNames.forEachEntry(function (nodes /*, bindingName*/) {
        if (nodes.length > 1) {
          nodes.slice(1).forEach(function (dupeNode) {
            params = params[addError](DUPLICATE_BINDING(dupeNode));
          });
        }
      });
      body = body.enforceConflictingLexicallyDeclaredNames(params.lexicallyDeclaredNames, DUPLICATE_BINDING);
      body = body.enforceSuperCallExpressions(SUPERCALL_ERROR);
      body = body.enforceSuperPropertyExpressions(SUPERPROPERTY_ERROR);
      params = params.enforceSuperCallExpressions(SUPERCALL_ERROR);
      params = params.enforceSuperPropertyExpressions(SUPERPROPERTY_ERROR);
      if (node.isGenerator) {
        params.yieldExpressions.forEach(function (node) {
          params = params.addError(new _earlyErrorState.EarlyError(node, "Generator parameters must not contain yield expressions"));
        });
      }
      params = params.clearNewTargetExpressions();
      body = body.clearNewTargetExpressions();
      if (isStrictFunctionBody(node.body)) {
        params = params.enforceStrictErrors();
        body = body.enforceStrictErrors();
      }
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceFunctionDeclaration", this).call(this, node, { name: name, params: params, body: body });
      s = s.clearYieldExpressions();
      s = s.observeFunctionDeclaration();
      return s;
    }
  }, {
    key: "reduceFunctionExpression",
    value: function reduceFunctionExpression(node, _ref10) {
      var name = _ref10.name;
      var params = _ref10.params;
      var body = _ref10.body;

      var isSimpleParameterList = node.params.rest == null && node.params.items.every(function (i) {
        return i.type === "BindingIdentifier";
      });
      var addError = !isSimpleParameterList || node.isGenerator ? "addError" : "addStrictError";
      params.lexicallyDeclaredNames.forEachEntry(function (nodes, bindingName) {
        if (nodes.length > 1) {
          nodes.slice(1).forEach(function (dupeNode) {
            params = params[addError](new _earlyErrorState.EarlyError(dupeNode, "Duplicate binding " + JSON.stringify(bindingName)));
          });
        }
      });
      body = body.enforceConflictingLexicallyDeclaredNames(params.lexicallyDeclaredNames, DUPLICATE_BINDING);
      body = body.enforceSuperCallExpressions(SUPERCALL_ERROR);
      body = body.enforceSuperPropertyExpressions(SUPERPROPERTY_ERROR);
      params = params.enforceSuperCallExpressions(SUPERCALL_ERROR);
      params = params.enforceSuperPropertyExpressions(SUPERPROPERTY_ERROR);
      if (node.isGenerator) {
        params.yieldExpressions.forEach(function (node) {
          params = params.addError(new _earlyErrorState.EarlyError(node, "Generator parameters must not contain yield expressions"));
        });
      }
      params = params.clearNewTargetExpressions();
      body = body.clearNewTargetExpressions();
      if (isStrictFunctionBody(node.body)) {
        params = params.enforceStrictErrors();
        body = body.enforceStrictErrors();
      }
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceFunctionExpression", this).call(this, node, { name: name, params: params, body: body });
      s = s.clearBoundNames();
      s = s.clearYieldExpressions();
      s = s.observeVarBoundary();
      return s;
    }
  }, {
    key: "reduceGetter",
    value: function reduceGetter(node, _ref11) {
      var name = _ref11.name;
      var body = _ref11.body;

      body = body.enforceSuperCallExpressions(SUPERCALL_ERROR);
      body = body.clearSuperPropertyExpressions();
      body = body.clearNewTargetExpressions();
      if (isStrictFunctionBody(node.body)) {
        body = body.enforceStrictErrors();
      }
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceGetter", this).call(this, node, { name: name, body: body });
      s = s.observeVarBoundary();
      return s;
    }
  }, {
    key: "reduceIdentifierExpression",
    value: function reduceIdentifierExpression(node) {
      var s = this.identity;
      if ((0, _utils.isStrictModeReservedWord)(node.name)) {
        s = s.addStrictError(new _earlyErrorState.EarlyError(node, "The identifier " + JSON.stringify(node.name) + " must not be in expression position in strict mode"));
      }
      return s;
    }
  }, {
    key: "reduceIfStatement",
    value: function reduceIfStatement(node, _ref12) {
      var test = _ref12.test;
      var consequent = _ref12.consequent;
      var alternate = _ref12.alternate;

      if (isLabelledFunction(node.consequent)) {
        consequent = consequent.addError(new _earlyErrorState.EarlyError(node.consequent, "The consequent of an if statement must not be a labeled function declaration"));
      }
      if (node.alternate != null && isLabelledFunction(node.alternate)) {
        alternate = alternate.addError(new _earlyErrorState.EarlyError(node.alternate, "The alternate of an if statement must not be a labeled function declaration"));
      }
      if (node.consequent.type === "FunctionDeclaration") {
        consequent = consequent.addStrictError(new _earlyErrorState.EarlyError(node.consequent, "FunctionDeclarations in IfStatements are disallowed in strict mode"));
        consequent = consequent.observeLexicalBoundary();
      }
      if (node.alternate != null && node.alternate.type === "FunctionDeclaration") {
        alternate = alternate.addStrictError(new _earlyErrorState.EarlyError(node.alternate, "FunctionDeclarations in IfStatements are disallowed in strict mode"));
        alternate = alternate.observeLexicalBoundary();
      }
      return _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceIfStatement", this).call(this, node, { test: test, consequent: consequent, alternate: alternate });
    }
  }, {
    key: "reduceImport",
    value: function reduceImport() {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceImport", this).apply(this, arguments);
      s = s.observeLexicalDeclaration();
      return s;
    }
  }, {
    key: "reduceImportNamespace",
    value: function reduceImportNamespace() {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceImportNamespace", this).apply(this, arguments);
      s = s.observeLexicalDeclaration();
      return s;
    }
  }, {
    key: "reduceLabeledStatement",
    value: function reduceLabeledStatement(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceLabeledStatement", this).apply(this, arguments);
      if (node.label === "yield") {
        s = s.addStrictError(new _earlyErrorState.EarlyError(node, "The identifier " + JSON.stringify(node.label) + " must not be in label position in strict mode"));
      }
      if (s.usedLabelNames.indexOf(node.label) >= 0) {
        s = s.addError(new _earlyErrorState.EarlyError(node, "Label " + JSON.stringify(node.label) + " has already been declared"));
      }
      if (node.body.type === "FunctionDeclaration") {
        s = s.addStrictError(new _earlyErrorState.EarlyError(node, "Labeled FunctionDeclarations are disallowed in strict mode"));
      }
      s = isIterationStatement(node.body) ? s.observeIterationLabel(node.label) : s.observeNonIterationLabel(node.label);
      return s;
    }
  }, {
    key: "reduceLiteralRegExpExpression",
    value: function reduceLiteralRegExpExpression(node) {
      var s = this.identity;
      // NOTE: the RegExp pattern acceptor is disabled until we have more confidence in its correctness (more tests)
      //if (!PatternAcceptor.test(node.pattern, node.flags.indexOf("u") >= 0)) {
      //  s = s.addError(new EarlyError(node, "Invalid regular expression pattern"));
      //}
      if (!/^[igmyu]*$/.test(node.flags) || containsDuplicates(node.flags)) {
        s = s.addError(new _earlyErrorState.EarlyError(node, "Invalid regular expression flags"));
      }
      return s;
    }
  }, {
    key: "reduceMethod",
    value: function reduceMethod(node, _ref13) {
      var name = _ref13.name;
      var params = _ref13.params;
      var body = _ref13.body;

      params = params.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      body = body.enforceConflictingLexicallyDeclaredNames(params.lexicallyDeclaredNames, DUPLICATE_BINDING);
      if (node.name.type === "StaticPropertyName" && node.name.value === "constructor") {
        body = body.observeConstructorMethod();
        params = params.observeConstructorMethod();
      } else {
        body = body.enforceSuperCallExpressions(SUPERCALL_ERROR);
        params = params.enforceSuperCallExpressions(SUPERCALL_ERROR);
      }
      if (node.isGenerator) {
        params.yieldExpressions.forEach(function (node) {
          params = params.addError(new _earlyErrorState.EarlyError(node, "Generator parameters must not contain yield expressions"));
        });
      }
      body = body.clearSuperPropertyExpressions();
      params = params.clearSuperPropertyExpressions();
      params = params.clearNewTargetExpressions();
      body = body.clearNewTargetExpressions();
      if (isStrictFunctionBody(node.body)) {
        params = params.enforceStrictErrors();
        body = body.enforceStrictErrors();
      }
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceMethod", this).call(this, node, { name: name, params: params, body: body });
      s = s.clearYieldExpressions();
      s = s.observeVarBoundary();
      return s;
    }
  }, {
    key: "reduceModule",
    value: function reduceModule() {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceModule", this).apply(this, arguments);
      s = s.functionDeclarationNamesAreLexical();
      s = s.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      s = s.enforceConflictingLexicallyDeclaredNames(s.varDeclaredNames, DUPLICATE_BINDING);
      s.exportedNames.forEachEntry(function (nodes, bindingName) {
        if (nodes.length > 1) {
          nodes.slice(1).forEach(function (dupeNode) {
            s = s.addError(new _earlyErrorState.EarlyError(dupeNode, "Duplicate export " + JSON.stringify(bindingName)));
          });
        }
      });
      s.exportedBindings.forEachEntry(function (nodes, bindingName) {
        if (bindingName !== "*default*" && !s.lexicallyDeclaredNames.has(bindingName) && !s.varDeclaredNames.has(bindingName)) {
          nodes.forEach(function (undeclaredNode) {
            s = s.addError(new _earlyErrorState.EarlyError(undeclaredNode, "Exported binding " + JSON.stringify(bindingName) + " is not declared"));
          });
        }
      });
      s.newTargetExpressions.forEach(function (node) {
        s = s.addError(new _earlyErrorState.EarlyError(node, "new.target must be within function (but not arrow expression) code"));
      });
      s = s.enforceFreeContinueStatementErrors(FREE_CONTINUE);
      s = s.enforceFreeLabeledContinueStatementErrors(UNBOUND_CONTINUE);
      s = s.enforceFreeBreakStatementErrors(FREE_BREAK);
      s = s.enforceFreeLabeledBreakStatementErrors(UNBOUND_BREAK);
      s = s.enforceSuperCallExpressions(SUPERCALL_ERROR);
      s = s.enforceSuperPropertyExpressions(SUPERPROPERTY_ERROR);
      s = s.enforceStrictErrors();
      return s;
    }
  }, {
    key: "reduceNewTargetExpression",
    value: function reduceNewTargetExpression(node) {
      return this.identity.observeNewTargetExpression(node);
    }
  }, {
    key: "reduceObjectExpression",
    value: function reduceObjectExpression(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceObjectExpression", this).apply(this, arguments);
      s = s.enforceSuperCallExpressionsInConstructorMethod(SUPERCALL_ERROR);
      var protos = node.properties.filter(function (p) {
        return p.type === "DataProperty" && p.name.type === "StaticPropertyName" && p.name.value === "__proto__";
      });
      protos.slice(1).forEach(function (n) {
        s = s.addError(new _earlyErrorState.EarlyError(n, "Duplicate __proto__ property in object literal not allowed"));
      });
      return s;
    }
  }, {
    key: "reduceUpdateExpression",
    value: function reduceUpdateExpression(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceUpdateExpression", this).apply(this, arguments);
      s = s.clearBoundNames();
      return s;
    }
  }, {
    key: "reduceUnaryExpression",
    value: function reduceUnaryExpression(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceUnaryExpression", this).apply(this, arguments);
      if (node.operator === "delete" && node.operand.type === "IdentifierExpression") {
        s = s.addStrictError(new _earlyErrorState.EarlyError(node, "Identifier expressions must not be deleted in strict mode"));
      }
      return s;
    }
  }, {
    key: "reduceScript",
    value: function reduceScript(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceScript", this).apply(this, arguments);
      s = s.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      s = s.enforceConflictingLexicallyDeclaredNames(s.varDeclaredNames, DUPLICATE_BINDING);
      s.newTargetExpressions.forEach(function (node) {
        s = s.addError(new _earlyErrorState.EarlyError(node, "new.target must be within function (but not arrow expression) code"));
      });
      s = s.enforceFreeContinueStatementErrors(FREE_CONTINUE);
      s = s.enforceFreeLabeledContinueStatementErrors(UNBOUND_CONTINUE);
      s = s.enforceFreeBreakStatementErrors(FREE_BREAK);
      s = s.enforceFreeLabeledBreakStatementErrors(UNBOUND_BREAK);
      s = s.enforceSuperCallExpressions(SUPERCALL_ERROR);
      s = s.enforceSuperPropertyExpressions(SUPERPROPERTY_ERROR);
      if (isStrictFunctionBody(node)) {
        s = s.enforceStrictErrors();
      }
      return s;
    }
  }, {
    key: "reduceSetter",
    value: function reduceSetter(node, _ref14) {
      var name = _ref14.name;
      var param = _ref14.param;
      var body = _ref14.body;

      param = param.observeLexicalDeclaration();
      param = param.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      body = body.enforceConflictingLexicallyDeclaredNames(param.lexicallyDeclaredNames, DUPLICATE_BINDING);
      param = param.enforceSuperCallExpressions(SUPERCALL_ERROR);
      body = body.enforceSuperCallExpressions(SUPERCALL_ERROR);
      param = param.clearSuperPropertyExpressions();
      body = body.clearSuperPropertyExpressions();
      param = param.clearNewTargetExpressions();
      body = body.clearNewTargetExpressions();
      if (isStrictFunctionBody(node.body)) {
        param = param.enforceStrictErrors();
        body = body.enforceStrictErrors();
      }
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceSetter", this).call(this, node, { name: name, param: param, body: body });
      s = s.observeVarBoundary();
      return s;
    }
  }, {
    key: "reduceStaticMemberExpression",
    value: function reduceStaticMemberExpression(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceStaticMemberExpression", this).apply(this, arguments);
      if (node.object.type === "Super") {
        s = s.observeSuperPropertyExpression(node);
      }
      return s;
    }
  }, {
    key: "reduceSwitchStatement",
    value: function reduceSwitchStatement(node, _ref15) {
      var discriminant = _ref15.discriminant;
      var cases = _ref15.cases;

      var sCases = this.fold(cases);
      sCases = sCases.functionDeclarationNamesAreLexical();
      sCases = sCases.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      sCases = sCases.enforceConflictingLexicallyDeclaredNames(sCases.varDeclaredNames, DUPLICATE_BINDING);
      sCases = sCases.observeLexicalBoundary();
      var s = this.append(discriminant, sCases);
      s = s.clearFreeBreakStatements();
      return s;
    }
  }, {
    key: "reduceSwitchStatementWithDefault",
    value: function reduceSwitchStatementWithDefault(node, _ref16) {
      var discriminant = _ref16.discriminant;
      var preDefaultCases = _ref16.preDefaultCases;
      var defaultCase = _ref16.defaultCase;
      var postDefaultCases = _ref16.postDefaultCases;

      var sCases = this.append(defaultCase, this.append(this.fold(preDefaultCases), this.fold(postDefaultCases)));
      sCases = sCases.functionDeclarationNamesAreLexical();
      sCases = sCases.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      sCases = sCases.enforceConflictingLexicallyDeclaredNames(sCases.varDeclaredNames, DUPLICATE_BINDING);
      sCases = sCases.observeLexicalBoundary();
      var s = this.append(discriminant, sCases);
      s = s.clearFreeBreakStatements();
      return s;
    }
  }, {
    key: "reduceVariableDeclaration",
    value: function reduceVariableDeclaration(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceVariableDeclaration", this).apply(this, arguments);
      switch (node.kind) {
        case "const":
        case "let":
          {
            s = s.observeLexicalDeclaration();
            if (s.lexicallyDeclaredNames.has("let")) {
              s.lexicallyDeclaredNames.get("let").forEach(function (n) {
                s = s.addError(new _earlyErrorState.EarlyError(n, "Lexical declarations must not have a binding named \"let\""));
              });
            }
            break;
          }
        case "var":
          s = s.observeVarDeclaration();
          break;
      }
      return s;
    }
  }, {
    key: "reduceVariableDeclarationStatement",
    value: function reduceVariableDeclarationStatement(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceVariableDeclarationStatement", this).apply(this, arguments);
      if (node.declaration.kind === "const") {
        node.declaration.declarators.forEach(function (declarator) {
          if (declarator.init == null) {
            s = s.addError(new _earlyErrorState.EarlyError(declarator, "Constant lexical declarations must have an initialiser"));
          }
        });
      }
      return s;
    }
  }, {
    key: "reduceWhileStatement",
    value: function reduceWhileStatement(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceWhileStatement", this).apply(this, arguments);
      if (isLabelledFunction(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node.body, "The body of a while statement must not be a labeled function declaration"));
      }
      s = s.clearFreeContinueStatements().clearFreeBreakStatements();
      return s;
    }
  }, {
    key: "reduceWithStatement",
    value: function reduceWithStatement(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceWithStatement", this).apply(this, arguments);
      if (isLabelledFunction(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node.body, "The body of a with statement must not be a labeled function declaration"));
      }
      s = s.addStrictError(new _earlyErrorState.EarlyError(node, "Strict mode code must not include a with statement"));
      return s;
    }
  }, {
    key: "reduceYieldExpression",
    value: function reduceYieldExpression(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceYieldExpression", this).apply(this, arguments);
      s = s.observeYieldExpression(node);
      return s;
    }
  }, {
    key: "reduceYieldGeneratorExpression",
    value: function reduceYieldGeneratorExpression(node) {
      var s = _get(Object.getPrototypeOf(EarlyErrorChecker.prototype), "reduceYieldGeneratorExpression", this).apply(this, arguments);
      s = s.observeYieldExpression(node);
      return s;
    }
  }], [{
    key: "check",
    value: function check(node) {
      return (0, _shiftReducer2.default)(new EarlyErrorChecker(), node).errors;
    }
  }]);

  return EarlyErrorChecker;
}(_shiftReducer.MonoidalReducer);