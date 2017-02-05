"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _esutils = require("esutils");

var _coderep = require("./coderep");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function p(node, precedence, a) {
  return (0, _coderep.getPrecedence)(node) < precedence ? paren(a) : a;
}

function t(token) {
  return new _coderep.Token(token);
}

function paren(rep) {
  return new _coderep.Paren(rep);
}

function brace(rep) {
  return new _coderep.Brace(rep);
}

function bracket(rep) {
  return new _coderep.Bracket(rep);
}

function noIn(rep) {
  return new _coderep.NoIn(rep);
}

function markContainsIn(state) {
  return state.containsIn ? new _coderep.ContainsIn(state) : state;
}

function seq() {
  for (var _len = arguments.length, reps = Array(_len), _key = 0; _key < _len; _key++) {
    reps[_key] = arguments[_key];
  }

  return new _coderep.Seq(reps);
}

function semi() {
  return new _coderep.Semi();
}

function semiOp() {
  return new _coderep.SemiOp();
}

function empty() {
  return new _coderep.Empty();
}

function commaSep(pieces) {
  return new _coderep.CommaSep(pieces);
}

function getAssignmentExpr(state) {
  return state ? state.containsGroup ? paren(state) : state : empty();
}

var MinimalCodeGen = function () {
  function MinimalCodeGen() {
    _classCallCheck(this, MinimalCodeGen);
  }

  _createClass(MinimalCodeGen, [{
    key: "parenToAvoidBeingDirective",
    value: function parenToAvoidBeingDirective(element, original) {
      if (element && element.type === "ExpressionStatement" && element.expression.type === "LiteralStringExpression") {
        return seq(paren(original.children[0]), semiOp());
      }
      return original;
    }
  }, {
    key: "reduceArrayExpression",
    value: function reduceArrayExpression(node, _ref) {
      var elements = _ref.elements;

      if (elements.length === 0) {
        return bracket(empty());
      }

      var content = commaSep(elements.map(getAssignmentExpr));
      if (elements.length > 0 && elements[elements.length - 1] == null) {
        content = seq(content, t(","));
      }
      return bracket(content);
    }
  }, {
    key: "reduceSpreadElement",
    value: function reduceSpreadElement(node, _ref2) {
      var expression = _ref2.expression;

      return seq(t("..."), p(node.expression, _coderep.Precedence.Assignment, expression));
    }
  }, {
    key: "reduceAssignmentExpression",
    value: function reduceAssignmentExpression(node, _ref3) {
      var binding = _ref3.binding;
      var expression = _ref3.expression;

      var leftCode = binding;
      var rightCode = expression;
      var containsIn = expression.containsIn;
      var startsWithCurly = binding.startsWithCurly;
      var startsWithLetSquareBracket = binding.startsWithLetSquareBracket;
      var startsWithFunctionOrClass = binding.startsWithFunctionOrClass;
      if ((0, _coderep.getPrecedence)(node.expression) < (0, _coderep.getPrecedence)(node)) {
        rightCode = paren(rightCode);
        containsIn = false;
      }
      return (0, _objectAssign2.default)(seq(leftCode, t("="), rightCode), { containsIn: containsIn, startsWithCurly: startsWithCurly, startsWithLetSquareBracket: startsWithLetSquareBracket, startsWithFunctionOrClass: startsWithFunctionOrClass });
    }
  }, {
    key: "reduceAssignmentTargetIdentifier",
    value: function reduceAssignmentTargetIdentifier(node) {
      var a = t(node.name);
      if (node.name === "let") {
        a.startsWithLet = true;
      }
      return a;
    }
  }, {
    key: "reduceAssignmentTargetWithDefault",
    value: function reduceAssignmentTargetWithDefault(node, _ref4) {
      var binding = _ref4.binding;
      var init = _ref4.init;

      return seq(binding, t("="), p(node.init, _coderep.Precedence.Assignment, init));
    }
  }, {
    key: "reduceCompoundAssignmentExpression",
    value: function reduceCompoundAssignmentExpression(node, _ref5) {
      var binding = _ref5.binding;
      var expression = _ref5.expression;

      var leftCode = binding;
      var rightCode = expression;
      var containsIn = expression.containsIn;
      var startsWithCurly = binding.startsWithCurly;
      var startsWithLetSquareBracket = binding.startsWithLetSquareBracket;
      var startsWithFunctionOrClass = binding.startsWithFunctionOrClass;
      if ((0, _coderep.getPrecedence)(node.expression) < (0, _coderep.getPrecedence)(node)) {
        rightCode = paren(rightCode);
        containsIn = false;
      }
      return (0, _objectAssign2.default)(seq(leftCode, t(node.operator), rightCode), { containsIn: containsIn, startsWithCurly: startsWithCurly, startsWithLetSquareBracket: startsWithLetSquareBracket, startsWithFunctionOrClass: startsWithFunctionOrClass });
    }
  }, {
    key: "reduceBinaryExpression",
    value: function reduceBinaryExpression(node, _ref6) {
      var left = _ref6.left;
      var right = _ref6.right;

      var leftCode = left;
      var startsWithCurly = left.startsWithCurly;
      var startsWithLetSquareBracket = left.startsWithLetSquareBracket;
      var startsWithFunctionOrClass = left.startsWithFunctionOrClass;
      var leftContainsIn = left.containsIn;
      if ((0, _coderep.getPrecedence)(node.left) < (0, _coderep.getPrecedence)(node)) {
        leftCode = paren(leftCode);
        startsWithCurly = false;
        startsWithLetSquareBracket = false;
        startsWithFunctionOrClass = false;
        leftContainsIn = false;
      }
      var rightCode = right;
      var rightContainsIn = right.containsIn;
      if ((0, _coderep.getPrecedence)(node.right) <= (0, _coderep.getPrecedence)(node)) {
        rightCode = paren(rightCode);
        rightContainsIn = false;
      }
      return (0, _objectAssign2.default)(seq(leftCode, t(node.operator), rightCode), {
        containsIn: leftContainsIn || rightContainsIn || node.operator === "in",
        containsGroup: node.operator == ",",
        startsWithCurly: startsWithCurly,
        startsWithLetSquareBracket: startsWithLetSquareBracket,
        startsWithFunctionOrClass: startsWithFunctionOrClass
      });
    }
  }, {
    key: "reduceBindingWithDefault",
    value: function reduceBindingWithDefault(node, _ref7) {
      var binding = _ref7.binding;
      var init = _ref7.init;

      return seq(binding, t("="), p(node.init, _coderep.Precedence.Assignment, init));
    }
  }, {
    key: "reduceBindingIdentifier",
    value: function reduceBindingIdentifier(node) {
      var a = t(node.name);
      if (node.name === "let") {
        a.startsWithLet = true;
      }
      return a;
    }
  }, {
    key: "reduceArrayAssignmentTarget",
    value: function reduceArrayAssignmentTarget(node, _ref8) {
      var elements = _ref8.elements;
      var rest = _ref8.rest;

      var content = void 0;
      if (elements.length === 0) {
        content = rest == null ? empty() : seq(t("..."), rest);
      } else {
        elements = elements.concat(rest == null ? [] : [seq(t("..."), rest)]);
        content = commaSep(elements.map(getAssignmentExpr));
        if (elements.length > 0 && elements[elements.length - 1] == null) {
          content = seq(content, t(","));
        }
      }
      return bracket(content);
    }
  }, {
    key: "reduceArrayBinding",
    value: function reduceArrayBinding(node, _ref9) {
      var elements = _ref9.elements;
      var rest = _ref9.rest;

      var content = void 0;
      if (elements.length === 0) {
        content = rest == null ? empty() : seq(t("..."), rest);
      } else {
        elements = elements.concat(rest == null ? [] : [seq(t("..."), rest)]);
        content = commaSep(elements.map(getAssignmentExpr));
        if (elements.length > 0 && elements[elements.length - 1] == null) {
          content = seq(content, t(","));
        }
      }
      return bracket(content);
    }
  }, {
    key: "reduceObjectAssignmentTarget",
    value: function reduceObjectAssignmentTarget(node, _ref10) {
      var properties = _ref10.properties;

      var state = brace(commaSep(properties));
      state.startsWithCurly = true;
      return state;
    }
  }, {
    key: "reduceObjectBinding",
    value: function reduceObjectBinding(node, _ref11) {
      var properties = _ref11.properties;

      var state = brace(commaSep(properties));
      state.startsWithCurly = true;
      return state;
    }
  }, {
    key: "reduceAssignmentTargetPropertyIdentifier",
    value: function reduceAssignmentTargetPropertyIdentifier(node, _ref12) {
      var binding = _ref12.binding;
      var init = _ref12.init;

      if (node.init == null) return binding;
      return seq(binding, t("="), p(node.init, _coderep.Precedence.Assignment, init));
    }
  }, {
    key: "reduceAssignmentTargetPropertyProperty",
    value: function reduceAssignmentTargetPropertyProperty(node, _ref13) {
      var name = _ref13.name;
      var binding = _ref13.binding;

      return seq(name, t(":"), binding);
    }
  }, {
    key: "reduceBindingPropertyIdentifier",
    value: function reduceBindingPropertyIdentifier(node, _ref14) {
      var binding = _ref14.binding;
      var init = _ref14.init;

      if (node.init == null) return binding;
      return seq(binding, t("="), p(node.init, _coderep.Precedence.Assignment, init));
    }
  }, {
    key: "reduceBindingPropertyProperty",
    value: function reduceBindingPropertyProperty(node, _ref15) {
      var name = _ref15.name;
      var binding = _ref15.binding;

      return seq(name, t(":"), binding);
    }
  }, {
    key: "reduceBlock",
    value: function reduceBlock(node, _ref16) {
      var statements = _ref16.statements;

      return brace(seq.apply(undefined, _toConsumableArray(statements)));
    }
  }, {
    key: "reduceBlockStatement",
    value: function reduceBlockStatement(node, _ref17) {
      var block = _ref17.block;

      return block;
    }
  }, {
    key: "reduceBreakStatement",
    value: function reduceBreakStatement(node) {
      return seq(t("break"), node.label ? t(node.label) : empty(), semiOp());
    }
  }, {
    key: "reduceCallExpression",
    value: function reduceCallExpression(node, _ref18) {
      var callee = _ref18.callee;
      var args = _ref18.arguments;

      return (0, _objectAssign2.default)(seq(p(node.callee, (0, _coderep.getPrecedence)(node), callee), paren(commaSep(args))), {
        startsWithCurly: callee.startsWithCurly,
        startsWithLetSquareBracket: callee.startsWithLetSquareBracket,
        startsWithFunctionOrClass: callee.startsWithFunctionOrClass
      });
    }
  }, {
    key: "reduceCatchClause",
    value: function reduceCatchClause(node, _ref19) {
      var binding = _ref19.binding;
      var body = _ref19.body;

      return seq(t("catch"), paren(binding), body);
    }
  }, {
    key: "reduceClassDeclaration",
    value: function reduceClassDeclaration(node, _ref20) {
      var name = _ref20.name;
      var _super = _ref20.super;
      var elements = _ref20.elements;

      var state = seq(t("class"), node.name.name === "*default*" ? empty() : name);
      if (_super != null) {
        state = seq(state, t("extends"), p(node.super, _coderep.Precedence.New, _super));
      }
      state = seq.apply(undefined, [state, t("{")].concat(_toConsumableArray(elements), [t("}")]));
      return state;
    }
  }, {
    key: "reduceClassExpression",
    value: function reduceClassExpression(node, _ref21) {
      var name = _ref21.name;
      var _super = _ref21.super;
      var elements = _ref21.elements;

      var state = t("class");
      if (name != null) {
        state = seq(state, name);
      }
      if (_super != null) {
        state = seq(state, t("extends"), p(node.super, _coderep.Precedence.New, _super));
      }
      state = seq.apply(undefined, [state, t("{")].concat(_toConsumableArray(elements), [t("}")]));
      state.startsWithFunctionOrClass = true;
      return state;
    }
  }, {
    key: "reduceClassElement",
    value: function reduceClassElement(node, _ref22) {
      var method = _ref22.method;

      if (!node.isStatic) return method;
      return seq(t("static"), method);
    }
  }, {
    key: "reduceComputedMemberAssignmentTarget",
    value: function reduceComputedMemberAssignmentTarget(node, _ref23) {
      var object = _ref23.object;
      var expression = _ref23.expression;

      var startsWithLetSquareBracket = object.startsWithLetSquareBracket || node.object.type === "IdentifierExpression" && node.object.name === "let";
      return (0, _objectAssign2.default)(seq(p(node.object, (0, _coderep.getPrecedence)(node), object), bracket(expression)), {
        startsWithLet: object.startsWithLet,
        startsWithLetSquareBracket: startsWithLetSquareBracket,
        startsWithCurly: object.startsWithCurly,
        startsWithFunctionOrClass: object.startsWithFunctionOrClass
      });
    }
  }, {
    key: "reduceComputedMemberExpression",
    value: function reduceComputedMemberExpression(node, _ref24) {
      var object = _ref24.object;
      var expression = _ref24.expression;

      var startsWithLetSquareBracket = object.startsWithLetSquareBracket || node.object.type === "IdentifierExpression" && node.object.name === "let";
      return (0, _objectAssign2.default)(seq(p(node.object, (0, _coderep.getPrecedence)(node), object), bracket(expression)), {
        startsWithLet: object.startsWithLet,
        startsWithLetSquareBracket: startsWithLetSquareBracket,
        startsWithCurly: object.startsWithCurly,
        startsWithFunctionOrClass: object.startsWithFunctionOrClass
      });
    }
  }, {
    key: "reduceComputedPropertyName",
    value: function reduceComputedPropertyName(node, _ref25) {
      var expression = _ref25.expression;

      return bracket(p(node.expression, _coderep.Precedence.Assignment, expression));
    }
  }, {
    key: "reduceConditionalExpression",
    value: function reduceConditionalExpression(node, _ref26) {
      var test = _ref26.test;
      var consequent = _ref26.consequent;
      var alternate = _ref26.alternate;

      var containsIn = test.containsIn || alternate.containsIn;
      var startsWithCurly = test.startsWithCurly;
      var startsWithLetSquareBracket = test.startsWithLetSquareBracket;
      var startsWithFunctionOrClass = test.startsWithFunctionOrClass;
      return (0, _objectAssign2.default)(seq(p(node.test, _coderep.Precedence.LogicalOR, test), t("?"), p(node.consequent, _coderep.Precedence.Assignment, consequent), t(":"), p(node.alternate, _coderep.Precedence.Assignment, alternate)), {
        containsIn: containsIn,
        startsWithCurly: startsWithCurly,
        startsWithLetSquareBracket: startsWithLetSquareBracket,
        startsWithFunctionOrClass: startsWithFunctionOrClass
      });
    }
  }, {
    key: "reduceContinueStatement",
    value: function reduceContinueStatement(node) {
      return seq(t("continue"), node.label ? t(node.label) : empty(), semiOp());
    }
  }, {
    key: "reduceDataProperty",
    value: function reduceDataProperty(node, _ref27) {
      var name = _ref27.name;
      var expression = _ref27.expression;

      return seq(name, t(":"), getAssignmentExpr(expression));
    }
  }, {
    key: "reduceDebuggerStatement",
    value: function reduceDebuggerStatement(node) {
      return seq(t("debugger"), semiOp());
    }
  }, {
    key: "reduceDoWhileStatement",
    value: function reduceDoWhileStatement(node, _ref28) {
      var body = _ref28.body;
      var test = _ref28.test;

      return seq(t("do"), body, t("while"), paren(test), semiOp());
    }
  }, {
    key: "reduceEmptyStatement",
    value: function reduceEmptyStatement(node) {
      return semi();
    }
  }, {
    key: "reduceExpressionStatement",
    value: function reduceExpressionStatement(node, _ref29) {
      var expression = _ref29.expression;

      var needsParens = expression.startsWithCurly || expression.startsWithLetSquareBracket || expression.startsWithFunctionOrClass;
      return seq(needsParens ? paren(expression) : expression, semiOp());
    }
  }, {
    key: "reduceForInStatement",
    value: function reduceForInStatement(node, _ref30) {
      var left = _ref30.left;
      var right = _ref30.right;
      var body = _ref30.body;

      var leftP = left;
      switch (node.left.type) {
        case "VariableDeclaration":
          leftP = noIn(markContainsIn(left));
          break;
        case "AssignmentTargetIdentifier":
          if (node.left.name === "let") {
            leftP = paren(left);
          }
          break;
      }
      return (0, _objectAssign2.default)(seq(t("for"), paren(seq(leftP, t("in"), right)), body), { endsWithMissingElse: body.endsWithMissingElse });
    }
  }, {
    key: "reduceForOfStatement",
    value: function reduceForOfStatement(node, _ref31) {
      var left = _ref31.left;
      var right = _ref31.right;
      var body = _ref31.body;

      left = node.left.type === "VariableDeclaration" ? noIn(markContainsIn(left)) : left;
      return (0, _objectAssign2.default)(seq(t("for"), paren(seq(left.startsWithLet ? paren(left) : left, t("of"), p(node.right, _coderep.Precedence.Assignment, right))), body), { endsWithMissingElse: body.endsWithMissingElse });
    }
  }, {
    key: "reduceForStatement",
    value: function reduceForStatement(node, _ref32) {
      var init = _ref32.init;
      var test = _ref32.test;
      var update = _ref32.update;
      var body = _ref32.body;

      return (0, _objectAssign2.default)(seq(t("for"), paren(seq(init ? noIn(markContainsIn(init)) : empty(), semi(), test || empty(), semi(), update || empty())), body), {
        endsWithMissingElse: body.endsWithMissingElse
      });
    }
  }, {
    key: "reduceFunctionBody",
    value: function reduceFunctionBody(node, _ref33) {
      var directives = _ref33.directives;
      var statements = _ref33.statements;

      if (statements.length) {
        statements[0] = this.parenToAvoidBeingDirective(node.statements[0], statements[0]);
      }
      return seq.apply(undefined, _toConsumableArray(directives).concat(_toConsumableArray(statements)));
    }
  }, {
    key: "reduceFunctionDeclaration",
    value: function reduceFunctionDeclaration(node, _ref34) {
      var name = _ref34.name;
      var params = _ref34.params;
      var body = _ref34.body;

      return seq(t("function"), node.isGenerator ? t("*") : empty(), node.name.name === "*default*" ? empty() : name, paren(params), brace(body));
    }
  }, {
    key: "reduceFunctionExpression",
    value: function reduceFunctionExpression(node, _ref35) {
      var name = _ref35.name;
      var params = _ref35.params;
      var body = _ref35.body;

      var state = seq(t("function"), node.isGenerator ? t("*") : empty(), name ? name : empty(), paren(params), brace(body));
      state.startsWithFunctionOrClass = true;
      return state;
    }
  }, {
    key: "reduceFormalParameters",
    value: function reduceFormalParameters(node, _ref36) {
      var items = _ref36.items;
      var rest = _ref36.rest;

      return commaSep(items.concat(rest == null ? [] : [seq(t("..."), rest)]));
    }
  }, {
    key: "reduceArrowExpression",
    value: function reduceArrowExpression(node, _ref37) {
      var params = _ref37.params;
      var body = _ref37.body;

      if (node.params.rest != null || node.params.items.length !== 1 || node.params.items[0].type !== "BindingIdentifier") {
        params = paren(params);
      }
      var containsIn = false;
      if (node.body.type === "FunctionBody") {
        body = brace(body);
      } else if (body.startsWithCurly) {
        body = paren(body);
      } else if (body.containsIn) {
        containsIn = true;
      }
      return (0, _objectAssign2.default)(seq(params, t("=>"), p(node.body, _coderep.Precedence.Assignment, body)), { containsIn: containsIn });
    }
  }, {
    key: "reduceGetter",
    value: function reduceGetter(node, _ref38) {
      var name = _ref38.name;
      var body = _ref38.body;

      return seq(t("get"), name, paren(empty()), brace(body));
    }
  }, {
    key: "reduceIdentifierExpression",
    value: function reduceIdentifierExpression(node) {
      var a = t(node.name);
      if (node.name === "let") {
        a.startsWithLet = true;
      }
      return a;
    }
  }, {
    key: "reduceIfStatement",
    value: function reduceIfStatement(node, _ref39) {
      var test = _ref39.test;
      var consequent = _ref39.consequent;
      var alternate = _ref39.alternate;

      if (alternate && consequent.endsWithMissingElse) {
        consequent = brace(consequent);
      }
      return (0, _objectAssign2.default)(seq(t("if"), paren(test), consequent, alternate ? seq(t("else"), alternate) : empty()), { endsWithMissingElse: alternate ? alternate.endsWithMissingElse : true });
    }
  }, {
    key: "reduceImport",
    value: function reduceImport(node, _ref40) {
      var defaultBinding = _ref40.defaultBinding;
      var namedImports = _ref40.namedImports;

      var bindings = [];
      if (defaultBinding != null) {
        bindings.push(defaultBinding);
      }
      if (namedImports.length > 0) {
        bindings.push(brace(commaSep(namedImports)));
      }
      if (bindings.length === 0) {
        return seq(t("import"), t((0, _coderep.escapeStringLiteral)(node.moduleSpecifier)), semiOp());
      }
      return seq(t("import"), commaSep(bindings), t("from"), t((0, _coderep.escapeStringLiteral)(node.moduleSpecifier)), semiOp());
    }
  }, {
    key: "reduceImportNamespace",
    value: function reduceImportNamespace(node, _ref41) {
      var defaultBinding = _ref41.defaultBinding;
      var namespaceBinding = _ref41.namespaceBinding;

      return seq(t("import"), defaultBinding == null ? empty() : seq(defaultBinding, t(",")), t("*"), t("as"), namespaceBinding, t("from"), t((0, _coderep.escapeStringLiteral)(node.moduleSpecifier)), semiOp());
    }
  }, {
    key: "reduceImportSpecifier",
    value: function reduceImportSpecifier(node, _ref42) {
      var binding = _ref42.binding;

      if (node.name == null) return binding;
      return seq(t(node.name), t("as"), binding);
    }
  }, {
    key: "reduceExportAllFrom",
    value: function reduceExportAllFrom(node) {
      return seq(t("export"), t("*"), t("from"), t((0, _coderep.escapeStringLiteral)(node.moduleSpecifier)), semiOp());
    }
  }, {
    key: "reduceExportFrom",
    value: function reduceExportFrom(node, _ref43) {
      var namedExports = _ref43.namedExports;

      return seq(t("export"), brace(commaSep(namedExports)), t("from"), t((0, _coderep.escapeStringLiteral)(node.moduleSpecifier)), semiOp());
    }
  }, {
    key: "reduceExportLocals",
    value: function reduceExportLocals(node, _ref44) {
      var namedExports = _ref44.namedExports;

      return seq(t("export"), brace(commaSep(namedExports)), semiOp());
    }
  }, {
    key: "reduceExport",
    value: function reduceExport(node, _ref45) {
      var declaration = _ref45.declaration;

      switch (node.declaration.type) {
        case "FunctionDeclaration":
        case "ClassDeclaration":
          break;
        default:
          declaration = seq(declaration, semiOp());
      }
      return seq(t("export"), declaration);
    }
  }, {
    key: "reduceExportDefault",
    value: function reduceExportDefault(node, _ref46) {
      var body = _ref46.body;

      body = body.startsWithFunctionOrClass ? paren(body) : body;
      switch (node.body.type) {
        case "FunctionDeclaration":
        case "ClassDeclaration":
          return seq(t("export default"), body);
        default:
          return seq(t("export default"), p(node.body, _coderep.Precedence.Assignment, body), semiOp());
      }
    }
  }, {
    key: "reduceExportFromSpecifier",
    value: function reduceExportFromSpecifier(node) {
      if (node.exportedName == null) return t(node.name);
      return seq(t(node.name), t("as"), t(node.exportedName));
    }
  }, {
    key: "reduceExportLocalSpecifier",
    value: function reduceExportLocalSpecifier(node, _ref47) {
      var name = _ref47.name;

      if (node.exportedName == null) return name;
      return seq(name, t("as"), t(node.exportedName));
    }
  }, {
    key: "reduceLabeledStatement",
    value: function reduceLabeledStatement(node, _ref48) {
      var body = _ref48.body;

      return (0, _objectAssign2.default)(seq(t(node.label + ":"), body), { endsWithMissingElse: body.endsWithMissingElse });
    }
  }, {
    key: "reduceLiteralBooleanExpression",
    value: function reduceLiteralBooleanExpression(node) {
      return t(node.value.toString());
    }
  }, {
    key: "reduceLiteralNullExpression",
    value: function reduceLiteralNullExpression(node) {
      return t("null");
    }
  }, {
    key: "reduceLiteralInfinityExpression",
    value: function reduceLiteralInfinityExpression(node) {
      return t("2e308");
    }
  }, {
    key: "reduceLiteralNumericExpression",
    value: function reduceLiteralNumericExpression(node) {
      return new _coderep.NumberCodeRep(node.value);
    }
  }, {
    key: "reduceLiteralRegExpExpression",
    value: function reduceLiteralRegExpExpression(node) {
      return t("/" + node.pattern + "/" + (node.global ? 'g' : '') + (node.ignoreCase ? 'i' : '') + (node.multiLine ? 'm' : '') + (node.unicode ? 'u' : '') + (node.sticky ? 'y' : ''));
    }
  }, {
    key: "reduceLiteralStringExpression",
    value: function reduceLiteralStringExpression(node) {
      return t((0, _coderep.escapeStringLiteral)(node.value));
    }
  }, {
    key: "reduceMethod",
    value: function reduceMethod(node, _ref49) {
      var name = _ref49.name;
      var params = _ref49.params;
      var body = _ref49.body;

      return seq(node.isGenerator ? t("*") : empty(), name, paren(params), brace(body));
    }
  }, {
    key: "reduceModule",
    value: function reduceModule(node, _ref50) {
      var directives = _ref50.directives;
      var items = _ref50.items;

      if (items.length) {
        items[0] = this.parenToAvoidBeingDirective(node.items[0], items[0]);
      }
      return seq.apply(undefined, _toConsumableArray(directives).concat(_toConsumableArray(items)));
    }
  }, {
    key: "reduceNewExpression",
    value: function reduceNewExpression(node, _ref51) {
      var callee = _ref51.callee;
      var args = _ref51.arguments;

      var calleeRep = (0, _coderep.getPrecedence)(node.callee) == _coderep.Precedence.Call ? paren(callee) : p(node.callee, (0, _coderep.getPrecedence)(node), callee);
      return seq(t("new"), calleeRep, args.length === 0 ? empty() : paren(commaSep(args)));
    }
  }, {
    key: "reduceNewTargetExpression",
    value: function reduceNewTargetExpression() {
      return t("new.target");
    }
  }, {
    key: "reduceObjectExpression",
    value: function reduceObjectExpression(node, _ref52) {
      var properties = _ref52.properties;

      var state = brace(commaSep(properties));
      state.startsWithCurly = true;
      return state;
    }
  }, {
    key: "reduceUpdateExpression",
    value: function reduceUpdateExpression(node, _ref53) {
      var operand = _ref53.operand;

      if (node.isPrefix) {
        return this.reduceUnaryExpression.apply(this, arguments);
      } else {
        return (0, _objectAssign2.default)(seq(p(node.operand, _coderep.Precedence.New, operand), t(node.operator)), {
          startsWithCurly: operand.startsWithCurly,
          startsWithLetSquareBracket: operand.startsWithLetSquareBracket,
          startsWithFunctionOrClass: operand.startsWithFunctionOrClass
        });
      }
    }
  }, {
    key: "reduceUnaryExpression",
    value: function reduceUnaryExpression(node, _ref54) {
      var operand = _ref54.operand;

      return seq(t(node.operator), p(node.operand, (0, _coderep.getPrecedence)(node), operand));
    }
  }, {
    key: "reduceReturnStatement",
    value: function reduceReturnStatement(node, _ref55) {
      var expression = _ref55.expression;

      return seq(t("return"), expression || empty(), semiOp());
    }
  }, {
    key: "reduceScript",
    value: function reduceScript(node, _ref56) {
      var directives = _ref56.directives;
      var statements = _ref56.statements;

      if (statements.length) {
        statements[0] = this.parenToAvoidBeingDirective(node.statements[0], statements[0]);
      }
      return seq.apply(undefined, _toConsumableArray(directives).concat(_toConsumableArray(statements)));
    }
  }, {
    key: "reduceSetter",
    value: function reduceSetter(node, _ref57) {
      var name = _ref57.name;
      var param = _ref57.param;
      var body = _ref57.body;

      return seq(t("set"), name, paren(param), brace(body));
    }
  }, {
    key: "reduceShorthandProperty",
    value: function reduceShorthandProperty(node, _ref58) {
      var name = _ref58.name;

      return name;
    }
  }, {
    key: "reduceStaticMemberAssignmentTarget",
    value: function reduceStaticMemberAssignmentTarget(node, _ref59) {
      var object = _ref59.object;

      var state = seq(p(node.object, (0, _coderep.getPrecedence)(node), object), t("."), t(node.property));
      state.startsWithLet = object.startsWithLet;
      state.startsWithCurly = object.startsWithCurly;
      state.startsWithLetSquareBracket = object.startsWithLetSquareBracket;
      state.startsWithFunctionOrClass = object.startsWithFunctionOrClass;
      return state;
    }
  }, {
    key: "reduceStaticMemberExpression",
    value: function reduceStaticMemberExpression(node, _ref60) {
      var object = _ref60.object;

      var state = seq(p(node.object, (0, _coderep.getPrecedence)(node), object), t("."), t(node.property));
      state.startsWithLet = object.startsWithLet;
      state.startsWithCurly = object.startsWithCurly;
      state.startsWithLetSquareBracket = object.startsWithLetSquareBracket;
      state.startsWithFunctionOrClass = object.startsWithFunctionOrClass;
      return state;
    }
  }, {
    key: "reduceStaticPropertyName",
    value: function reduceStaticPropertyName(node) {
      if (_esutils.keyword.isIdentifierNameES6(node.value)) {
        return t(node.value);
      }
      var n = parseFloat(node.value);
      if (n >= 0 && n.toString() === node.value) {
        return new _coderep.NumberCodeRep(n);
      }
      return t((0, _coderep.escapeStringLiteral)(node.value));
    }
  }, {
    key: "reduceSuper",
    value: function reduceSuper() {
      return t("super");
    }
  }, {
    key: "reduceSwitchCase",
    value: function reduceSwitchCase(node, _ref61) {
      var test = _ref61.test;
      var consequent = _ref61.consequent;

      return seq(t("case"), test, t(":"), seq.apply(undefined, _toConsumableArray(consequent)));
    }
  }, {
    key: "reduceSwitchDefault",
    value: function reduceSwitchDefault(node, _ref62) {
      var consequent = _ref62.consequent;

      return seq(t("default:"), seq.apply(undefined, _toConsumableArray(consequent)));
    }
  }, {
    key: "reduceSwitchStatement",
    value: function reduceSwitchStatement(node, _ref63) {
      var discriminant = _ref63.discriminant;
      var cases = _ref63.cases;

      return seq(t("switch"), paren(discriminant), brace(seq.apply(undefined, _toConsumableArray(cases))));
    }
  }, {
    key: "reduceSwitchStatementWithDefault",
    value: function reduceSwitchStatementWithDefault(node, _ref64) {
      var discriminant = _ref64.discriminant;
      var preDefaultCases = _ref64.preDefaultCases;
      var defaultCase = _ref64.defaultCase;
      var postDefaultCases = _ref64.postDefaultCases;

      return seq(t("switch"), paren(discriminant), brace(seq.apply(undefined, _toConsumableArray(preDefaultCases).concat([defaultCase], _toConsumableArray(postDefaultCases)))));
    }
  }, {
    key: "reduceTemplateExpression",
    value: function reduceTemplateExpression(node, _ref65) {
      var tag = _ref65.tag;
      var elements = _ref65.elements;

      var state = node.tag == null ? empty() : p(node.tag, (0, _coderep.getPrecedence)(node), tag);
      var templateData = "";
      state = seq(state, t("`"));
      for (var i = 0, l = node.elements.length; i < l; ++i) {
        if (node.elements[i].type === "TemplateElement") {
          var d = "";
          if (i > 0) d += "}";
          d += node.elements[i].rawValue;
          if (i < l - 1) d += "${";
          state = seq(state, t(d));
        } else {
          state = seq(state, elements[i]);
        }
      }
      state = seq(state, t("`"));
      if (node.tag != null) {
        state.startsWithCurly = tag.startsWithCurly;
        state.startsWithLetSquareBracket = tag.startsWithLetSquareBracket;
        state.startsWithFunctionOrClass = tag.startsWithFunctionOrClass;
      }
      return state;
    }
  }, {
    key: "reduceTemplateElement",
    value: function reduceTemplateElement(node) {
      return t(node.rawValue);
    }
  }, {
    key: "reduceThisExpression",
    value: function reduceThisExpression(node) {
      return t("this");
    }
  }, {
    key: "reduceThrowStatement",
    value: function reduceThrowStatement(node, _ref66) {
      var expression = _ref66.expression;

      return seq(t("throw"), expression, semiOp());
    }
  }, {
    key: "reduceTryCatchStatement",
    value: function reduceTryCatchStatement(node, _ref67) {
      var body = _ref67.body;
      var catchClause = _ref67.catchClause;

      return seq(t("try"), body, catchClause);
    }
  }, {
    key: "reduceTryFinallyStatement",
    value: function reduceTryFinallyStatement(node, _ref68) {
      var body = _ref68.body;
      var catchClause = _ref68.catchClause;
      var finalizer = _ref68.finalizer;

      return seq(t("try"), body, catchClause || empty(), t("finally"), finalizer);
    }
  }, {
    key: "reduceYieldExpression",
    value: function reduceYieldExpression(node, _ref69) {
      var expression = _ref69.expression;

      if (node.expression == null) return t("yield");
      return seq(t("yield"), p(node.expression, (0, _coderep.getPrecedence)(node), expression));
    }
  }, {
    key: "reduceYieldGeneratorExpression",
    value: function reduceYieldGeneratorExpression(node, _ref70) {
      var expression = _ref70.expression;

      return seq(t("yield"), t("*"), p(node.expression, (0, _coderep.getPrecedence)(node), expression));
    }
  }, {
    key: "reduceDirective",
    value: function reduceDirective(node) {
      var delim = node.rawValue.match(/(^|[^\\])(\\\\)*"/) ? "'" : '"';
      return seq(t(delim + node.rawValue + delim), semiOp());
    }
  }, {
    key: "reduceVariableDeclaration",
    value: function reduceVariableDeclaration(node, _ref71) {
      var declarators = _ref71.declarators;

      return seq(t(node.kind), commaSep(declarators));
    }
  }, {
    key: "reduceVariableDeclarationStatement",
    value: function reduceVariableDeclarationStatement(node, _ref72) {
      var declaration = _ref72.declaration;

      return seq(declaration, semiOp());
    }
  }, {
    key: "reduceVariableDeclarator",
    value: function reduceVariableDeclarator(node, _ref73) {
      var binding = _ref73.binding;
      var init = _ref73.init;

      var containsIn = init && init.containsIn && !init.containsGroup;
      if (init) {
        if (init.containsGroup) {
          init = paren(init);
        } else {
          init = markContainsIn(init);
        }
      }
      return (0, _objectAssign2.default)(init == null ? binding : seq(binding, t("="), init), { containsIn: containsIn });
    }
  }, {
    key: "reduceWhileStatement",
    value: function reduceWhileStatement(node, _ref74) {
      var test = _ref74.test;
      var body = _ref74.body;

      return (0, _objectAssign2.default)(seq(t("while"), paren(test), body), { endsWithMissingElse: body.endsWithMissingElse });
    }
  }, {
    key: "reduceWithStatement",
    value: function reduceWithStatement(node, _ref75) {
      var object = _ref75.object;
      var body = _ref75.body;

      return (0, _objectAssign2.default)(seq(t("with"), paren(object), body), { endsWithMissingElse: body.endsWithMissingElse });
    }
  }]);

  return MinimalCodeGen;
}();

exports.default = MinimalCodeGen;