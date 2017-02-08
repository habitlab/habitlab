"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MonoidalReducer = exports.CloneReducer = undefined;
exports.default = reduce;

var _cloneReducer = require("./clone-reducer");

Object.defineProperty(exports, "CloneReducer", {
  enumerable: true,
  get: function get() {
    return _cloneReducer.default;
  }
});

var _monoidalReducer = require("./monoidal-reducer");

Object.defineProperty(exports, "MonoidalReducer", {
  enumerable: true,
  get: function get() {
    return _monoidalReducer.default;
  }
});

var _shiftSpec = require("shift-spec");

var _shiftSpec2 = _interopRequireDefault(_shiftSpec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformWithSpec(transformer, node, spec) {
  switch (spec.typeName) {
    case "Enum":
    case "String":
    case "Number":
    case "Boolean":
    case "SourceSpan":
      return node;
    case "Const":
      // TODO: checked version
      return transformWithSpec(transformer, node, spec.argument);
    case "Maybe":
      return node && transformWithSpec(transformer, node, spec.argument);
    case "List":
      return node.map(function (e) {
        return transformWithSpec(transformer, e, spec.argument);
      });
    case "Union":
      // TODO: checked version
      return transformWithSpec(transformer, node, _shiftSpec2.default[node.type]);
    default:
      var state = {};
      spec.fields.forEach(function (field) {
        var v = transformWithSpec(transformer, node[field.name], field.type);
        state[field.name] = v == null ? null : v;
      });
      if (typeof transformer["reduce" + node.type] !== "function") {
        throw new Error("Encountered " + node.type + ", which the provided reducer does not handle.");
      }
      return transformer["reduce" + node.type](node, state);
  }
} /**
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

function reduce(reducer, reducible) {
  return transformWithSpec(reducer, reducible, _shiftSpec2.default[reducible.type]);
}