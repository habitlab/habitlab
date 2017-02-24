"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrecedence = getPrecedence;
exports.escapeStringLiteral = escapeStringLiteral;

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
  Prefix: 13,
  Postfix: 14,
  New: 15,
  Call: 16,
  TaggedTemplate: 17,
  Member: 18,
  Primary: 19
};

exports.Precedence = Precedence;

var BinaryPrecedence = {
  ",": Precedence.Sequence,
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

function getPrecedence(node) {
  switch (node.type) {
    case "ArrayExpression":
    case "FunctionExpression":
    case "IdentifierExpression":
    case "LiteralBooleanExpression":
    case "LiteralNullExpression":
    case "LiteralNumericExpression":
    case "LiteralInfinityExpression":
    case "LiteralRegExpExpression":
    case "LiteralStringExpression":
    case "ObjectExpression":
    case "ThisExpression":
      return Precedence.Primary;

    case "ArrowExpression":
    case "AssignmentExpression":
    case "CompoundAssignmentExpression":
    case "YieldExpression":
    case "YieldGeneratorExpression":
      return Precedence.Assignment;

    case "ConditionalExpression":
      return Precedence.Conditional;

    case "ComputedMemberExpression":
    case "StaticMemberExpression":
      switch (node.object.type) {
        case "CallExpression":
        case "ComputedMemberExpression":
        case "StaticMemberExpression":
        case "TemplateExpression":
          return getPrecedence(node.object);
        default:
          return Precedence.Member;
      }

    case "TemplateExpression":
      if (node.tag == null) return Precedence.Member;
      switch (node.tag.type) {
        case "CallExpression":
        case "ComputedMemberExpression":
        case "StaticMemberExpression":
        case "TemplateExpression":
          return getPrecedence(node.tag);
        default:
          return Precedence.Member;
      }

    case "BinaryExpression":
      return BinaryPrecedence[node.operator];

    case "CallExpression":
      return Precedence.Call;
    case "NewExpression":
      return node.arguments.length === 0 ? Precedence.New : Precedence.Member;
    case "UpdateExpression":
      return node.isPrefix ? Precedence.Prefix : Precedence.Postfix;
    case "UnaryExpression":
      return Precedence.Prefix;
  }
}

function escapeStringLiteral(stringValue) {
  var result = "";
  var nSingle = 0,
      nDouble = 0;
  for (var i = 0, l = stringValue.length; i < l; ++i) {
    var ch = stringValue[i];
    if (ch === "\"") {
      ++nDouble;
    } else if (ch === "'") {
      ++nSingle;
    }
  }
  var delim = nDouble > nSingle ? "'" : "\"";
  result += delim;
  for (var i = 0; i < stringValue.length; i++) {
    var ch = stringValue.charAt(i);
    switch (ch) {
      case delim:
        result += "\\" + delim;
        break;
      case "\b":
        result += "\\b";
        break;
      case "\t":
        result += "\\t";
        break;
      case "\n":
        result += "\\n";
        break;
      case "\u000b":
        result += "\\v";
        break;
      case "\f":
        result += "\\f";
        break;
      case "\r":
        result += "\\r";
        break;
      case "\\":
        result += "\\\\";
        break;
      case "\u2028":
        result += "\\u2028";
        break;
      case "\u2029":
        result += "\\u2029";
        break;
      default:
        result += ch;
        break;
    }
  }
  result += delim;
  return result;
}

var CodeRep = exports.CodeRep = function () {
  function CodeRep() {
    _classCallCheck(this, CodeRep);

    this.containsIn = false;
    this.containsGroup = false;
    // restricted lookaheads: {, function, class, let, let [
    this.startsWithCurly = false;
    this.startsWithFunctionOrClass = false;
    this.startsWithLet = false;
    this.startsWithLetSquareBracket = false;
    this.endsWithMissingElse = false;
  }

  _createClass(CodeRep, [{
    key: "forEach",
    value: function forEach(f) {
      // Call a function on every CodeRep represented by this node. Always calls f on a node and then its children, so if you're careful you can modify a node's children online.
      f(this);
    }
  }]);

  return CodeRep;
}();

var Empty = exports.Empty = function (_CodeRep) {
  _inherits(Empty, _CodeRep);

  function Empty() {
    _classCallCheck(this, Empty);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Empty).call(this));
  }

  _createClass(Empty, [{
    key: "emit",
    value: function emit() {}
  }]);

  return Empty;
}(CodeRep);

var Token = exports.Token = function (_CodeRep2) {
  _inherits(Token, _CodeRep2);

  function Token(token) {
    _classCallCheck(this, Token);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Token).call(this));

    _this2.token = token;
    return _this2;
  }

  _createClass(Token, [{
    key: "emit",
    value: function emit(ts) {
      ts.put(this.token);
    }
  }]);

  return Token;
}(CodeRep);

var NumberCodeRep = exports.NumberCodeRep = function (_CodeRep3) {
  _inherits(NumberCodeRep, _CodeRep3);

  function NumberCodeRep(number) {
    _classCallCheck(this, NumberCodeRep);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(NumberCodeRep).call(this));

    _this3.number = number;
    return _this3;
  }

  _createClass(NumberCodeRep, [{
    key: "emit",
    value: function emit(ts) {
      ts.putNumber(this.number);
    }
  }]);

  return NumberCodeRep;
}(CodeRep);

