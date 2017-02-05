"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shiftSpec = require("shift-spec");

var _shiftSpec2 = _interopRequireDefault(_shiftSpec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var methods = {};

function id(x) {
  return x;
}

function handlerForFieldOfType(type) {
  switch (type.typeName) {
    case "Enum":
    case "String":
    case "Boolean":
    case "Number":
    case "SourceSpan":
      return null;
    case "Const":
      return handlerForFieldOfType(type.argument);
    case "Maybe":
      {
        var _ret = function () {
          var subHandler = handlerForFieldOfType(type.argument);
          if (subHandler == null) return {
              v: null
            };
          return {
            v: function v(t) {
              return t == null ? this.identity : subHandler.call(this, t);
            }
          };
        }();

        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
      }
    case "List":
      {
        var _ret2 = function () {
          var subHandler = handlerForFieldOfType(type.argument);
          if (subHandler == null) return {
              v: null
            };
          return {
            v: function v(t) {
              var _this = this;

              return this.fold(t.map(function (x) {
                return subHandler.call(_this, x);
              }));
            }
          };
        }();

        if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
      }
    default:
      return id;
  }
}

var _loop = function _loop(typeName) {
  var type = _shiftSpec2.default[typeName];

  var handlers = {};
  type.fields.forEach(function (field) {
    var handler = handlerForFieldOfType(field.type);
    if (handler != null) handlers[field.name] = handler;
  });
  var fieldNames = Object.keys(handlers);

  methods["reduce" + typeName] = {
    value: function value(node, state) {
      var _this3 = this;

      return this.fold(fieldNames.map(function (fieldName) {
        return handlers[fieldName].call(_this3, state[fieldName]);
      }));
    }
  };
};

for (var typeName in _shiftSpec2.default) {
  _loop(typeName);
}

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
    key: "fold",
    value: function fold(list, a) {
      var _this2 = this;

      return list.reduce(function (memo, x) {
        return _this2.append(memo, x);
      }, a == null ? this.identity : a);
    }
  }]);

  return MonoidalReducer;
}();

exports.default = MonoidalReducer;

Object.defineProperties(MonoidalReducer.prototype, methods);