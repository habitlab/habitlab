"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shiftSpec = require("shift-spec");

var _shiftSpec2 = _interopRequireDefault(_shiftSpec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
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

var CloneReducer = function CloneReducer() {
  _classCallCheck(this, CloneReducer);
};

exports.default = CloneReducer;

for (var typeName in _shiftSpec2.default) {
  var type = _shiftSpec2.default[typeName];
  Object.defineProperty(CloneReducer.prototype, "reduce" + typeName, {
    value: function value(node, state) {
      return state;
    }
  });
}