var Paren = exports.Paren = function (_CodeRep4) {
  _inherits(Paren, _CodeRep4);

  function Paren(expr) {
    _classCallCheck(this, Paren);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Paren).call(this));

    _this4.expr = expr;
    return _this4;
  }

  _createClass(Paren, [{
    key: "emit",
    value: function emit(ts) {
      ts.put("(");
      this.expr.emit(ts, false);
      ts.put(")");
    }
  }, {
    key: "forEach",
    value: function forEach(f) {
      f(this);
      this.expr.forEach(f);
    }
  }]);

  return Paren;
}(CodeRep);

var Bracket = exports.Bracket = function (_CodeRep5) {
  _inherits(Bracket, _CodeRep5);

  function Bracket(expr) {
    _classCallCheck(this, Bracket);

    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Bracket).call(this));

    _this5.expr = expr;
    return _this5;
  }

  _createClass(Bracket, [{
    key: "emit",
    value: function emit(ts) {
      ts.put("[");
      this.expr.emit(ts, false);
      ts.put("]");
    }
  }, {
    key: "forEach",
    value: function forEach(f) {
      f(this);
      this.expr.forEach(f);
    }
  }]);

  return Bracket;
}(CodeRep);

var Brace = exports.Brace = function (_CodeRep6) {
  _inherits(Brace, _CodeRep6);

  function Brace(expr) {
    _classCallCheck(this, Brace);

    var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(Brace).call(this));

    _this6.expr = expr;
    return _this6;
  }

  _createClass(Brace, [{
    key: "emit",
    value: function emit(ts) {
      ts.put("{");
      this.expr.emit(ts, false);
      ts.put("}");
    }
  }, {
    key: "forEach",
    value: function forEach(f) {
      f(this);
      this.expr.forEach(f);
    }
  }]);

  return Brace;
}(CodeRep);

var NoIn = exports.NoIn = function (_CodeRep7) {
  _inherits(NoIn, _CodeRep7);

  function NoIn(expr) {
    _classCallCheck(this, NoIn);

    var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(NoIn).call(this));

    _this7.expr = expr;
    return _this7;
  }

  _createClass(NoIn, [{
    key: "emit",
    value: function emit(ts) {
      this.expr.emit(ts, true);
    }
  }, {
    key: "forEach",
    value: function forEach(f) {
      f(this);
      this.expr.forEach(f);
    }
  }]);

  return NoIn;
}(CodeRep);

var ContainsIn = exports.ContainsIn = function (_CodeRep8) {
  _inherits(ContainsIn, _CodeRep8);

  function ContainsIn(expr) {
    _classCallCheck(this, ContainsIn);

    var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(ContainsIn).call(this));

    _this8.expr = expr;
    return _this8;
  }

  _createClass(ContainsIn, [{
    key: "emit",
    value: function emit(ts, noIn) {
      if (noIn) {
        ts.put("(");
        this.expr.emit(ts, false);
        ts.put(")");
      } else {
        this.expr.emit(ts, false);
      }
    }
  }, {
    key: "forEach",
    value: function forEach(f) {
      f(this);
      this.expr.forEach(f);
    }
  }]);

  return ContainsIn;
}(CodeRep);

var Seq = exports.Seq = function (_CodeRep9) {
  _inherits(Seq, _CodeRep9);

  function Seq(children) {
    _classCallCheck(this, Seq);

    var _this9 = _possibleConstructorReturn(this, Object.getPrototypeOf(Seq).call(this));

    _this9.children = children;
    return _this9;
  }

  _createClass(Seq, [{
    key: "emit",
    value: function emit(ts, noIn) {
      this.children.forEach(function (cr) {
        return cr.emit(ts, noIn);
      });
    }
  }, {
    key: "forEach",
    value: function forEach(f) {
      f(this);
      this.children.forEach(function (x) {
        return x.forEach(f);
      });
    }
  }]);

  return Seq;
}(CodeRep);

var Semi = exports.Semi = function (_Token) {
  _inherits(Semi, _Token);

  function Semi() {
    _classCallCheck(this, Semi);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Semi).call(this, ";"));
  }

  return Semi;
}(Token);

var CommaSep = exports.CommaSep = function (_CodeRep10) {
  _inherits(CommaSep, _CodeRep10);

  function CommaSep(children) {
    _classCallCheck(this, CommaSep);

    var _this11 = _possibleConstructorReturn(this, Object.getPrototypeOf(CommaSep).call(this));

    _this11.children = children;
    return _this11;
  }

  _createClass(CommaSep, [{
    key: "emit",
    value: function emit(ts, noIn) {
      var first = true;
      this.children.forEach(function (cr) {
        if (first) {
          first = false;
        } else {
          ts.put(",");
        }
        cr.emit(ts, noIn);
      });
    }
  }, {
    key: "forEach",
    value: function forEach(f) {
      f(this);
      this.children.forEach(function (x) {
        return x.forEach(f);
      });
    }
  }]);

  return CommaSep;
}(CodeRep);

var SemiOp = exports.SemiOp = function (_CodeRep11) {
  _inherits(SemiOp, _CodeRep11);

  function SemiOp() {
    _classCallCheck(this, SemiOp);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(SemiOp).call(this));
  }

  _createClass(SemiOp, [{
    key: "emit",
    value: function emit(ts) {
      ts.putOptionalSemi();
    }
  }]);

  return SemiOp;
}(CodeRep);