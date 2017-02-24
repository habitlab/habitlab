"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SemiOp = exports.CommaSep = exports.Semi = exports.Seq = exports.ContainsIn = exports.NoIn = exports.Brace = exports.Bracket = exports.Paren = exports.NumberCodeRep = exports.Token = exports.Empty = exports.CodeRep = exports.escapeStringLiteral = exports.getPrecedence = exports.Precedence = exports.Sep = exports.FormattedCodeGen = exports.ExtensibleCodeGen = exports.MinimalCodeGen = undefined;
exports.default = codeGen;

var _minimalCodegen = require("./minimal-codegen");

Object.defineProperty(exports, "MinimalCodeGen", {
  enumerable: true,
  get: function get() {
    return _minimalCodegen.default;
  }
});

var _formattedCodegen = require("./formatted-codegen");

Object.defineProperty(exports, "ExtensibleCodeGen", {
  enumerable: true,
  get: function get() {
    return _formattedCodegen.ExtensibleCodeGen;
  }
});
Object.defineProperty(exports, "FormattedCodeGen", {
  enumerable: true,
  get: function get() {
    return _formattedCodegen.FormattedCodeGen;
  }
});
Object.defineProperty(exports, "Sep", {
  enumerable: true,
  get: function get() {
    return _formattedCodegen.Sep;
  }
});

var _coderep = require("./coderep");

Object.defineProperty(exports, "Precedence", {
  enumerable: true,
  get: function get() {
    return _coderep.Precedence;
  }
});
Object.defineProperty(exports, "getPrecedence", {
  enumerable: true,
  get: function get() {
    return _coderep.getPrecedence;
  }
});
Object.defineProperty(exports, "escapeStringLiteral", {
  enumerable: true,
  get: function get() {
    return _coderep.escapeStringLiteral;
  }
});
Object.defineProperty(exports, "CodeRep", {
  enumerable: true,
  get: function get() {
    return _coderep.CodeRep;
  }
});
Object.defineProperty(exports, "Empty", {
  enumerable: true,
  get: function get() {
    return _coderep.Empty;
  }
});
Object.defineProperty(exports, "Token", {
  enumerable: true,
  get: function get() {
    return _coderep.Token;
  }
});
Object.defineProperty(exports, "NumberCodeRep", {
  enumerable: true,
  get: function get() {
    return _coderep.NumberCodeRep;
  }
});
Object.defineProperty(exports, "Paren", {
  enumerable: true,
  get: function get() {
    return _coderep.Paren;
  }
});
Object.defineProperty(exports, "Bracket", {
  enumerable: true,
  get: function get() {
    return _coderep.Bracket;
  }
});
Object.defineProperty(exports, "Brace", {
  enumerable: true,
  get: function get() {
    return _coderep.Brace;
  }
});
Object.defineProperty(exports, "NoIn", {
  enumerable: true,
  get: function get() {
    return _coderep.NoIn;
  }
});
Object.defineProperty(exports, "ContainsIn", {
  enumerable: true,
  get: function get() {
    return _coderep.ContainsIn;
  }
});
Object.defineProperty(exports, "Seq", {
  enumerable: true,
  get: function get() {
    return _coderep.Seq;
  }
});
Object.defineProperty(exports, "Semi", {
  enumerable: true,
  get: function get() {
    return _coderep.Semi;
  }
});
Object.defineProperty(exports, "CommaSep", {
  enumerable: true,
  get: function get() {
    return _coderep.CommaSep;
  }
});
Object.defineProperty(exports, "SemiOp", {
  enumerable: true,
  get: function get() {
    return _coderep.SemiOp;
  }
});

var _shiftReducer = require("shift-reducer");

var _shiftReducer2 = _interopRequireDefault(_shiftReducer);

var _token_stream = require("./token_stream");

var _minimalCodegen2 = _interopRequireDefault(_minimalCodegen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function codeGen(script) {
  var generator = arguments.length <= 1 || arguments[1] === undefined ? new _minimalCodegen2.default() : arguments[1];

  var ts = new _token_stream.TokenStream();
  var rep = (0, _shiftReducer2.default)(generator, script);
  rep.emit(ts);
  return ts.result;
}