"use strict";

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenStream = undefined;

var _esutils = require("esutils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function numberDot(fragment) {
  if (fragment.indexOf(".") < 0 && fragment.indexOf("e") < 0) {
    return "..";
  }
  return ".";
}

function renderNumber(n) {
  var s;
  if (n >= 1e3 && n % 10 === 0) {
    s = n.toString(10);
    if (/[eE]/.test(s)) {
      return s.replace(/[eE]\+/, "e");
    }
    return n.toString(10).replace(/0+$/, function (match) {
      return "e" + match.length;
    });
  } else if (n % 1 === 0) {
    if (n > 1e15 && n < 1e20) {
      return "0x" + n.toString(16).toUpperCase();
    }
    return n.toString(10).replace(/[eE]\+/, "e");
  } else {
    return n.toString(10).replace(/^0\./, ".").replace(/[eE]\+/, "e");
  }
}

var TokenStream = exports.TokenStream = function () {
  function TokenStream() {
    _classCallCheck(this, TokenStream);

    this.result = "";
    this.lastNumber = null;
    this.lastChar = null;
    this.optionalSemi = false;
  }

  _createClass(TokenStream, [{
    key: "putNumber",
    value: function putNumber(number) {
      var tokenStr = renderNumber(number);
      this.put(tokenStr);
      this.lastNumber = tokenStr;
    }
  }, {
    key: "putOptionalSemi",
    value: function putOptionalSemi() {
      this.optionalSemi = true;
    }
  }, {
    key: "put",
    value: function put(tokenStr) {
      if (this.optionalSemi) {
        this.optionalSemi = false;
        if (tokenStr !== "}") {
          this.put(";");
        }
      }
      if (this.lastNumber !== null && tokenStr.length == 1) {
        if (tokenStr === ".") {
          this.result += numberDot(this.lastNumber);
          this.lastNumber = null;
          this.lastChar = ".";
          return;
        }
      }
      this.lastNumber = null;
      var rightChar = tokenStr.charAt(0);
      var lastChar = this.lastChar;
      this.lastChar = tokenStr.charAt(tokenStr.length - 1);
      if (lastChar && ((lastChar == "+" || lastChar == "-") && lastChar == rightChar || _esutils.code.isIdentifierPartES6(lastChar.charCodeAt(0)) && _esutils.code.isIdentifierPartES6(rightChar.charCodeAt(0)) || lastChar == "/" && rightChar == "i")) {
        this.result += " ";
      }

      this.result += tokenStr;
    }
  }]);

  return TokenStream;
}();