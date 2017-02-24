"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
    key: "reduceCompoundAssignmentExpression",
    value: function reduceCompoundAssignmentExpression(node, _ref4) {
      var binding = _ref4.binding;
      var expression = _ref4.expression;

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
    value: function reduceBinaryExpression(node, _ref5) {
      var left = _ref5.left;
      var right = _ref5.right;

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
    value: function reduceBindingWithDefault(node, _ref6) {
      var binding = _ref6.binding;
      var init = _ref6.init;

      return seq(binding, t("="), init);
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
    key: "reduceArrayBinding",
    value: function reduceArrayBinding(node, _ref7) {
      var elements = _ref7.elements;
      var restElement = _ref7.restElement;

      var content = undefined;
      if (elements.length === 0) {
        content = restElement == null ? empty() : seq(t("..."), restElement);
      } else {
        elements = elements.concat(restElement == null ? [] : [seq(t("..."), restElement)]);
        content = commaSep(elements.map(getAssignmentExpr));
        if (elements.length > 0 && elements[elements.length - 1] == null) {
          content = seq(content, t(","));
        }
      }
      return bracket(content);
    }
  }, {
    key: "reduceObjectBinding",
    value: function reduceObjectBinding(node, _ref8) {
      var properties = _ref8.properties;

      var state = brace(commaSep(properties));
      state.startsWithCurly = true;
      return state;
    }
  }, {
    key: "reduceBindingPropertyIdentifier",
    value: function reduceBindingPropertyIdentifier(node, _ref9) {
      var binding = _ref9.binding;
      var init = _ref9.init;

      if (node.init == null) return binding;
      return seq(binding, t("="), init);
    }
  }, {
    key: "reduceBindingPropertyProperty",
    value: function reduceBindingPropertyProperty(node, _ref10) {
      var name = _ref10.name;
      var binding = _ref10.binding;

      return seq(name, t(":"), binding);
    }
  }, {
    key: "reduceBlock",
    value: function reduceBlock(node, _ref11) {
      var statements = _ref11.statements;

      return brace(seq.apply(undefined, _toConsumableArray(statements)));
    }
  }, {
    key: "reduceBlockStatement",
    value: function reduceBlockStatement(node, _ref12) {
      var block = _ref12.block;

      return block;
    }
  }, {
    key: "reduceBreakStatement",
    value: function reduceBreakStatement(node, _ref13) {
      var label = _ref13.label;

      return seq(t("break"), label ? t(label) : empty(), semiOp());
    }
  }, {
    key: "reduceCallExpression",
    value: function reduceCallExpression(node, _ref14) {
      var callee = _ref14.callee;
      var args = _ref14.arguments;

      return (0, _objectAssign2.default)(seq(p(node.callee, (0, _coderep.getPrecedence)(node), callee), paren(commaSep(args))), {
        startsWithCurly: callee.startsWithCurly,
        startsWithLetSquareBracket: callee.startsWithLetSquareBracket,
        startsWithFunctionOrClass: callee.startsWithFunctionOrClass
      });
    }
  }, {
    key: "reduceCatchClause",
    value: function reduceCatchClause(node, _ref15) {
      var binding = _ref15.binding;
      var body = _ref15.body;

      return seq(t("catch"), paren(binding), body);
    }
  }, {
    key: "reduceClassDeclaration",
    value: function reduceClassDeclaration(node, _ref16) {
      var name = _ref16.name;
      var _super = _ref16.super;
      var elements = _ref16.elements;

      var state = seq(t("class"), name);
      if (_super != null) {
        state = seq(state, t("extends"), _super);
      }
      state = seq.apply(undefined, [state, t("{")].concat(_toConsumableArray(elements), [t("}")]));
      return state;
    }
  }, {
    key: "reduceClassExpression",
    value: function reduceClassExpression(node, _ref17) {
      var name = _ref17.name;
      var _super = _ref17.super;
      var elements = _ref17.elements;

      var state = t("class");
      if (name != null) {
        state = seq(state, name);
      }
      if (_super != null) {
        state = seq(state, t("extends"), _super);
      }
      state = seq.apply(undefined, [state, t("{")].concat(_toConsumableArray(elements), [t("}")]));
      state.startsWithFunctionOrClass = true;
      return state;
    }
  }, {
    key: "reduceClassElement",
    value: function reduceClassElement(node, _ref18) {
      var method = _ref18.method;

      if (!node.isStatic) return method;
      return seq(t("static"), method);
    }
  }, {
    key: "reduceComputedMemberExpression",
    value: function reduceComputedMemberExpression(node, _ref19) {
      var object = _ref19.object;
      var expression = _ref19.expression;

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
    value: function reduceComputedPropertyName(node, _ref20) {
      var expression = _ref20.expression;

      return bracket(expression);
    }
  }, {
    key: "reduceConditionalExpression",
    value: function reduceConditionalExpression(node, _ref21) {
      var test = _ref21.test;
      var consequent = _ref21.consequent;
      var alternate = _ref21.alternate;

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
    value: function reduceContinueStatement(node, _ref22) {
      var label = _ref22.label;

      return seq(t("continue"), label ? t(label) : empty(), semiOp());
    }
  }, {
    key: "reduceDataProperty",
    value: function reduceDataProperty(node, _ref23) {
      var name = _ref23.name;
      var expression = _ref23.expression;

      return seq(name, t(":"), getAssignmentExpr(expression));
    }
  }, {
    key: "reduceDebuggerStatement",
    value: function reduceDebuggerStatement(node) {
      return seq(t("debugger"), semiOp());
    }
  }, {
    key: "reduceDoWhileStatement",
    value: function reduceDoWhileStatement(node, _ref24) {
      var body = _ref24.body;
      var test = _ref24.test;

      return seq(t("do"), body, t("while"), paren(test), semiOp());
    }
  }, {
    key: "reduceEmptyStatement",
    value: function reduceEmptyStatement(node) {
      return semi();
    }
  }, {
    key: "reduceExpressionStatement",
    value: function reduceExpressionStatement(node, _ref25) {
      var expression = _ref25.expression;

      var needsParens = expression.startsWithCurly || expression.startsWithLetSquareBracket || expression.startsWithFunctionOrClass;
      return seq(needsParens ? paren(expression) : expression, semiOp());
    }
  }, {
    key: "reduceForInStatement",
    value: function reduceForInStatement(node, _ref26) {
      var left = _ref26.left;
      var right = _ref26.right;
      var body = _ref26.body;

      var leftP = left;
      switch (node.left.type) {
        case "VariableDeclaration":
          leftP = noIn(markContainsIn(left));
          break;
        case "BindingIdentifier":
          if (node.left.name === "let") {
            leftP = paren(left);
          }
          break;
      }
      return (0, _objectAssign2.default)(seq(t("for"), paren(seq(leftP, t("in"), right)), body), { endsWithMissingElse: body.endsWithMissingElse });
    }
  }, {
    key: "reduceForOfStatement",
    value: function reduceForOfStatement(node, _ref27) {
      var left = _ref27.left;
      var right = _ref27.right;
      var body = _ref27.body;

      left = node.left.type === "VariableDeclaration" ? noIn(markContainsIn(left)) : left;
      return (0, _objectAssign2.default)(seq(t("for"), paren(seq(left.startsWithLet ? paren(left) : left, t("of"), right)), body), { endsWithMissingElse: body.endsWithMissingElse });
    }
  }, {
    key: "reduceForStatement",
    value: function reduceForStatement(node, _ref28) {
      var init = _ref28.init;
      var test = _ref28.test;
      var update = _ref28.update;
      var body = _ref28.body;

      return (0, _objectAssign2.default)(seq(t("for"), paren(seq(init ? noIn(markContainsIn(init)) : empty(), semi(), test || empty(), semi(), update || empty())), body), {
        endsWithMissingElse: body.endsWithMissingElse
      });
    }
  }, {
    key: "reduceFunctionBody",
    value: function reduceFunctionBody(node, _ref29) {
      var directives = _ref29.directives;
      var statements = _ref29.statements;

      if (statements.length) {
        statements[0] = this.parenToAvoidBeingDirective(node.statements[0], statements[0]);
      }
      return seq.apply(undefined, _toConsumableArray(directives).concat(_toConsumableArray(statements)));
    }
  }, {
    key: "reduceFunctionDeclaration",
    value: function reduceFunctionDeclaration(node, _ref30) {
      var name = _ref30.name;
      var params = _ref30.params;
      var body = _ref30.body;

      return seq(t("function"), node.isGenerator ? t("*") : empty(), node.name.name === "*default*" ? empty() : name, paren(params), brace(body));
    }
  }, {
    key: "reduceFunctionExpression",
    value: function reduceFunctionExpression(node, _ref31) {
      var name = _ref31.name;
      var params = _ref31.params;
      var body = _ref31.body;

      var state = seq(t("function"), node.isGenerator ? t("*") : empty(), name ? name : empty(), paren(params), brace(body));
      state.startsWithFunctionOrClass = true;
      return state;
    }
  }, {
    key: "reduceFormalParameters",
    value: function reduceFormalParameters(node, _ref32) {
      var items = _ref32.items;
      var rest = _ref32.rest;

      return commaSep(items.concat(rest == null ? [] : [seq(t("..."), rest)]));
    }
  }, {
    key: "reduceArrowExpression",
    value: function reduceArrowExpression(node, _ref33) {
      var params = _ref33.params;
      var body = _ref33.body;

      if (node.params.rest != null || node.params.items.length !== 1 || node.params.items[0].type !== "BindingIdentifier") {
        params = paren(params);
      }
      if (node.body.type === "FunctionBody") {
        body = brace(body);
      } else if (body.startsWithCurly) {
        body = paren(body);
      }
      return seq(params, t("=>"), p(node.body, _coderep.Precedence.Assignment, body));
    }
  }, {
    key: "reduceGetter",
    value: function reduceGetter(node, _ref34) {
      var name = _ref34.name;
      var body = _ref34.body;

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
    value: function reduceIfStatement(node, _ref35) {
      var test = _ref35.test;
      var consequent = _ref35.consequent;
      var alternate = _ref35.alternate;

      if (alternate && consequent.endsWithMissingElse) {
        consequent = brace(consequent);
      }
      return (0, _objectAssign2.default)(seq(t("if"), paren(test), consequent, alternate ? seq(t("else"), alternate) : empty()), { endsWithMissingElse: alternate ? alternate.endsWithMissingElse : true });
    }
  }, {
    key: "reduceImport",
    value: function reduceImport(node, _ref36) {
      var defaultBinding = _ref36.defaultBinding;
      var namedImports = _ref36.namedImports;

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
    value: function reduceImportNamespace(node, _ref37) {
      var defaultBinding = _ref37.defaultBinding;
      var namespaceBinding = _ref37.namespaceBinding;

      return seq(t("import"), defaultBinding == null ? empty() : seq(defaultBinding, t(",")), t("*"), t("as"), namespaceBinding, t("from"), t((0, _coderep.escapeStringLiteral)(node.moduleSpecifier)), semiOp());
    }
  }, {
    key: "reduceImportSpecifier",
    value: function reduceImportSpecifier(node, _ref38) {
      var binding = _ref38.binding;

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
    value: function reduceExportFrom(node, _ref39) {
      var namedExports = _ref39.namedExports;

      return seq(t("export"), brace(commaSep(namedExports)), node.moduleSpecifier == null ? empty() : seq(t("from"), t((0, _coderep.escapeStringLiteral)(node.moduleSpecifier)), semiOp()));
    }
  }, {
    key: "reduceExport",
    value: function reduceExport(node, _ref40) {
      var declaration = _ref40.declaration;

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
    value: function reduceExportDefault(node, _ref41) {
      var body = _ref41.body;

      body = body.startsWithFunctionOrClass ? paren(body) : body;
      switch (node.body.type) {
        case "FunctionDeclaration":
        case "ClassDeclaration":
          break;
        default:
          body = seq(body, semiOp());
      }
      return seq(t("export default"), body);
    }
  }, {
    key: "reduceExportSpecifier",
    value: function reduceExportSpecifier(node) {
      if (node.name == null) return t(node.exportedName);
      return seq(t(node.name), t("as"), t(node.exportedName));
    }
  }, {
    key: "reduceLabeledStatement",
    value: function reduceLabeledStatement(node, _ref42) {
      var label = _ref42.label;
      var body = _ref42.body;

      return (0, _objectAssign2.default)(seq(t(label + ":"), body), { endsWithMissingElse: body.endsWithMissingElse });
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
      return t("/" + node.pattern + "/" + node.flags);
    }
  }, {
    key: "reduceLiteralStringExpression",
    value: function reduceLiteralStringExpression(node) {
      return t((0, _coderep.escapeStringLiteral)(node.value));
    }
  }, {
    key: "reduceMethod",
    value: function reduceMethod(node, _ref43) {
      var name = _ref43.name;
      var params = _ref43.params;
      var body = _ref43.body;

      return seq(node.isGenerator ? t("*") : empty(), name, paren(params), brace(body));
    }
  }, {
    key: "reduceModule",
    value: function reduceModule(node, _ref44) {
      var directives = _ref44.directives;
      var items = _ref44.items;

      if (items.length) {
        items[0] = this.parenToAvoidBeingDirective(node.items[0], items[0]);
      }
      return seq.apply(undefined, _toConsumableArray(directives).concat(_toConsumableArray(items)));
    }
  }, {
    key: "reduceNewExpression",
    value: function reduceNewExpression(node, _ref45) {
      var callee = _ref45.callee;
      var args = _ref45.arguments;

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
    value: function reduceObjectExpression(node, _ref46) {
      var properties = _ref46.properties;

      var state = brace(commaSep(properties));
      state.startsWithCurly = true;
      return state;
    }
  }, {
    key: "reduceUpdateExpression",
    value: function reduceUpdateExpression(node, _ref47) {
      var operand = _ref47.operand;

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
    value: function reduceUnaryExpression(node, _ref48) {
      var operand = _ref48.operand;

      return seq(t(node.operator), p(node.operand, (0, _coderep.getPrecedence)(node), operand));
    }
  }, {
    key: "reduceReturnStatement",
    value: function reduceReturnStatement(node, _ref49) {
      var expression = _ref49.expression;

      return seq(t("return"), expression || empty(), semiOp());
    }
  }, {
    key: "reduceScript",
    value: function reduceScript(node, _ref50) {
      var directives = _ref50.directives;
      var statements = _ref50.statements;

      if (statements.length) {
        statements[0] = this.parenToAvoidBeingDirective(node.statements[0], statements[0]);
      }
      return seq.apply(undefined, _toConsumableArray(directives).concat(_toConsumableArray(statements)));
    }
  }, {
    key: "reduceSetter",
    value: function reduceSetter(node, _ref51) {
      var name = _ref51.name;
      var param = _ref51.param;
      var body = _ref51.body;

      return seq(t("set"), name, paren(param), brace(body));
    }
  }, {
    key: "reduceShorthandProperty",
    value: function reduceShorthandProperty(node) {
      return t(node.name);
    }
  }, {
    key: "reduceStaticMemberExpression",
    value: function reduceStaticMemberExpression(node, _ref52) {
      var object = _ref52.object;
      var property = _ref52.property;

      var state = seq(p(node.object, (0, _coderep.getPrecedence)(node), object), t("."), t(property));
      state.startsWithLet = object.startsWithLet;
      state.startsWithCurly = object.startsWithCurly;
      state.startsWithLetSquareBracket = object.startsWithLetSquareBracket;
      state.startsWithFunctionOrClass = object.startsWithFunctionOrClass;
      return state;
    }
  }, {
    key: "reduceStaticPropertyName",
    value: function reduceStaticPropertyName(node) {
      var n;
      if (_esutils.keyword.isIdentifierNameES6(node.value)) {
        return t(node.value);
      } else if (n = parseFloat(node.value), n === n) {
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
    value: function reduceSwitchCase(node, _ref53) {
      var test = _ref53.test;
      var consequent = _ref53.consequent;

      return seq(t("case"), test, t(":"), seq.apply(undefined, _toConsumableArray(consequent)));
    }
  }, {
    key: "reduceSwitchDefault",
    value: function reduceSwitchDefault(node, _ref54) {
      var consequent = _ref54.consequent;

      return seq(t("default:"), seq.apply(undefined, _toConsumableArray(consequent)));
    }
  }, {
    key: "reduceSwitchStatement",
    value: function reduceSwitchStatement(node, _ref55) {
      var discriminant = _ref55.discriminant;
      var cases = _ref55.cases;

      return seq(t("switch"), paren(discriminant), brace(seq.apply(undefined, _toConsumableArray(cases))));
    }
  }, {
    key: "reduceSwitchStatementWithDefault",
    value: function reduceSwitchStatementWithDefault(node, _ref56) {
      var discriminant = _ref56.discriminant;
      var preDefaultCases = _ref56.preDefaultCases;
      var defaultCase = _ref56.defaultCase;
      var postDefaultCases = _ref56.postDefaultCases;

      return seq(t("switch"), paren(discriminant), brace(seq.apply(undefined, _toConsumableArray(preDefaultCases).concat([defaultCase], _toConsumableArray(postDefaultCases)))));
    }
  }, {
    key: "reduceTemplateExpression",
    value: function reduceTemplateExpression(node, _ref57) {
      var tag = _ref57.tag;
      var elements = _ref57.elements;

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
    value: function reduceThrowStatement(node, _ref58) {
      var expression = _ref58.expression;

      return seq(t("throw"), expression, semiOp());
    }
  }, {
    key: "reduceTryCatchStatement",
    value: function reduceTryCatchStatement(node, _ref59) {
      var body = _ref59.body;
      var catchClause = _ref59.catchClause;

      return seq(t("try"), body, catchClause);
    }
  }, {
    key: "reduceTryFinallyStatement",
    value: function reduceTryFinallyStatement(node, _ref60) {
      var body = _ref60.body;
      var catchClause = _ref60.catchClause;
      var finalizer = _ref60.finalizer;

      return seq(t("try"), body, catchClause || empty(), t("finally"), finalizer);
    }
  }, {
    key: "reduceYieldExpression",
    value: function reduceYieldExpression(node, _ref61) {
      var expression = _ref61.expression;

      if (node.expression == null) return t("yield");
      return seq(t("yield"), p(node.expression, (0, _coderep.getPrecedence)(node), expression));
    }
  }, {
    key: "reduceYieldGeneratorExpression",
    value: function reduceYieldGeneratorExpression(node, _ref62) {
      var expression = _ref62.expression;

      return seq(t("yield"), t("*"), p(node.expression, (0, _coderep.getPrecedence)(node), expression));
    }
  }, {
    key: "reduceDirective",
    value: function reduceDirective(node) {
      var delim = /^(?:[^"\\]|\\.)*$/.test(node.rawValue) ? "\"" : "'";
      return seq(t(delim + node.rawValue + delim), semiOp());
    }
  }, {
    key: "reduceVariableDeclaration",
    value: function reduceVariableDeclaration(node, _ref63) {
      var declarators = _ref63.declarators;

      return seq(t(node.kind), commaSep(declarators));
    }
  }, {
    key: "reduceVariableDeclarationStatement",
    value: function reduceVariableDeclarationStatement(node, _ref64) {
      var declaration = _ref64.declaration;

      return seq(declaration, semiOp());
    }
  }, {
    key: "reduceVariableDeclarator",
    value: function reduceVariableDeclarator(node, _ref65) {
      var binding = _ref65.binding;
      var init = _ref65.init;

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
    value: function reduceWhileStatement(node, _ref66) {
      var test = _ref66.test;
      var body = _ref66.body;

      return (0, _objectAssign2.default)(seq(t("while"), paren(test), body), { endsWithMissingElse: body.endsWithMissingElse });
    }
  }, {
    key: "reduceWithStatement",
    value: function reduceWithStatement(node, _ref67) {
      var object = _ref67.object;
      var body = _ref67.body;

      return (0, _objectAssign2.default)(seq(t("with"), paren(object), body), { endsWithMissingElse: body.endsWithMissingElse });
    }
  }]);

  return MinimalCodeGen;
}();

exports.default = MinimalCodeGen;