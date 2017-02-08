"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EarlyError = exports.EarlyErrorState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
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

require("es6-map/implement");

var _multimap = require("multimap");

var _multimap2 = _interopRequireDefault(_multimap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// FIXME: remove this when collections/multi-map is working
_multimap2.default.prototype.addEach = function (otherMap) {
  var _this = this;

  otherMap.forEachEntry(function (v, k) {
    _this.set.apply(_this, [k].concat(v));
  });
  return this;
};

var identity = void 0; // initialised below EarlyErrorState

var EarlyErrorState = exports.EarlyErrorState = function () {
  function EarlyErrorState() {
    _classCallCheck(this, EarlyErrorState);

    this.errors = [];
    // errors that are only errors in strict mode code
    this.strictErrors = [];

    // Label values used in LabeledStatement nodes; cleared at function boundaries
    this.usedLabelNames = [];

    // BreakStatement nodes; cleared at iteration; switch; and function boundaries
    this.freeBreakStatements = [];
    // ContinueStatement nodes; cleared at
    this.freeContinueStatements = [];

    // labeled BreakStatement nodes; cleared at LabeledStatement with same Label and function boundaries
    this.freeLabeledBreakStatements = [];
    // labeled ContinueStatement nodes; cleared at labeled iteration statement with same Label and function boundaries
    this.freeLabeledContinueStatements = [];

    // NewTargetExpression nodes; cleared at function (besides arrow expression) boundaries
    this.newTargetExpressions = [];

    // BindingIdentifier nodes; cleared at containing declaration node
    this.boundNames = new _multimap2.default();
    // BindingIdentifiers that were found to be in a lexical binding position
    this.lexicallyDeclaredNames = new _multimap2.default();
    // BindingIdentifiers that were the name of a FunctionDeclaration
    this.functionDeclarationNames = new _multimap2.default();
    // BindingIdentifiers that were found to be in a variable binding position
    this.varDeclaredNames = new _multimap2.default();
    // BindingIdentifiers that were found to be in a variable binding position
    this.forOfVarDeclaredNames = [];

    // Names that this module exports
    this.exportedNames = new _multimap2.default();
    // Locally declared names that are referenced in export declarations
    this.exportedBindings = new _multimap2.default();

    // CallExpressions with Super callee
    this.superCallExpressions = [];
    // SuperCall expressions in the context of a Method named "constructor"
    this.superCallExpressionsInConstructorMethod = [];
    // MemberExpressions with Super object
    this.superPropertyExpressions = [];

    // YieldExpression and YieldGeneratorExpression nodes; cleared at function boundaries
    this.yieldExpressions = [];
  }

  _createClass(EarlyErrorState, [{
    key: "addFreeBreakStatement",
    value: function addFreeBreakStatement(s) {
      this.freeBreakStatements.push(s);
      return this;
    }
  }, {
    key: "addFreeLabeledBreakStatement",
    value: function addFreeLabeledBreakStatement(s) {
      this.freeLabeledBreakStatements.push(s);
      return this;
    }
  }, {
    key: "clearFreeBreakStatements",
    value: function clearFreeBreakStatements() {
      this.freeBreakStatements = [];
      return this;
    }
  }, {
    key: "addFreeContinueStatement",
    value: function addFreeContinueStatement(s) {
      this.freeContinueStatements.push(s);
      return this;
    }
  }, {
    key: "addFreeLabeledContinueStatement",
    value: function addFreeLabeledContinueStatement(s) {
      this.freeLabeledContinueStatements.push(s);
      return this;
    }
  }, {
    key: "clearFreeContinueStatements",
    value: function clearFreeContinueStatements() {
      this.freeContinueStatements = [];
      return this;
    }
  }, {
    key: "enforceFreeBreakStatementErrors",
    value: function enforceFreeBreakStatementErrors(createError) {
      [].push.apply(this.errors, this.freeBreakStatements.map(createError));
      this.freeBreakStatements = [];
      return this;
    }
  }, {
    key: "enforceFreeLabeledBreakStatementErrors",
    value: function enforceFreeLabeledBreakStatementErrors(createError) {
      [].push.apply(this.errors, this.freeLabeledBreakStatements.map(createError));
      this.freeLabeledBreakStatements = [];
      return this;
    }
  }, {
    key: "enforceFreeContinueStatementErrors",
    value: function enforceFreeContinueStatementErrors(createError) {
      [].push.apply(this.errors, this.freeContinueStatements.map(createError));
      this.freeContinueStatements = [];
      return this;
    }
  }, {
    key: "enforceFreeLabeledContinueStatementErrors",
    value: function enforceFreeLabeledContinueStatementErrors(createError) {
      [].push.apply(this.errors, this.freeLabeledContinueStatements.map(createError));
      this.freeLabeledContinueStatements = [];
      return this;
    }
  }, {
    key: "observeIterationLabel",
    value: function observeIterationLabel(label) {
      this.usedLabelNames.push(label);
      this.freeLabeledBreakStatements = this.freeLabeledBreakStatements.filter(function (s) {
        return s.label !== label;
      });
      this.freeLabeledContinueStatements = this.freeLabeledContinueStatements.filter(function (s) {
        return s.label !== label;
      });
      return this;
    }
  }, {
    key: "observeNonIterationLabel",
    value: function observeNonIterationLabel(label) {
      this.usedLabelNames.push(label);
      this.freeLabeledBreakStatements = this.freeLabeledBreakStatements.filter(function (s) {
        return s.label !== label;
      });
      return this;
    }
  }, {
    key: "clearUsedLabelNames",
    value: function clearUsedLabelNames() {
      this.usedLabelNames = [];
      return this;
    }
  }, {
    key: "observeSuperCallExpression",
    value: function observeSuperCallExpression(node) {
      this.superCallExpressions.push(node);
      return this;
    }
  }, {
    key: "observeConstructorMethod",
    value: function observeConstructorMethod() {
      this.superCallExpressionsInConstructorMethod = this.superCallExpressions;
      this.superCallExpressions = [];
      return this;
    }
  }, {
    key: "clearSuperCallExpressionsInConstructorMethod",
    value: function clearSuperCallExpressionsInConstructorMethod() {
      this.superCallExpressionsInConstructorMethod = [];
      return this;
    }
  }, {
    key: "enforceSuperCallExpressions",
    value: function enforceSuperCallExpressions(createError) {
      [].push.apply(this.errors, this.superCallExpressions.map(createError));
      [].push.apply(this.errors, this.superCallExpressionsInConstructorMethod.map(createError));
      this.superCallExpressions = [];
      this.superCallExpressionsInConstructorMethod = [];
      return this;
    }
  }, {
    key: "enforceSuperCallExpressionsInConstructorMethod",
    value: function enforceSuperCallExpressionsInConstructorMethod(createError) {
      [].push.apply(this.errors, this.superCallExpressionsInConstructorMethod.map(createError));
      this.superCallExpressionsInConstructorMethod = [];
      return this;
    }
  }, {
    key: "observeSuperPropertyExpression",
    value: function observeSuperPropertyExpression(node) {
      this.superPropertyExpressions.push(node);
      return this;
    }
  }, {
    key: "clearSuperPropertyExpressions",
    value: function clearSuperPropertyExpressions() {
      this.superPropertyExpressions = [];
      return this;
    }
  }, {
    key: "enforceSuperPropertyExpressions",
    value: function enforceSuperPropertyExpressions(createError) {
      [].push.apply(this.errors, this.superPropertyExpressions.map(createError));
      this.superPropertyExpressions = [];
      return this;
    }
  }, {
    key: "observeNewTargetExpression",
    value: function observeNewTargetExpression(node) {
      this.newTargetExpressions.push(node);
      return this;
    }
  }, {
    key: "clearNewTargetExpressions",
    value: function clearNewTargetExpressions() {
      this.newTargetExpressions = [];
      return this;
    }
  }, {
    key: "bindName",
    value: function bindName(name, node) {
      this.boundNames.set(name, node);
      return this;
    }
  }, {
    key: "clearBoundNames",
    value: function clearBoundNames() {
      this.boundNames = new _multimap2.default();
      return this;
    }
  }, {
    key: "observeLexicalDeclaration",
    value: function observeLexicalDeclaration() {
      this.lexicallyDeclaredNames.addEach(this.boundNames);
      this.boundNames = new _multimap2.default();
      return this;
    }
  }, {
    key: "observeLexicalBoundary",
    value: function observeLexicalBoundary() {
      this.previousLexicallyDeclaredNames = this.lexicallyDeclaredNames;
      this.lexicallyDeclaredNames = new _multimap2.default();
      this.functionDeclarationNames = new _multimap2.default();
      return this;
    }
  }, {
    key: "enforceDuplicateLexicallyDeclaredNames",
    value: function enforceDuplicateLexicallyDeclaredNames(createError) {
      var _this2 = this;

      this.lexicallyDeclaredNames.forEachEntry(function (nodes /*, bindingName*/) {
        if (nodes.length > 1) {
          nodes.slice(1).forEach(function (dupeNode) {
            _this2.addError(createError(dupeNode));
          });
        }
      });
      return this;
    }
  }, {
    key: "enforceConflictingLexicallyDeclaredNames",
    value: function enforceConflictingLexicallyDeclaredNames(otherNames, createError) {
      var _this3 = this;

      this.lexicallyDeclaredNames.forEachEntry(function (nodes, bindingName) {
        if (otherNames.has(bindingName)) {
          nodes.forEach(function (conflictingNode) {
            _this3.addError(createError(conflictingNode));
          });
        }
      });
      return this;
    }
  }, {
    key: "observeFunctionDeclaration",
    value: function observeFunctionDeclaration() {
      this.observeVarBoundary();
      this.functionDeclarationNames.addEach(this.boundNames);
      this.boundNames = new _multimap2.default();
      return this;
    }
  }, {
    key: "functionDeclarationNamesAreLexical",
    value: function functionDeclarationNamesAreLexical() {
      this.lexicallyDeclaredNames.addEach(this.functionDeclarationNames);
      this.functionDeclarationNames = new _multimap2.default();
      return this;
    }
  }, {
    key: "observeVarDeclaration",
    value: function observeVarDeclaration() {
      this.varDeclaredNames.addEach(this.boundNames);
      this.boundNames = new _multimap2.default();
      return this;
    }
  }, {
    key: "recordForOfVars",
    value: function recordForOfVars() {
      var _this4 = this;

      this.varDeclaredNames.forEach(function (bindingIdentifier) {
        _this4.forOfVarDeclaredNames.push(bindingIdentifier);
      });
      return this;
    }
  }, {
    key: "observeVarBoundary",
    value: function observeVarBoundary() {
      this.lexicallyDeclaredNames = new _multimap2.default();
      this.functionDeclarationNames = new _multimap2.default();
      this.varDeclaredNames = new _multimap2.default();
      this.forOfVarDeclaredNames = [];
      return this;
    }
  }, {
    key: "exportName",
    value: function exportName(name, node) {
      this.exportedNames.set(name, node);
      return this;
    }
  }, {
    key: "exportDeclaredNames",
    value: function exportDeclaredNames() {
      this.exportedNames.addEach(this.lexicallyDeclaredNames).addEach(this.varDeclaredNames);
      this.exportedBindings.addEach(this.lexicallyDeclaredNames).addEach(this.varDeclaredNames);
      return this;
    }
  }, {
    key: "exportBinding",
    value: function exportBinding(name, node) {
      this.exportedBindings.set(name, node);
      return this;
    }
  }, {
    key: "clearExportedBindings",
    value: function clearExportedBindings() {
      this.exportedBindings = new _multimap2.default();
      return this;
    }
  }, {
    key: "observeYieldExpression",
    value: function observeYieldExpression(node) {
      this.yieldExpressions.push(node);
      return this;
    }
  }, {
    key: "clearYieldExpressions",
    value: function clearYieldExpressions() {
      this.yieldExpressions = [];
      return this;
    }
  }, {
    key: "addError",
    value: function addError(e) {
      this.errors.push(e);
      return this;
    }
  }, {
    key: "addStrictError",
    value: function addStrictError(e) {
      this.strictErrors.push(e);
      return this;
    }
  }, {
    key: "enforceStrictErrors",
    value: function enforceStrictErrors() {
      [].push.apply(this.errors, this.strictErrors);
      this.strictErrors = [];
      return this;
    }

    // MONOID IMPLEMENTATION

  }, {
    key: "concat",
    value: function concat(s) {
      if (this === identity) return s;
      if (s === identity) return this;
      [].push.apply(this.errors, s.errors);
      [].push.apply(this.strictErrors, s.strictErrors);
      [].push.apply(this.usedLabelNames, s.usedLabelNames);
      [].push.apply(this.freeBreakStatements, s.freeBreakStatements);
      [].push.apply(this.freeContinueStatements, s.freeContinueStatements);
      [].push.apply(this.freeLabeledBreakStatements, s.freeLabeledBreakStatements);
      [].push.apply(this.freeLabeledContinueStatements, s.freeLabeledContinueStatements);
      [].push.apply(this.newTargetExpressions, s.newTargetExpressions);
      this.boundNames.addEach(s.boundNames);
      this.lexicallyDeclaredNames.addEach(s.lexicallyDeclaredNames);
      this.functionDeclarationNames.addEach(s.functionDeclarationNames);
      this.varDeclaredNames.addEach(s.varDeclaredNames);
      [].push.apply(this.forOfVarDeclaredNames, s.forOfVarDeclaredNames);
      this.exportedNames.addEach(s.exportedNames);
      this.exportedBindings.addEach(s.exportedBindings);
      [].push.apply(this.superCallExpressions, s.superCallExpressions);
      [].push.apply(this.superCallExpressionsInConstructorMethod, s.superCallExpressionsInConstructorMethod);
      [].push.apply(this.superPropertyExpressions, s.superPropertyExpressions);
      [].push.apply(this.yieldExpressions, s.yieldExpressions);
      return this;
    }
  }], [{
    key: "empty",
    value: function empty() {
      return identity;
    }
  }]);

  return EarlyErrorState;
}();

identity = new EarlyErrorState();
Object.getOwnPropertyNames(EarlyErrorState.prototype).forEach(function (methodName) {
  if (methodName === "constructor") return;
  Object.defineProperty(identity, methodName, {
    value: function value() {
      return EarlyErrorState.prototype[methodName].apply(new EarlyErrorState(), arguments);
    },
    enumerable: false,
    writable: true,
    configurable: true
  });
});

var EarlyError = exports.EarlyError = function (_Error) {
  _inherits(EarlyError, _Error);

  function EarlyError(node, message) {
    _classCallCheck(this, EarlyError);

    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(EarlyError).call(this, message));

    _this5.node = node;
    _this5.message = message;
    return _this5;
  }

  return EarlyError;
}(Error);