"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormattedCodeGen = exports.ExtensibleCodeGen = exports.Sep = undefined;

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _esutils = require("esutils");

var _coderep = require("./coderep");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function empty() {
  return new _coderep.Empty();
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

function isEmpty(codeRep) {
  return codeRep instanceof _coderep.Empty || codeRep instanceof Linebreak || codeRep instanceof _coderep.Seq && codeRep.children.every(isEmpty);
}

var Sep = {};
var separatorNames = ["ARRAY_EMPTY", "ARRAY_BEFORE_COMMA", "ARRAY_AFTER_COMMA", "SPREAD", "BEFORE_DEFAULT_EQUALS", "AFTER_DEFAULT_EQUALS", "REST", "OBJECT_BEFORE_COMMA", "OBJECT_AFTER_COMMA", "BEFORE_PROP", "AFTER_PROP", "BEFORE_JUMP_LABEL", "ARGS_BEFORE_COMMA", "ARGS_AFTER_COMMA", "CALL", "BEFORE_CATCH_BINDING", "AFTER_CATCH_BINDING", "BEFORE_CLASS_NAME", "BEFORE_EXTENDS", "AFTER_EXTENDS", "BEFORE_CLASS_DECLARATION_ELEMENTS", "BEFORE_CLASS_EXPRESSION_ELEMENTS", "AFTER_STATIC", "BEFORE_CLASS_ELEMENT", "AFTER_CLASS_ELEMENT", "BEFORE_TERNARY_QUESTION", "AFTER_TERNARY_QUESTION", "BEFORE_TERNARY_COLON", "AFTER_TERNARY_COLON", "COMPUTED_MEMBER_EXPRESSION", "AFTER_DO", "BEFORE_DOWHILE_WHILE", "AFTER_DOWHILE_WHILE", "AFTER_FORIN_FOR", "BEFORE_FORIN_IN", "AFTER_FORIN_FOR", "BEFORE_FORIN_BODY", "AFTER_FOROF_FOR", "BEFORE_FOROF_OF", "AFTER_FOROF_FOR", "BEFORE_FOROF_BODY", "AFTER_FOR_FOR", "BEFORE_FOR_INIT", "AFTER_FOR_INIT", "EMPTY_FOR_INIT", "BEFORE_FOR_TEST", "AFTER_FOR_TEST", "EMPTY_FOR_TEST", "BEFORE_FOR_UPDATE", "AFTER_FOR_UPDATE", "EMPTY_FOR_UPDATE", "BEFORE_FOR_BODY", "BEFORE_GENERATOR_STAR", "AFTER_GENERATOR_STAR", "BEFORE_FUNCTION_PARAMS", "BEFORE_FUNCTION_DECLARATION_BODY", "BEFORE_FUNCTION_EXPRESSION_BODY", "AFTER_FUNCTION_DIRECTIVES", "BEFORE_ARROW", "AFTER_ARROW", "AFTER_GET", "BEFORE_GET_PARAMS", "BEFORE_GET_BODY", "AFTER_IF", "AFTER_IF_TEST", "BEFORE_ELSE", "AFTER_ELSE", "PARAMETER_BEFORE_COMMA", "PARAMETER_AFTER_COMMA", "NAMED_IMPORT_BEFORE_COMMA", "NAMED_IMPORT_AFTER_COMMA", "IMPORT_BEFORE_COMMA", "IMPORT_AFTER_COMMA", "BEFORE_IMPORT_BINDINGS", "BEFORE_IMPORT_MODULE", "AFTER_IMPORT_BINDINGS", "AFTER_FROM", "BEFORE_IMPORT_NAMESPACE", "BEFORE_IMPORT_STAR", "AFTER_IMPORT_STAR", "AFTER_IMPORT_AS", "AFTER_NAMESPACE_BINDING", "BEFORE_IMPORT_AS", "AFTER_IMPORT_AS", "EXPORTS_BEFORE_COMMA", "EXPORTS_AFTER_COMMA", "BEFORE_EXPORT_STAR", "AFTER_EXPORT_STAR", "BEFORE_EXPORT_BINDINGS", "AFTER_EXPORT_BINDINGS", "AFTER_EXPORT", "EXPORT_DEFAULT", "AFTER_EXPORT_DEFAULT", "BEFORE_EXPORT_AS", "AFTER_EXPORT_AS", "BEFORE_LABEL_COLON", "AFTER_LABEL_COLON", "AFTER_METHOD_GENERATOR_STAR", "AFTER_METHOD_NAME", "BEFORE_METHOD_BODY", "AFTER_MODULE_DIRECTIVES", "AFTER_NEW", "BEFORE_NEW_ARGS", "EMPTY_NEW_CALL", "NEW_TARGET_BEFORE_DOT", "NEW_TARGET_AFTER_DOT", "RETURN", "AFTER_SET", "BEFORE_SET_PARAMS", "BEFORE_SET_BODY", "AFTER_SCRIPT_DIRECTIVES", "BEFORE_STATIC_MEMBER_DOT", "AFTER_STATIC_MEMBER_DOT", "BEFORE_CASE_TEST", "AFTER_CASE_TEST", "BEFORE_CASE_BODY", "AFTER_CASE_BODY", "DEFAULT", "AFTER_DEFAULT_BODY", "BEFORE_SWITCH_DISCRIM", "BEFORE_SWITCH_BODY", "TEMPLATE_TAG", "BEFORE_TEMPLATE_EXPRESSION", "AFTER_TEMPLATE_EXPRESSION", "THROW", "AFTER_TRY", "BEFORE_CATCH", "BEFORE_FINALLY", "AFTER_FINALLY", "VARIABLE_DECLARATION", "YIELD", "BEFORE_YIELD_STAR", "AFTER_YIELD_STAR", "DECLARATORS_BEFORE_COMMA", "DECLARATORS_AFTER_COMMA", "BEFORE_INIT_EQUALS", "AFTER_INIT_EQUALS", "AFTER_WHILE", "BEFORE_WHILE_BODY", "AFTER_WITH", "BEFORE_WITH_BODY", "PAREN_AVOIDING_DIRECTIVE_BEFORE", "PAREN_AVOIDING_DIRECTIVE_AFTER", "PRECEDENCE_BEFORE", "PRECEDENCE_AFTER", "EXPRESSION_PAREN_BEFORE", "EXPRESSION_PAREN_AFTER", "CALL_PAREN_BEFORE", "CALL_PAREN_AFTER", "CALL_PAREN_EMPTY", "CATCH_PAREN_BEFORE", "CATCH_PAREN_AFTER", "DO_WHILE_TEST_PAREN_BEFORE", "DO_WHILE_TEST_PAREN_AFTER", "EXPRESSION_STATEMENT_PAREN_BEFORE", "EXPRESSION_STATEMENT_PAREN_AFTER", "FOR_IN_LET_PAREN_BEFORE", "FOR_IN_LET_PAREN_AFTER", "FOR_IN_PAREN_BEFORE", "FOR_IN_PAREN_AFTER", "FOR_OF_LET_PAREN_BEFORE", "FOR_OF_LET_PAREN_AFTER", "FOR_OF_PAREN_BEFORE", "FOR_OF_PAREN_AFTER", "PARAMETERS_PAREN_BEFORE", "PARAMETERS_PAREN_AFTER", "PARAMETERS_PAREN_EMPTY", "ARROW_PARAMETERS_PAREN_BEFORE", "ARROW_PARAMETERS_PAREN_AFTER", "ARROW_PARAMETERS_PAREN_EMPTY", "ARROW_BODY_PAREN_BEFORE", "ARROW_BODY_PAREN_AFTER", "GETTER_PARAMS", "IF_PAREN_BEFORE", "IF_PAREN_AFTER", "EXPORT_PAREN_BEFORE", "EXPORT_PAREN_AFTER", "NEW_CALLEE_PAREN_BEFORE", "NEW_CALLEE_PAREN_AFTER", "NEW_PAREN_BEFORE", "NEW_PAREN_AFTER", "NEW_PAREN_EMPTY", "SETTER_PARAM_BEFORE", "SETTER_PARAM_AFTER", "SWITCH_DISCRIM_PAREN_BEFORE", "SWITCH_DISCRIM_PAREN_AFTER", "WHILE_TEST_PAREN_BEFORE", "WHILE_TEST_PAREN_AFTER", "WITH_PAREN_BEFORE", "WITH_PAREN_AFTER", "OBJECT_BRACE_INITIAL", "OBJECT_BRACE_FINAL", "OBJECT_EMPTY", "BLOCK_BRACE_INITIAL", "BLOCK_BRACE_FINAL", "BLOCK_EMPTY", "CLASS_BRACE_INITIAL", "CLASS_BRACE_FINAL", "CLASS_EMPTY", "CLASS_EXPRESSION_BRACE_INITIAL", "CLASS_EXPRESSION_BRACE_FINAL", "CLASS_EXPRESSION_BRACE_EMPTY", "FUNCTION_BRACE_INITIAL", "FUNCTION_BRACE_FINAL", "FUNCTION_EMPTY", "FUNCTION_EXPRESSION_BRACE_INITIAL", "FUNCTION_EXPRESSION_BRACE_FINAL", "FUNCTION_EXPRESSION_EMPTY", "ARROW_BRACE_INITIAL", "ARROW_BRACE_FINAL", "ARROW_BRACE_EMPTY", "GET_BRACE_INTIAL", "GET_BRACE_FINAL", "GET_BRACE_EMPTY", "MISSING_ELSE_INTIIAL", "MISSING_ELSE_FINAL", "MISSING_ELSE_EMPTY", "IMPORT_BRACE_INTIAL", "IMPORT_BRACE_FINAL", "IMPORT_BRACE_EMPTY", "EXPORT_BRACE_INITIAL", "EXPORT_BRACE_FINAL", "EXPORT_BRACE_EMPTY", "METHOD_BRACE_INTIAL", "METHOD_BRACE_FINAL", "METHOD_BRACE_EMPTY", "SET_BRACE_INTIIAL", "SET_BRACE_FINAL", "SET_BRACE_EMPTY", "SWITCH_BRACE_INTIAL", "SWITCH_BRACE_FINAL", "SWITCH_BRACE_EMPTY", "ARRAY_INITIAL", "ARRAY_FINAL", "COMPUTED_MEMBER_BRACKET_INTIAL", "COMPUTED_MEMBER_BRACKET_FINAL", "COMPUTED_PROPERTY_BRACKET_INTIAL", "COMPUTED_PROPERTY_BRACKET_FINAL"];
for (var i = 0; i < separatorNames.length; ++i) {
  Sep[separatorNames[i]] = { type: separatorNames[i] };
}

Sep.BEFORE_ASSIGN_OP = function (op) {
  return {
    type: "BEFORE_ASSIGN_OP",
    op: op
  };
};

Sep.AFTER_ASSIGN_OP = function (op) {
  return {
    type: "AFTER_ASSIGN_OP",
    op: op
  };
};

Sep.BEFORE_BINOP = function (op) {
  return {
    type: "BEFORE_BINOP",
    op: op
  };
};

Sep.AFTER_BINOP = function (op) {
  return {
    type: "AFTER_BINOP",
    op: op
  };
};

Sep.BEFORE_POSTFIX = function (op) {
  return {
    type: "BEFORE_POSTFIX",
    op: op
  };
};

Sep.UNARY = function (op) {
  return {
    type: "UNARY",
    op: op
  };
};

Sep.AFTER_STATEMENT = function (node) {
  return {
    type: "AFTER_STATEMENT",
    node: node
  };
};

Sep.BEFORE_FUNCTION_NAME = function (node) {
  return {
    type: "BEFORE_FUNCTION_NAME",
    node: node
  };
};
exports.Sep = Sep;

var ExtensibleCodeGen = exports.ExtensibleCodeGen = function () {
  function ExtensibleCodeGen() {
    _classCallCheck(this, ExtensibleCodeGen);
  }

  _createClass(ExtensibleCodeGen, [{
    key: "parenToAvoidBeingDirective",
    value: function parenToAvoidBeingDirective(element, original) {
      if (element && element.type === "ExpressionStatement" && element.expression.type === "LiteralStringExpression") {
        return seq(this.paren(original.children[0], Sep.PAREN_AVOIDING_DIRECTIVE_BEFORE, Sep.PAREN_AVOIDING_DIRECTIVE_AFTER), this.semiOp());
      }
      return original;
    }
  }, {
    key: "t",
    value: function t(token) {
      return new _coderep.Token(token);
    }
  }, {
    key: "p",
    value: function p(node, precedence, a) {
      return (0, _coderep.getPrecedence)(node) < precedence ? this.paren(a, Sep.PRECEDENCE_BEFORE, Sep.PRECEDENCE_AFTER) : a;
    }
  }, {
    key: "getAssignmentExpr",
    value: function getAssignmentExpr(state) {
      return state ? state.containsGroup ? this.paren(state, Sep.EXPRESSION_PAREN_BEFORE, Sep.EXPRESSION_PAREN_AFTER) : state : empty();
    }
  }, {
    key: "paren",
    value: function paren(rep, first, last, empty) {
      if (isEmpty(rep)) {
        return new _coderep.Paren(this.sep(empty));
      }
      return new _coderep.Paren(seq(first ? this.sep(first) : new _coderep.Empty(), rep, last ? this.sep(last) : new _coderep.Empty()));
    }
  }, {
    key: "brace",
    value: function brace(rep, node, first, last, empty) {
      if (isEmpty(rep)) {
        return new _coderep.Brace(this.sep(empty));
      }
      return new _coderep.Brace(seq(this.sep(first), rep, this.sep(last)));
    }
  }, {
    key: "bracket",
    value: function bracket(rep, first, last, empty) {
      if (isEmpty(rep)) {
        return new _coderep.Bracket(this.sep(empty));
      }
      return new _coderep.Bracket(seq(this.sep(first), rep, this.sep(last)));
    }
  }, {
    key: "commaSep",
    value: function commaSep(pieces, before, after) {
      var _this = this;

      var first = true;
      pieces = pieces.map(function (p) {
        if (first) {
          first = false;
          return p;
        } else {
          return seq(_this.sep(before), _this.t(","), _this.sep(after), p);
        }
      });
      return seq.apply(undefined, _toConsumableArray(pieces));
    }
  }, {
    key: "semiOp",
    value: function semiOp() {
      return new _coderep.SemiOp();
    }
  }, {
    key: "sep",
    value: function sep(kind) {
      return new _coderep.Empty();
    }
  }, {
    key: "reduceArrayExpression",
    value: function reduceArrayExpression(node, _ref) {
      var _this2 = this;

      var elements = _ref.elements;

      if (elements.length === 0) {
        return this.bracket(empty(), null, null, Sep.ARRAY_EMPTY);
      }

      var content = this.commaSep(elements.map(function (e) {
        return _this2.getAssignmentExpr(e);
      }), Sep.ARRAY_BEFORE_COMMA, Sep.ARRAY_AFTER_COMMA);
      if (elements.length > 0 && elements[elements.length - 1] == null) {
        content = seq(content, this.sep(Sep.ARRAY_BEFORE_COMMA), this.t(","), this.sep(Sep.ARRAY_AFTER_COMMA));
      }
      return this.bracket(content, Sep.ARRAY_INITIAL, Sep.ARRAY_FINAL);
    }
  }, {
    key: "reduceSpreadElement",
    value: function reduceSpreadElement(node, _ref2) {
      var expression = _ref2.expression;

      return seq(this.t("..."), this.sep(Sep.SPREAD), this.p(node.expression, _coderep.Precedence.Assignment, expression));
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
        rightCode = this.paren(rightCode, Sep.EXPRESSION_PAREN_BEFORE, Sep.EXPRESSION_PAREN_AFTER);
        containsIn = false;
      }
      return (0, _objectAssign2.default)(seq(leftCode, this.sep(Sep.BEFORE_ASSIGN_OP("=")), this.t("="), this.sep(Sep.AFTER_ASSIGN_OP("=")), rightCode), { containsIn: containsIn, startsWithCurly: startsWithCurly, startsWithLetSquareBracket: startsWithLetSquareBracket, startsWithFunctionOrClass: startsWithFunctionOrClass });
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
        rightCode = this.paren(rightCode, Sep.EXPRESSION_PAREN_BEFORE, Sep.EXPRESSION_PAREN_AFTER);
        containsIn = false;
      }
      return (0, _objectAssign2.default)(seq(leftCode, this.sep(Sep.BEFORE_ASSIGN_OP(node.operator)), this.t(node.operator), this.sep(Sep.AFTER_ASSIGN_OP(node.operator)), rightCode), { containsIn: containsIn, startsWithCurly: startsWithCurly, startsWithLetSquareBracket: startsWithLetSquareBracket, startsWithFunctionOrClass: startsWithFunctionOrClass });
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
        leftCode = this.paren(leftCode, Sep.EXPRESSION_PAREN_BEFORE, Sep.EXPRESSION_PAREN_AFTER);
        startsWithCurly = false;
        startsWithLetSquareBracket = false;
        startsWithFunctionOrClass = false;
        leftContainsIn = false;
      }
      var rightCode = right;
      var rightContainsIn = right.containsIn;
      if ((0, _coderep.getPrecedence)(node.right) <= (0, _coderep.getPrecedence)(node)) {
        rightCode = this.paren(rightCode, Sep.EXPRESSION_PAREN_BEFORE, Sep.EXPRESSION_PAREN_AFTER);
        rightContainsIn = false;
      }
      return (0, _objectAssign2.default)(seq(leftCode, this.sep(Sep.BEFORE_BINOP(node.operator)), this.t(node.operator), this.sep(Sep.AFTER_BINOP(node.operator)), rightCode), {
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

      return seq(binding, this.sep(Sep.BEFORE_DEFAULT_EQUALS), this.t("="), this.sep(Sep.AFTER_DEFAULT_EQUALS), init);
    }
  }, {
    key: "reduceBindingIdentifier",
    value: function reduceBindingIdentifier(node) {
      var a = this.t(node.name);
      if (node.name === "let") {
        a.startsWithLet = true;
      }
      return a;
    }
  }, {
    key: "reduceArrayBinding",
    value: function reduceArrayBinding(node, _ref7) {
      var _this3 = this;

      var elements = _ref7.elements;
      var restElement = _ref7.restElement;

      var content = undefined;
      if (elements.length === 0) {
        content = restElement == null ? empty() : seq(this.t("..."), this.sep(Sep.REST), restElement);
      } else {
        elements = elements.concat(restElement == null ? [] : [seq(this.t("..."), this.sep(Sep.REST), restElement)]);
        content = this.commaSep(elements.map(function (e) {
          return _this3.getAssignmentExpr(e);
        }), Sep.ARRAY_BEFORE_COMMA, Sep.ARRAY_AFTER_COMMA);
        if (elements.length > 0 && elements[elements.length - 1] == null) {
          content = seq(content, this.sep(Sep.ARRAY_BEFORE_COMMA), this.t(","), this.sep(Sep.ARRAY_AFTER_COMMA));
        }
      }
      return this.bracket(content, Sep.ARRAY_INITIAL, Sep.ARRAY_FINAL, Sep.ARRAY_EMPTY);
    }
  }, {
    key: "reduceObjectBinding",
    value: function reduceObjectBinding(node, _ref8) {
      var properties = _ref8.properties;

      var state = this.brace(this.commaSep(properties, Sep.OBJECT_BEFORE_COMMA, Sep.OBJECT_AFTER_COMMA), node, Sep.OBJECT_BRACE_INITIAL, Sep.OBJECT_BRACE_FINAL, Sep.OBJECT_EMPTY);
      state.startsWithCurly = true;
      return state;
    }
  }, {
    key: "reduceBindingPropertyIdentifier",
    value: function reduceBindingPropertyIdentifier(node, _ref9) {
      var binding = _ref9.binding;
      var init = _ref9.init;

      if (node.init == null) return binding;
      return seq(binding, this.sep(Sep.BEFORE_DEFAULT_EQUALS), this.t("="), this.sep(Sep.AFTER_DEFAULT_EQUALS), init);
    }
  }, {
    key: "reduceBindingPropertyProperty",
    value: function reduceBindingPropertyProperty(node, _ref10) {
      var name = _ref10.name;
      var binding = _ref10.binding;

      return seq(name, this.sep(Sep.BEFORE_PROP), this.t(":"), this.sep(Sep.AFTER_PROP), binding);
    }
  }, {
    key: "reduceBlock",
    value: function reduceBlock(node, _ref11) {
      var statements = _ref11.statements;

      return this.brace(seq.apply(undefined, _toConsumableArray(statements)), node, Sep.BLOCK_BRACE_INITIAL, Sep.BLOCK_BRACE_FINAL, Sep.BLOCK_EMPTY);
    }
  }, {
    key: "reduceBlockStatement",
    value: function reduceBlockStatement(node, _ref12) {
      var block = _ref12.block;

      return seq(block, this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceBreakStatement",
    value: function reduceBreakStatement(node, _ref13) {
      var label = _ref13.label;

      return seq(this.t("break"), label ? seq(this.sep(Sep.BEFORE_JUMP_LABEL), this.t(label)) : empty(), this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceCallExpression",
    value: function reduceCallExpression(node, _ref14) {
      var callee = _ref14.callee;
      var args = _ref14.arguments;

      return (0, _objectAssign2.default)(seq(this.p(node.callee, (0, _coderep.getPrecedence)(node), callee), this.sep(Sep.CALL), this.paren(this.commaSep(args, Sep.ARGS_BEFORE_COMMA, Sep.ARGS_AFTER_COMMA), Sep.CALL_PAREN_BEFORE, Sep.CALL_PAREN_AFTER, Sep.CALL_PAREN_EMPTY)), {
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

      return seq(this.t("catch"), this.sep(Sep.BEFORE_CATCH_BINDING), this.paren(binding, Sep.CATCH_PAREN_BEFORE, Sep.CATCH_PAREN_AFTER), this.sep(Sep.AFTER_CATCH_BINDING), body);
    }
  }, {
    key: "reduceClassDeclaration",
    value: function reduceClassDeclaration(node, _ref16) {
      var name = _ref16.name;
      var _super = _ref16.super;
      var elements = _ref16.elements;

      var state = seq(this.t("class"), this.sep(Sep.BEFORE_CLASS_NAME), name);
      if (_super != null) {
        state = seq(state, this.sep(Sep.BEFORE_EXTENDS), this.t("extends"), this.sep(Sep.AFTER_EXTENDS), _super);
      }
      state = seq(state, this.sep(Sep.BEFORE_CLASS_DECLARATION_ELEMENTS), this.brace(seq.apply(undefined, _toConsumableArray(elements)), node, Sep.CLASS_BRACE_INITIAL, Sep.CLASS_BRACE_FINAL, Sep.CLASS_EMPTY), this.sep(Sep.AFTER_STATEMENT(node)));
      return state;
    }
  }, {
    key: "reduceClassExpression",
    value: function reduceClassExpression(node, _ref17) {
      var name = _ref17.name;
      var _super = _ref17.super;
      var elements = _ref17.elements;

      var state = this.t("class");
      if (name != null) {
        state = seq(state, this.sep(Sep.BEFORE_CLASS_NAME), name);
      }
      if (_super != null) {
        state = seq(state, this.sep(Sep.BEFORE_EXTENDS), this.t("extends"), this.sep(Sep.AFTER_EXTENDS), _super);
      }
      state = seq(state, this.sep(Sep.BEFORE_CLASS_EXPRESSION_ELEMENTS), this.brace(seq.apply(undefined, _toConsumableArray(elements)), node, Sep.CLASS_EXPRESSION_BRACE_INITIAL, Sep.CLASS_EXPRESSION_BRACE_FINAL, Sep.CLASS_EXPRESSION_BRACE_EMPTY));
      state.startsWithFunctionOrClass = true;
      return state;
    }
  }, {
    key: "reduceClassElement",
    value: function reduceClassElement(node, _ref18) {
      var method = _ref18.method;

      method = seq(this.sep(Sep.BEFORE_CLASS_ELEMENT), method, this.sep(Sep.AFTER_CLASS_ELEMENT));
      if (!node.isStatic) return method;
      return seq(this.t("static"), this.sep(Sep.AFTER_STATIC), method);
    }
  }, {
    key: "reduceComputedMemberExpression",
    value: function reduceComputedMemberExpression(node, _ref19) {
      var object = _ref19.object;
      var expression = _ref19.expression;

      var startsWithLetSquareBracket = object.startsWithLetSquareBracket || node.object.type === "IdentifierExpression" && node.object.name === "let";
      return (0, _objectAssign2.default)(seq(this.p(node.object, (0, _coderep.getPrecedence)(node), object), this.sep(Sep.COMPUTED_MEMBER_EXPRESSION), this.bracket(expression, Sep.COMPUTED_MEMBER_BRACKET_INTIAL, Sep.COMPUTED_MEMBER_BRACKET_FINAL)), {
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

      return this.bracket(expression, Sep.COMPUTED_PROPERTY_BRACKET_INTIAL, Sep.COMPUTED_PROPERTY_BRACKET_FINAL);
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
      return (0, _objectAssign2.default)(seq(this.p(node.test, _coderep.Precedence.LogicalOR, test), this.sep(Sep.BEFORE_TERNARY_QUESTION), this.t("?"), this.sep(Sep.AFTER_TERNARY_QUESTION), this.p(node.consequent, _coderep.Precedence.Assignment, consequent), this.sep(Sep.BEFORE_TERNARY_COLON), this.t(":"), this.sep(Sep.AFTER_TERNARY_COLON), this.p(node.alternate, _coderep.Precedence.Assignment, alternate)), {
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

      return seq(this.t("continue"), label ? seq(this.sep(Sep.BEFORE_JUMP_LABEL), this.t(label)) : empty(), this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceDataProperty",
    value: function reduceDataProperty(node, _ref23) {
      var name = _ref23.name;
      var expression = _ref23.expression;

      return seq(name, this.sep(Sep.BEFORE_PROP), this.t(":"), this.sep(Sep.AFTER_PROP), this.getAssignmentExpr(expression));
    }
  }, {
    key: "reduceDebuggerStatement",
    value: function reduceDebuggerStatement(node) {
      return seq(this.t("debugger"), this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceDoWhileStatement",
    value: function reduceDoWhileStatement(node, _ref24) {
      var body = _ref24.body;
      var test = _ref24.test;

      return seq(this.t("do"), this.sep(Sep.AFTER_DO), body, this.sep(Sep.BEFORE_DOWHILE_WHILE), this.t("while"), this.sep(Sep.AFTER_DOWHILE_WHILE), this.paren(test, Sep.DO_WHILE_TEST_PAREN_BEFORE, Sep.DO_WHILE_TEST_PAREN_AFTER), this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceEmptyStatement",
    value: function reduceEmptyStatement(node) {
      return seq(this.t(";"), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceExpressionStatement",
    value: function reduceExpressionStatement(node, _ref25) {
      var expression = _ref25.expression;

      var needsParens = expression.startsWithCurly || expression.startsWithLetSquareBracket || expression.startsWithFunctionOrClass;
      return seq(needsParens ? this.paren(expression, Sep.EXPRESSION_STATEMENT_PAREN_BEFORE, Sep.EXPRESSION_STATEMENT_PAREN_AFTER) : expression, this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
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
            leftP = this.paren(left, Sep.FOR_IN_LET_PAREN_BEFORE, Sep.FOR_IN_LET_PAREN_BEFORE);
          }
          break;
      }
      return (0, _objectAssign2.default)(seq(this.t("for"), this.sep(Sep.AFTER_FORIN_FOR), this.paren(seq(leftP, this.sep(Sep.BEFORE_FORIN_IN), this.t("in"), this.sep(Sep.AFTER_FORIN_FOR), right), Sep.FOR_IN_PAREN_BEFORE, Sep.FOR_IN_PAREN_AFTER), this.sep(Sep.BEFORE_FORIN_BODY), body, this.sep(Sep.AFTER_STATEMENT(node))), { endsWithMissingElse: body.endsWithMissingElse });
    }
  }, {
    key: "reduceForOfStatement",
    value: function reduceForOfStatement(node, _ref27) {
      var left = _ref27.left;
      var right = _ref27.right;
      var body = _ref27.body;

      left = node.left.type === "VariableDeclaration" ? noIn(markContainsIn(left)) : left;
      return (0, _objectAssign2.default)(seq(this.t("for"), this.sep(Sep.AFTER_FOROF_FOR), this.paren(seq(left.startsWithLet ? this.paren(left, Sep.FOR_OF_LET_PAREN_BEFORE, Sep.FOR_OF_LET_PAREN_AFTER) : left, this.sep(Sep.BEFORE_FOROF_OF), this.t("of"), this.sep(Sep.AFTER_FOROF_FOR), right), Sep.FOR_OF_PAREN_BEFORE, Sep.FOR_OF_PAREN_AFTER), this.sep(Sep.BEFORE_FOROF_BODY), body, this.sep(Sep.AFTER_STATEMENT(node))), { endsWithMissingElse: body.endsWithMissingElse });
    }
  }, {
    key: "reduceForStatement",
    value: function reduceForStatement(node, _ref28) {
      var init = _ref28.init;
      var test = _ref28.test;
      var update = _ref28.update;
      var body = _ref28.body;

      return (0, _objectAssign2.default)(seq(this.t("for"), this.sep(Sep.AFTER_FOR_FOR), this.paren(seq(init ? seq(this.sep(Sep.BEFORE_FOR_INIT), noIn(markContainsIn(init)), this.sep(Sep.AFTER_FOR_INIT)) : this.sep(Sep.EMPTY_FOR_INIT), this.t(";"), test ? seq(this.sep(Sep.BEFORE_FOR_TEST), test, this.sep(Sep.AFTER_FOR_TEST)) : this.sep(Sep.EMPTY_FOR_TEST), this.t(";"), update ? seq(this.sep(Sep.BEFORE_FOR_UPDATE), update, this.sep(Sep.AFTER_FOR_UPDATE)) : this.sep(Sep.EMPTY_FOR_UPDATE))), this.sep(Sep.BEFORE_FOR_BODY), body, this.sep(Sep.AFTER_STATEMENT(node))), {
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
      return seq.apply(undefined, _toConsumableArray(directives).concat([directives.length ? this.sep(Sep.AFTER_FUNCTION_DIRECTIVES) : empty()], _toConsumableArray(statements)));
    }
  }, {
    key: "reduceFunctionDeclaration",
    value: function reduceFunctionDeclaration(node, _ref30) {
      var name = _ref30.name;
      var params = _ref30.params;
      var body = _ref30.body;

      return seq(this.t("function"), node.isGenerator ? seq(this.sep(Sep.BEFORE_GENERATOR_STAR), this.t("*"), this.sep(Sep.AFTER_GENERATOR_STAR)) : empty(), this.sep(Sep.BEFORE_FUNCTION_NAME(node)), node.name.name === "*default*" ? empty() : name, this.sep(Sep.BEFORE_FUNCTION_PARAMS), this.paren(params, Sep.PARAMETERS_PAREN_BEFORE, Sep.PARAMETERS_PAREN_AFTER, Sep.PARAMETERS_PAREN_EMPTY), this.sep(Sep.BEFORE_FUNCTION_DECLARATION_BODY), this.brace(body, node, Sep.FUNCTION_BRACE_INITIAL, Sep.FUNCTION_BRACE_FINAL, Sep.FUNCTION_EMPTY), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceFunctionExpression",
    value: function reduceFunctionExpression(node, _ref31) {
      var name = _ref31.name;
      var params = _ref31.params;
      var body = _ref31.body;

      var state = seq(this.t("function"), node.isGenerator ? seq(this.sep(Sep.BEFORE_GENERATOR_STAR), this.t("*"), this.sep(Sep.AFTER_GENERATOR_STAR)) : empty(), this.sep(Sep.BEFORE_FUNCTION_NAME(node)), name ? name : empty(), this.sep(Sep.BEFORE_FUNCTION_PARAMS), this.paren(params, Sep.PARAMETERS_PAREN_BEFORE, Sep.PARAMETERS_PAREN_AFTER, Sep.PARAMETERS_PAREN_EMPTY), this.sep(Sep.BEFORE_FUNCTION_EXPRESSION_BODY), this.brace(body, node, Sep.FUNCTION_EXPRESSION_BRACE_INITIAL, Sep.FUNCTION_EXPRESSION_BRACE_FINAL, Sep.FUNCTION_EXPRESSION_EMPTY));
      state.startsWithFunctionOrClass = true;
      return state;
    }
  }, {
    key: "reduceFormalParameters",
    value: function reduceFormalParameters(node, _ref32) {
      var items = _ref32.items;
      var rest = _ref32.rest;

      return this.commaSep(items.concat(rest == null ? [] : [seq(this.t("..."), this.sep(Sep.REST), rest)]), Sep.PARAMETER_BEFORE_COMMA, Sep.PARAMETER_AFTER_COMMA);
    }
  }, {
    key: "reduceArrowExpression",
    value: function reduceArrowExpression(node, _ref33) {
      var params = _ref33.params;
      var body = _ref33.body;

      if (node.params.rest != null || node.params.items.length !== 1 || node.params.items[0].type !== "BindingIdentifier") {
        params = this.paren(params, Sep.ARROW_PARAMETERS_PAREN_BEFORE, Sep.ARROW_PARAMETERS_PAREN_AFTER, Sep.ARROW_PARAMETERS_PAREN_EMPTY);
      }
      if (node.body.type === "FunctionBody") {
        body = this.brace(body, node, Sep.ARROW_BRACE_INITIAL, Sep.ARROW_BRACE_FINAL, Sep.ARROW_BRACE_EMPTY);
      } else if (body.startsWithCurly) {
        body = this.paren(body, Sep.ARROW_BODY_PAREN_BEFORE, Sep.ARROW_BODY_PAREN_AFTER);
      }
      return seq(params, this.sep(Sep.BEFORE_ARROW), this.t("=>"), this.sep(Sep.AFTER_ARROW), this.p(node.body, _coderep.Precedence.Assignment, body));
    }
  }, {
    key: "reduceGetter",
    value: function reduceGetter(node, _ref34) {
      var name = _ref34.name;
      var body = _ref34.body;

      return seq(this.t("get"), this.sep(Sep.AFTER_GET), name, this.sep(Sep.BEFORE_GET_PARAMS), this.paren(empty(), null, null, Sep.GETTER_PARAMS), this.sep(Sep.BEFORE_GET_BODY), this.brace(body, node, Sep.GET_BRACE_INTIAL, Sep.GET_BRACE_FINAL, Sep.GET_BRACE_EMPTY));
    }
  }, {
    key: "reduceIdentifierExpression",
    value: function reduceIdentifierExpression(node) {
      var a = this.t(node.name);
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
        consequent = this.brace(consequent, node, Sep.MISSING_ELSE_INTIIAL, Sep.MISSING_ELSE_FINAL, Sep.MISSING_ELSE_EMPTY);
      }
      return (0, _objectAssign2.default)(seq(this.t("if"), this.sep(Sep.AFTER_IF), this.paren(test, Sep.IF_PAREN_BEFORE, Sep.IF_PAREN_AFTER), this.sep(Sep.AFTER_IF_TEST), consequent, alternate ? seq(this.sep(Sep.BEFORE_ELSE), this.t("else"), this.sep(Sep.AFTER_ELSE), alternate) : empty(), this.sep(Sep.AFTER_STATEMENT(node))), { endsWithMissingElse: alternate ? alternate.endsWithMissingElse : true });
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
        bindings.push(this.brace(this.commaSep(namedImports, Sep.NAMED_IMPORT_BEFORE_COMMA, Sep.NAMED_IMPORT_AFTER_COMMA), node, Sep.IMPORT_BRACE_INTIAL, Sep.IMPORT_BRACE_FINAL, Sep.IMPORT_BRACE_EMPTY));
      }
      if (bindings.length === 0) {
        return seq(this.t("import"), this.sep(Sep.BEFORE_IMPORT_MODULE), this.t((0, _coderep.escapeStringLiteral)(node.moduleSpecifier)), this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
      }
      return seq(this.t("import"), this.sep(Sep.BEFORE_IMPORT_BINDINGS), this.commaSep(bindings, Sep.IMPORT_BEFORE_COMMA, Sep.IMPORT_AFTER_COMMA), this.sep(Sep.AFTER_IMPORT_BINDINGS), this.t("from"), this.sep(Sep.AFTER_FROM), this.t((0, _coderep.escapeStringLiteral)(node.moduleSpecifier)), this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceImportNamespace",
    value: function reduceImportNamespace(node, _ref37) {
      var defaultBinding = _ref37.defaultBinding;
      var namespaceBinding = _ref37.namespaceBinding;

      return seq(this.t("import"), this.sep(Sep.BEFORE_IMPORT_NAMESPACE), defaultBinding == null ? empty() : seq(defaultBinding, this.sep(Sep.IMPORT_BEFORE_COMMA), this.t(","), this.sep(Sep.IMPORT_AFTER_COMMA)), this.sep(Sep.BEFORE_IMPORT_STAR), this.t("*"), this.sep(Sep.AFTER_IMPORT_STAR), this.t("as"), this.sep(Sep.AFTER_IMPORT_AS), namespaceBinding, this.sep(Sep.AFTER_NAMESPACE_BINDING), this.t("from"), this.sep(Sep.AFTER_FROM), this.t((0, _coderep.escapeStringLiteral)(node.moduleSpecifier)), this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceImportSpecifier",
    value: function reduceImportSpecifier(node, _ref38) {
      var binding = _ref38.binding;

      if (node.name == null) return binding;
      return seq(this.t(node.name), this.sep(Sep.BEFORE_IMPORT_AS), this.t("as"), this.sep(Sep.AFTER_IMPORT_AS), binding);
    }
  }, {
    key: "reduceExportAllFrom",
    value: function reduceExportAllFrom(node) {
      return seq(this.t("export"), this.sep(Sep.BEFORE_EXPORT_STAR), this.t("*"), this.sep(Sep.AFTER_EXPORT_STAR), this.t("from"), this.sep(Sep.AFTER_FROM), this.t((0, _coderep.escapeStringLiteral)(node.moduleSpecifier)), this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceExportFrom",
    value: function reduceExportFrom(node, _ref39) {
      var namedExports = _ref39.namedExports;

      return seq(this.t("export"), this.sep(Sep.BEFORE_EXPORT_BINDINGS), this.brace(this.commaSep(namedExports, Sep.EXPORTS_BEFORE_COMMA, Sep.EXPORTS_AFTER_COMMA), node, Sep.EXPORT_BRACE_INITIAL, Sep.EXPORT_BRACE_FINAL, Sep.EXPORT_BRACE_EMPTY), node.moduleSpecifier == null ? empty() : seq(this.sep(Sep.AFTER_EXPORT_BINDINGS), this.t("from"), this.sep(Sep.AFTER_FROM), this.t((0, _coderep.escapeStringLiteral)(node.moduleSpecifier)), this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node))));
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
          declaration = seq(declaration, this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
      }
      return seq(this.t("export"), this.sep(Sep.AFTER_EXPORT), declaration);
    }
  }, {
    key: "reduceExportDefault",
    value: function reduceExportDefault(node, _ref41) {
      var body = _ref41.body;

      body = body.startsWithFunctionOrClass ? this.paren(body, Sep.EXPORT_PAREN_BEFORE, Sep.EXPORT_PAREN_AFTER) : body;
      switch (node.body.type) {
        case "FunctionDeclaration":
        case "ClassDeclaration":
          break;
        default:
          body = seq(body, this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
      }
      return seq(this.t("export"), this.sep(Sep.EXPORT_DEFAULT), this.t("default"), this.sep(Sep.AFTER_EXPORT_DEFAULT), body);
    }
  }, {
    key: "reduceExportSpecifier",
    value: function reduceExportSpecifier(node) {
      if (node.name == null) return this.t(node.exportedName);
      return seq(this.t(node.name), this.sep(Sep.BEFORE_EXPORT_AS), this.t("as"), this.sep(Sep.AFTER_EXPORT_AS), this.t(node.exportedName));
    }
  }, {
    key: "reduceLabeledStatement",
    value: function reduceLabeledStatement(node, _ref42) {
      var label = _ref42.label;
      var body = _ref42.body;

      return (0, _objectAssign2.default)(seq(this.t(label), this.sep(Sep.BEFORE_LABEL_COLON), this.t(":"), this.sep(Sep.AFTER_LABEL_COLON), body), { endsWithMissingElse: body.endsWithMissingElse });
    }
  }, {
    key: "reduceLiteralBooleanExpression",
    value: function reduceLiteralBooleanExpression(node) {
      return this.t(node.value.toString());
    }
  }, {
    key: "reduceLiteralNullExpression",
    value: function reduceLiteralNullExpression(node) {
      return this.t("null");
    }
  }, {
    key: "reduceLiteralInfinityExpression",
    value: function reduceLiteralInfinityExpression(node) {
      return this.t("2e308");
    }
  }, {
    key: "reduceLiteralNumericExpression",
    value: function reduceLiteralNumericExpression(node) {
      return new _coderep.NumberCodeRep(node.value);
    }
  }, {
    key: "reduceLiteralRegExpExpression",
    value: function reduceLiteralRegExpExpression(node) {
      return this.t("/" + node.pattern + "/" + node.flags);
    }
  }, {
    key: "reduceLiteralStringExpression",
    value: function reduceLiteralStringExpression(node) {
      return this.t((0, _coderep.escapeStringLiteral)(node.value));
    }
  }, {
    key: "reduceMethod",
    value: function reduceMethod(node, _ref43) {
      var name = _ref43.name;
      var params = _ref43.params;
      var body = _ref43.body;

      return seq(node.isGenerator ? seq(this.t("*"), this.sep(Sep.AFTER_METHOD_GENERATOR_STAR)) : empty(), name, this.sep(Sep.AFTER_METHOD_NAME), this.paren(params, Sep.PARAMETERS_PAREN_BEFORE, Sep.PARAMETERS_PAREN_AFTER, Sep.PARAMETERS_PAREN_EMPTY), this.sep(Sep.BEFORE_METHOD_BODY), this.brace(body, node, Sep.METHOD_BRACE_INTIAL, Sep.METHOD_BRACE_FINAL, Sep.METHOD_BRACE_EMPTY));
    }
  }, {
    key: "reduceModule",
    value: function reduceModule(node, _ref44) {
      var directives = _ref44.directives;
      var items = _ref44.items;

      if (items.length) {
        items[0] = this.parenToAvoidBeingDirective(node.items[0], items[0]);
      }
      return seq.apply(undefined, _toConsumableArray(directives).concat([directives.length ? this.sep(Sep.AFTER_MODULE_DIRECTIVES) : empty()], _toConsumableArray(items)));
    }
  }, {
    key: "reduceNewExpression",
    value: function reduceNewExpression(node, _ref45) {
      var callee = _ref45.callee;
      var args = _ref45.arguments;

      var calleeRep = (0, _coderep.getPrecedence)(node.callee) == _coderep.Precedence.Call ? this.paren(callee, Sep.NEW_CALLEE_PAREN_BEFORE, Sep.NEW_CALLEE_PAREN_AFTER) : this.p(node.callee, (0, _coderep.getPrecedence)(node), callee);
      return seq(this.t("new"), this.sep(Sep.AFTER_NEW), calleeRep, args.length === 0 ? this.sep(Sep.EMPTY_NEW_CALL) : seq(this.sep(Sep.BEFORE_NEW_ARGS), this.paren(this.commaSep(args, Sep.ARGS_BEFORE_COMMA, Sep.ARGS_AFTER_COMMA), Sep.NEW_PAREN_BEFORE, Sep.NEW_PAREN_AFTER, Sep.NEW_PAREN_EMPTY)));
    }
  }, {
    key: "reduceNewTargetExpression",
    value: function reduceNewTargetExpression() {
      return seq(this.t("new"), this.sep(Sep.NEW_TARGET_BEFORE_DOT), this.t("."), this.sep(Sep.NEW_TARGET_AFTER_DOT), this.t("target"));
    }
  }, {
    key: "reduceObjectExpression",
    value: function reduceObjectExpression(node, _ref46) {
      var properties = _ref46.properties;

      var state = this.brace(this.commaSep(properties, Sep.OBJECT_BEFORE_COMMA, Sep.OBJECT_AFTER_COMMA), node, Sep.OBJECT_BRACE_INITIAL, Sep.OBJECT_BRACE_FINAL, Sep.OBJECT_EMPTY);
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
        return (0, _objectAssign2.default)(seq(this.p(node.operand, _coderep.Precedence.New, operand), this.sep(Sep.BEFORE_POSTFIX(node.operator)), this.t(node.operator)), {
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

      return seq(this.t(node.operator), this.sep(Sep.UNARY(node.operator)), this.p(node.operand, (0, _coderep.getPrecedence)(node), operand));
    }
  }, {
    key: "reduceReturnStatement",
    value: function reduceReturnStatement(node, _ref49) {
      var expression = _ref49.expression;

      return seq(this.t("return"), expression ? seq(this.sep(Sep.RETURN), expression) : empty(), this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceScript",
    value: function reduceScript(node, _ref50) {
      var directives = _ref50.directives;
      var statements = _ref50.statements;

      if (statements.length) {
        statements[0] = this.parenToAvoidBeingDirective(node.statements[0], statements[0]);
      }
      return seq.apply(undefined, _toConsumableArray(directives).concat([directives.length ? this.sep(Sep.AFTER_SCRIPT_DIRECTIVES) : empty()], _toConsumableArray(statements)));
    }
  }, {
    key: "reduceSetter",
    value: function reduceSetter(node, _ref51) {
      var name = _ref51.name;
      var param = _ref51.param;
      var body = _ref51.body;

      return seq(this.t("set"), this.sep(Sep.AFTER_SET), name, this.sep(Sep.BEFORE_SET_PARAMS), this.paren(param, Sep.SETTER_PARAM_BEFORE, Sep.SETTER_PARAM_AFTER), this.sep(Sep.BEFORE_SET_BODY), this.brace(body, node, Sep.SET_BRACE_INTIIAL, Sep.SET_BRACE_FINAL, Sep.SET_BRACE_EMPTY));
    }
  }, {
    key: "reduceShorthandProperty",
    value: function reduceShorthandProperty(node) {
      return this.t(node.name);
    }
  }, {
    key: "reduceStaticMemberExpression",
    value: function reduceStaticMemberExpression(node, _ref52) {
      var object = _ref52.object;
      var property = _ref52.property;

      var state = seq(this.p(node.object, (0, _coderep.getPrecedence)(node), object), this.sep(Sep.BEFORE_STATIC_MEMBER_DOT), this.t("."), this.sep(Sep.AFTER_STATIC_MEMBER_DOT), this.t(property));
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
        return this.t(node.value);
      } else if (n = parseFloat(node.value), n === n) {
        return new _coderep.NumberCodeRep(n);
      }
      return this.t((0, _coderep.escapeStringLiteral)(node.value));
    }
  }, {
    key: "reduceSuper",
    value: function reduceSuper() {
      return this.t("super");
    }
  }, {
    key: "reduceSwitchCase",
    value: function reduceSwitchCase(node, _ref53) {
      var test = _ref53.test;
      var consequent = _ref53.consequent;

      return seq(this.t("case"), this.sep(Sep.BEFORE_CASE_TEST), test, this.sep(Sep.AFTER_CASE_TEST), this.t(":"), this.sep(Sep.BEFORE_CASE_BODY), seq.apply(undefined, _toConsumableArray(consequent)), this.sep(Sep.AFTER_CASE_BODY));
    }
  }, {
    key: "reduceSwitchDefault",
    value: function reduceSwitchDefault(node, _ref54) {
      var consequent = _ref54.consequent;

      return seq(this.t("default"), this.sep(Sep.DEFAULT), this.t(":"), this.sep(Sep.BEFORE_CASE_BODY), seq.apply(undefined, _toConsumableArray(consequent)), this.sep(Sep.AFTER_DEFAULT_BODY));
    }
  }, {
    key: "reduceSwitchStatement",
    value: function reduceSwitchStatement(node, _ref55) {
      var discriminant = _ref55.discriminant;
      var cases = _ref55.cases;

      return seq(this.t("switch"), this.sep(Sep.BEFORE_SWITCH_DISCRIM), this.paren(discriminant, Sep.SWITCH_DISCRIM_PAREN_BEFORE, Sep.SWITCH_DISCRIM_PAREN_AFTER), this.sep(Sep.BEFORE_SWITCH_BODY), this.brace(seq.apply(undefined, _toConsumableArray(cases)), node, Sep.SWITCH_BRACE_INTIAL, Sep.SWITCH_BRACE_FINAL, Sep.SWITCH_BRACE_EMPTY), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceSwitchStatementWithDefault",
    value: function reduceSwitchStatementWithDefault(node, _ref56) {
      var discriminant = _ref56.discriminant;
      var preDefaultCases = _ref56.preDefaultCases;
      var defaultCase = _ref56.defaultCase;
      var postDefaultCases = _ref56.postDefaultCases;

      return seq(this.t("switch"), this.sep(Sep.BEFORE_SWITCH_DISCRIM), this.paren(discriminant, Sep.SWITCH_DISCRIM_PAREN_BEFORE, Sep.SWITCH_DISCRIM_PAREN_AFTER), this.sep(Sep.BEFORE_SWITCH_BODY), this.brace(seq.apply(undefined, _toConsumableArray(preDefaultCases).concat([defaultCase], _toConsumableArray(postDefaultCases))), node, Sep.SWITCH_BRACE_INTIAL, Sep.SWITCH_BRACE_FINAL, Sep.SWITCH_BRACE_EMPTY), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceTemplateExpression",
    value: function reduceTemplateExpression(node, _ref57) {
      var tag = _ref57.tag;
      var elements = _ref57.elements;

      var state = node.tag == null ? empty() : seq(this.p(node.tag, (0, _coderep.getPrecedence)(node), tag), this.sep(Sep.TEMPLATE_TAG));
      var templateData = "";
      state = seq(state, this.t("`"));
      for (var i = 0, l = node.elements.length; i < l; ++i) {
        if (node.elements[i].type === "TemplateElement") {
          var d = "";
          if (i > 0) d += "}";
          d += node.elements[i].rawValue;
          if (i < l - 1) d += "${";
          state = seq(state, this.t(d));
        } else {
          state = seq(state, this.sep(Sep.BEFORE_TEMPLATE_EXPRESSION), elements[i], this.sep(Sep.AFTER_TEMPLATE_EXPRESSION));
        }
      }
      state = seq(state, this.t("`"));
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
      return this.t(node.rawValue);
    }
  }, {
    key: "reduceThisExpression",
    value: function reduceThisExpression(node) {
      return this.t("this");
    }
  }, {
    key: "reduceThrowStatement",
    value: function reduceThrowStatement(node, _ref58) {
      var expression = _ref58.expression;

      return seq(this.t("throw"), this.sep(Sep.THROW), expression, this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceTryCatchStatement",
    value: function reduceTryCatchStatement(node, _ref59) {
      var body = _ref59.body;
      var catchClause = _ref59.catchClause;

      return seq(this.t("try"), this.sep(Sep.AFTER_TRY), body, this.sep(Sep.BEFORE_CATCH), catchClause, this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceTryFinallyStatement",
    value: function reduceTryFinallyStatement(node, _ref60) {
      var body = _ref60.body;
      var catchClause = _ref60.catchClause;
      var finalizer = _ref60.finalizer;

      return seq(this.t("try"), this.sep(Sep.AFTER_TRY), body, catchClause ? seq(this.sep(Sep.BEFORE_CATCH), catchClause) : empty(), this.sep(Sep.BEFORE_FINALLY), this.t("finally"), this.sep(Sep.AFTER_FINALLY), finalizer, this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceYieldExpression",
    value: function reduceYieldExpression(node, _ref61) {
      var expression = _ref61.expression;

      if (node.expression == null) return this.t("yield");
      return seq(this.t("yield"), this.sep(Sep.YIELD), this.p(node.expression, (0, _coderep.getPrecedence)(node), expression));
    }
  }, {
    key: "reduceYieldGeneratorExpression",
    value: function reduceYieldGeneratorExpression(node, _ref62) {
      var expression = _ref62.expression;

      return seq(this.t("yield"), this.sep(Sep.BEFORE_YIELD_STAR), this.t("*"), this.sep(Sep.AFTER_YIELD_STAR), this.p(node.expression, (0, _coderep.getPrecedence)(node), expression));
    }
  }, {
    key: "reduceDirective",
    value: function reduceDirective(node) {
      var delim = /^(?:[^"\\]|\\.)*$/.test(node.rawValue) ? "\"" : "'";
      return seq(this.t(delim + node.rawValue + delim), this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceVariableDeclaration",
    value: function reduceVariableDeclaration(node, _ref63) {
      var declarators = _ref63.declarators;

      return seq(this.t(node.kind), this.sep(Sep.VARIABLE_DECLARATION), this.commaSep(declarators, Sep.DECLARATORS_BEFORE_COMMA, Sep.DECLARATORS_AFTER_COMMA));
    }
  }, {
    key: "reduceVariableDeclarationStatement",
    value: function reduceVariableDeclarationStatement(node, _ref64) {
      var declaration = _ref64.declaration;

      return seq(declaration, this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceVariableDeclarator",
    value: function reduceVariableDeclarator(node, _ref65) {
      var binding = _ref65.binding;
      var init = _ref65.init;

      var containsIn = init && init.containsIn && !init.containsGroup;
      if (init) {
        if (init.containsGroup) {
          init = this.paren(init, Sep.EXPRESSION_PAREN_BEFORE, Sep.EXPRESSION_PAREN_AFTER);
        } else {
          init = markContainsIn(init);
        }
      }
      return (0, _objectAssign2.default)(init == null ? binding : seq(binding, this.sep(Sep.BEFORE_INIT_EQUALS), this.t("="), this.sep(Sep.AFTER_INIT_EQUALS), init), { containsIn: containsIn });
    }
  }, {
    key: "reduceWhileStatement",
    value: function reduceWhileStatement(node, _ref66) {
      var test = _ref66.test;
      var body = _ref66.body;

      return (0, _objectAssign2.default)(seq(this.t("while"), this.sep(Sep.AFTER_WHILE), this.paren(test, Sep.WHILE_TEST_PAREN_BEFORE, Sep.WHILE_TEST_PAREN_AFTER), this.sep(Sep.BEFORE_WHILE_BODY), body, this.sep(Sep.AFTER_STATEMENT(node))), { endsWithMissingElse: body.endsWithMissingElse });
    }
  }, {
    key: "reduceWithStatement",
    value: function reduceWithStatement(node, _ref67) {
      var object = _ref67.object;
      var body = _ref67.body;

      return (0, _objectAssign2.default)(seq(this.t("with"), this.sep(Sep.AFTER_WITH), this.paren(object, Sep.WITH_PAREN_BEFORE, Sep.WITH_PAREN_AFTER), this.sep(Sep.BEFORE_WITH_BODY), body, this.sep(Sep.AFTER_STATEMENT(node))), { endsWithMissingElse: body.endsWithMissingElse });
    }
  }]);

  return ExtensibleCodeGen;
}();

var INDENT = "  ";

var Linebreak = function (_CodeRep) {
  _inherits(Linebreak, _CodeRep);

  function Linebreak() {
    _classCallCheck(this, Linebreak);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Linebreak).call(this));

    _this4.indentation = 0;
    return _this4;
  }

  _createClass(Linebreak, [{
    key: "emit",
    value: function emit(ts) {
      ts.put("\n");
      for (var i = 0; i < this.indentation; ++i) {
        ts.put(INDENT);
      }
    }
  }]);

  return Linebreak;
}(_coderep.CodeRep);

function withoutTrailingLinebreak(state) {
  if (state && state instanceof _coderep.Seq) {
    var lastChild = state.children[state.children.length - 1];
    /* istanbul ignore next */
    while (lastChild instanceof _coderep.Empty) {
      state.children.pop();
      lastChild = state.children[state.children.length - 1];
    }
    /* istanbul ignore else */
    if (lastChild instanceof _coderep.Seq) {
      withoutTrailingLinebreak(lastChild);
    } else if (lastChild instanceof Linebreak) {
      state.children.pop();
    }
  }
  return state;
}

function indent(rep, includingFinal) {
  var finalLinebreak = undefined;
  function indentNode(node) {
    if (node instanceof Linebreak) {
      finalLinebreak = node;
      ++node.indentation;
    }
  }
  rep.forEach(indentNode);
  if (!includingFinal) {
    --finalLinebreak.indentation;
  }
  return rep;
}

var FormattedCodeGen = exports.FormattedCodeGen = function (_ExtensibleCodeGen) {
  _inherits(FormattedCodeGen, _ExtensibleCodeGen);

  function FormattedCodeGen() {
    _classCallCheck(this, FormattedCodeGen);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(FormattedCodeGen).apply(this, arguments));
  }

  _createClass(FormattedCodeGen, [{
    key: "parenToAvoidBeingDirective",
    value: function parenToAvoidBeingDirective(element, original) {
      if (element && element.type === "ExpressionStatement" && element.expression.type === "LiteralStringExpression") {
        return seq(this.paren(original.children[0], Sep.PAREN_AVOIDING_DIRECTIVE_BEFORE, Sep.PAREN_AVOIDING_DIRECTIVE_AFTER), this.semiOp(), this.sep(Sep.AFTER_STATEMENT(element)));
      }
      return original;
    }
  }, {
    key: "brace",
    value: function brace(rep, node) {
      if (isEmpty(rep)) {
        return this.t("{}");
      }

      switch (node.type) {
        case "ObjectBinding":
        case "Import":
        case "ExportFrom":
        case "ObjectExpression":
          return new _coderep.Brace(rep);
      }

      rep = seq(new Linebreak(), rep);
      indent(rep, false);
      return new _coderep.Brace(rep);
    }
  }, {
    key: "reduceDoWhileStatement",
    value: function reduceDoWhileStatement(node, _ref68) {
      var body = _ref68.body;
      var test = _ref68.test;

      return seq(this.t("do"), this.sep(Sep.AFTER_DO), withoutTrailingLinebreak(body), this.sep(Sep.BEFORE_DOWHILE_WHILE), this.t("while"), this.sep(Sep.AFTER_DOWHILE_WHILE), this.paren(test, Sep.DO_WHILE_TEST_PAREN_BEFORE, Sep.DO_WHILE_TEST_PAREN_AFTER), this.semiOp(), this.sep(Sep.AFTER_STATEMENT(node)));
    }
  }, {
    key: "reduceIfStatement",
    value: function reduceIfStatement(node, _ref69) {
      var test = _ref69.test;
      var consequent = _ref69.consequent;
      var alternate = _ref69.alternate;

      if (alternate && consequent.endsWithMissingElse) {
        consequent = this.brace(consequent, node);
      }
      return (0, _objectAssign2.default)(seq(this.t("if"), this.sep(Sep.AFTER_IF), this.paren(test, Sep.IF_PAREN_BEFORE, Sep.IF_PAREN_AFTER), this.sep(Sep.AFTER_IF_TEST), withoutTrailingLinebreak(consequent), alternate ? seq(this.sep(Sep.BEFORE_ELSE), this.t("else"), this.sep(Sep.AFTER_ELSE), withoutTrailingLinebreak(alternate)) : empty(), this.sep(Sep.AFTER_STATEMENT(node))), { endsWithMissingElse: alternate ? alternate.endsWithMissingElse : true });
    }
  }, {
    key: "reduceSwitchCase",
    value: function reduceSwitchCase(node, _ref70) {
      var test = _ref70.test;
      var consequent = _ref70.consequent;

      consequent = indent(withoutTrailingLinebreak(seq.apply(undefined, [this.sep(Sep.BEFORE_CASE_BODY)].concat(_toConsumableArray(consequent)))), true);
      return seq(this.t("case"), this.sep(Sep.BEFORE_CASE_TEST), test, this.sep(Sep.AFTER_CASE_TEST), this.t(":"), consequent, this.sep(Sep.AFTER_CASE_BODY));
    }
  }, {
    key: "reduceSwitchDefault",
    value: function reduceSwitchDefault(node, _ref71) {
      var consequent = _ref71.consequent;

      consequent = indent(withoutTrailingLinebreak(seq.apply(undefined, [this.sep(Sep.BEFORE_CASE_BODY)].concat(_toConsumableArray(consequent)))), true);
      return seq(this.t("default"), this.sep(Sep.DEFAULT), this.t(":"), consequent, this.sep(Sep.AFTER_DEFAULT_BODY));
    }
  }, {
    key: "sep",
    value: function sep(separator) {
      switch (separator.type) {
        case "ARRAY_AFTER_COMMA":
        case "OBJECT_AFTER_COMMA":
        case "ARGS_AFTER_COMMA":
        case "PARAMETER_AFTER_COMMA":
        case "DECLARATORS_AFTER_COMMA":
        case "NAMED_IMPORT_AFTER_COMMA":
        case "IMPORT_AFTER_COMMA":
        case "BEFORE_DEFAULT_EQUALS":
        case "AFTER_DEFAULT_EQUALS":
        case "AFTER_PROP":
        case "BEFORE_JUMP_LABEL":
        case "BEFORE_CATCH":
        case "BEFORE_CATCH_BINDING":
        case "AFTER_CATCH_BINDING":
        case "BEFORE_CLASS_NAME":
        case "BEFORE_EXTENDS":
        case "AFTER_EXTENDS":
        case "BEFORE_CLASS_DECLARATION_ELEMENTS":
        case "BEFORE_CLASS_EXPRESSION_ELEMENTS":
        case "AFTER_STATIC":
        case "BEFORE_TERNARY_QUESTION":
        case "AFTER_TERNARY_QUESTION":
        case "BEFORE_TERNARY_COLON":
        case "AFTER_TERNARY_COLON":
        case "AFTER_DO":
        case "BEFORE_DOWHILE_WHILE":
        case "AFTER_DOWHILE_WHILE":
        case "AFTER_FORIN_FOR":
        case "BEFORE_FORIN_IN":
        case "AFTER_FORIN_FOR":
        case "BEFORE_FORIN_BODY":
        case "AFTER_FOROF_FOR":
        case "BEFORE_FOROF_OF":
        case "AFTER_FOROF_FOR":
        case "BEFORE_FOROF_BODY":
        case "AFTER_FOR_FOR":
        case "BEFORE_FOR_TEST":
        case "BEFORE_FOR_UPDATE":
        case "BEFORE_FOR_BODY":
        case "BEFORE_FUNCTION_DECLARATION_BODY":
        case "BEFORE_FUNCTION_EXPRESSION_BODY":
        case "BEFORE_ARROW":
        case "AFTER_ARROW":
        case "AFTER_GET":
        case "BEFORE_GET_BODY":
        case "AFTER_IF":
        case "AFTER_IF_TEST":
        case "BEFORE_ELSE":
        case "AFTER_ELSE":
        case "BEFORE_IMPORT_BINDINGS":
        case "BEFORE_IMPORT_MODULE":
        case "AFTER_IMPORT_BINDINGS":
        case "AFTER_FROM":
        case "BEFORE_IMPORT_NAMESPACE":
        case "BEFORE_IMPORT_STAR":
        case "AFTER_IMPORT_STAR":
        case "AFTER_IMPORT_AS":
        case "AFTER_NAMESPACE_BINDING":
        case "BEFORE_IMPORT_AS":
        case "AFTER_IMPORT_AS":
        case "EXPORTS_AFTER_COMMA":
        case "BEFORE_EXPORT_STAR":
        case "AFTER_EXPORT_STAR":
        case "BEFORE_EXPORT_BINDINGS":
        case "AFTER_EXPORT_BINDINGS":
        case "AFTER_EXPORT":
        case "AFTER_EXPORT_DEFAULT":
        case "BEFORE_EXPORT_AS":
        case "AFTER_EXPORT_AS":
        case "AFTER_LABEL_COLON":
        case "BEFORE_METHOD_BODY":
        case "AFTER_NEW":
        case "RETURN":
        case "AFTER_SET":
        case "BEFORE_SET_BODY":
        case "BEFORE_SET_PARAMS":
        case "BEFORE_CASE_TEST":
        case "BEFORE_SWITCH_DISCRIM":
        case "BEFORE_SWITCH_BODY":
        case "THROW":
        case "AFTER_TRY":
        case "BEFORE_CATCH":
        case "BEFORE_FINALLY":
        case "AFTER_FINALLY":
        case "VARIABLE_DECLARATION":
        case "YIELD":
        case "AFTER_YIELD_STAR":
        case "DECLARATORS_AFTER_COMMA":
        case "BEFORE_INIT_EQUALS":
        case "AFTER_INIT_EQUALS":
        case "AFTER_WHILE":
        case "BEFORE_WHILE_BODY":
        case "AFTER_WITH":
        case "BEFORE_WITH_BODY":
        case "BEFORE_FUNCTION_NAME":
        case "AFTER_BINOP":
        case "BEFORE_ASSIGN_OP":
        case "AFTER_ASSIGN_OP":
          return this.t(" ");
        case "AFTER_STATEMENT":
          switch (separator.node.type) {
            case "ForInStatement":
            case "ForOfStatement":
            case "ForStatement":
            case "WhileStatement":
            case "WithStatement":
              return empty(); // because those already end with an AFTER_STATEMENT
            default:
              return new Linebreak();
          }
        case "AFTER_CLASS_ELEMENT":
        case "BEFORE_CASE_BODY":
        case "AFTER_CASE_BODY":
        case "AFTER_DEFAULT_BODY":
          return new Linebreak();
        case "BEFORE_BINOP":
          return separator.op === "," ? empty() : this.t(" ");
        case "UNARY":
          return separator.op === "delete" || separator.op === "void" || separator.op === "typeof" ? this.t(" ") : empty();
        default:
          return empty();
      }
    }
  }]);

  return FormattedCodeGen;
}(ExtensibleCodeGen);