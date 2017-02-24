"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
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

var PatternAcceptor = exports.PatternAcceptor = function () {
  function PatternAcceptor(pattern, u) {
    _classCallCheck(this, PatternAcceptor);

    this.index = 0;
    this.nCapturingParens = 0;
    // constants
    this.length = pattern.length;
    this.pattern = pattern;
    this.u = u;
  }

  _createClass(PatternAcceptor, [{
    key: "eat",
    value: function eat(ch) {
      if (this.index >= this.length || this.pattern[this.index] !== ch) return false;
      ++this.index;
      return true;
    }
  }, {
    key: "eatRegExp",
    value: function eatRegExp(r) {
      if (this.index >= this.length || !r.test(this.pattern[this.index])) return false;
      ++this.index;
      return true;
    }
  }, {
    key: "eatN",
    value: function eatN(n, r) {
      if (this.index + n <= this.length && r.test(this.pattern.slice(this.index, this.index + n))) {
        this.index += n;
        return true;
      }
      return false;
    }
  }, {
    key: "match",
    value: function match(ch) {
      return this.index < this.length && this.pattern[this.index] === ch;
    }
  }, {
    key: "matchRegExp",
    value: function matchRegExp(r) {
      return this.index < this.length && r.test(this.pattern[this.index]);
    }
  }, {
    key: "trackback",
    value: function trackback(start, result) {
      if (result) return true;
      this.index = start;
      return false;
    }
  }, {
    key: "readDisjunction",
    value: function readDisjunction() {
      return this.readAlternative() && (this.eat("|") ? this.readDisjunction() : true);
    }
  }, {
    key: "readAlternative",
    value: function readAlternative() {
      var savedIndex = this.index;
      while (this.readTerm()) {
        savedIndex = this.index;
      }
      this.index = savedIndex;
      return true;
    }
  }, {
    key: "readTerm",
    value: function readTerm() {
      if (!this.u) return this.readExtendedTerm();
      return this.readAssertion() || this.readQuantifiableAssertion() || this.readAtom() && (this.readQuantifier(), true);
    }
  }, {
    key: "readExtendedTerm",
    value: function readExtendedTerm() {
      return this.readQuantifiableAssertion() && (this.readQuantifier(), true) || this.readAssertion() || this.readAtomNoBrace() && (this.readQuantifier(), true) || this.readAtom();
    }
  }, {
    key: "readAssertion",
    value: function readAssertion() {
      return this.eat("^") || this.eat("$") || this.eatN(2, /^\\[bB]$/);
    }
  }, {
    key: "readQuantifiableAssertion",
    value: function readQuantifiableAssertion() {
      var start = this.index;
      return this.eatN(3, /^\(\?[=!]$/) && this.trackback(start, this.readDisjunction() && this.eat(")"));
    }
  }, {
    key: "readQuantifier",
    value: function readQuantifier() {
      return this.readQuantifierPrefix() && (this.eat("?"), true);
    }
  }, {
    key: "readQuantifierPrefix",
    value: function readQuantifierPrefix() {
      if (this.eat("*") || this.eat("+") || this.eat("?")) return true;
      if (this.eat("{") && this.readDecimalDigits()) {
        if (this.eat(",")) this.readDecimalDigits();
        return this.eat("}");
      }
      return false;
    }
  }, {
    key: "readDecimalDigits",
    value: function readDecimalDigits() {
      var start = this.index;
      while (this.eatRegExp(/^\d$/)) {}
      return this.index > start;
    }
  }, {
    key: "readAtomNoBrace",
    value: function readAtomNoBrace() {
      var start = this.index;
      var startingParens = this.nCapturingParens;
      if (this.readPatternCharacterNoBrace() || this.eat(".")) return true;
      if (this.eat("\\")) return this.trackback(start, this.readAtomEscape());
      if (this.readCharacterClass()) return true;
      if (this.eat("(")) {
        if (!this.eatN(2, /^\?:$/)) ++this.nCapturingParens;
        if (this.readDisjunction() && this.eat(")")) return true;
        this.nCapturingParens = startingParens;
        this.index = start;
        return false;
      }
      return false;
    }
  }, {
    key: "readAtom",
    value: function readAtom() {
      return this.readAtomNoBrace() || this.eat("{") || this.eat("}");
    }
  }, {
    key: "readSyntaxCharacter",
    value: function readSyntaxCharacter() {
      return this.eatRegExp(/^[\^$\\.*+?()[\]{}|]$/);
    }
  }, {
    key: "readPatternCharacterNoBrace",
    value: function readPatternCharacterNoBrace() {
      return this.eatRegExp(/^[^\^$\\.*+?()[\]{}|]$/);
    }
  }, {
    key: "readAtomEscape",
    value: function readAtomEscape() {
      return this.readDecimalEscape() || this.readCharacterEscape() || this.readCharacterClassEscape();
    }
  }, {
    key: "readCharacterEscape",
    value: function readCharacterEscape() {
      return this.readControlEscape() || this.eat("c") && this.readControlLetter() || this.readHexEscapeSequence() || this.readRegExpUnicodeEscapeSequence() || this.readIdentityEscape();
    }
  }, {
    key: "readControlEscape",
    value: function readControlEscape() {
      return this.eatRegExp(/^[fnrtv]$/);
    }
  }, {
    key: "readControlLetter",
    value: function readControlLetter() {
      return this.eatRegExp(/^[a-zA-Z]$/);
    }
  }, {
    key: "readHexEscapeSequence",
    value: function readHexEscapeSequence() {
      return this.eat("x") && this.readHexDigit() && this.readHexDigit();
    }
  }, {
    key: "readHexDigit",
    value: function readHexDigit() {
      return this.eatRegExp(/^[a-fA-F0-9]$/);
    }
  }, {
    key: "readRegExpUnicodeEscapeSequence",
    value: function readRegExpUnicodeEscapeSequence() {
      if (!this.eat("u")) return false;
      if (this.u) {
        if (this.eatN(4, /^D[abAB89][a-fA-F0-9]{2}$/)) {
          this.eatN(6, /^\\u[dD][c-fC-F0-9][a-fA-F0-9]{2}$/);
          return true;
        }
        return this.readHex4Digits() || this.eat("{") && this.readHexDigits() && this.eat("}");
      } else {
        return this.readHex4Digits();
      }
    }
  }, {
    key: "readHex4Digits",
    value: function readHex4Digits() {
      var k = 4;
      while (k > 0) {
        --k;
        if (!this.readHexDigit()) return false;
      }
      return true;
    }
  }, {
    key: "readHexDigits",
    value: function readHexDigits() {
      var start = this.index;
      while (this.readHexDigit()) {}
      return this.index > start;
    }
  }, {
    key: "readIdentityEscape",
    value: function readIdentityEscape() {
      if (this.u) {
        return this.readSyntaxCharacter() || this.eat("/");
      } else {
        return this.eatRegExp(/^[^a-zA-Z0-9_]$/); // TODO: SourceCharacter but not UnicodeIDContinue
      }
    }
  }, {
    key: "readDecimalEscape",
    value: function readDecimalEscape() {
      if (this.eat("0")) {
        if (!this.matchRegExp(/^\d$/)) return true;
        --this.index;
        return false;
      }
      var start = this.index;
      while (this.eatRegExp(/^\d$/)) {}
      return this.trackback(start, this.index > start && (this.u || +this.pattern.slice(start, this.index) <= this.nCapturingParens));
    }
  }, {
    key: "readCharacterClassEscape",
    value: function readCharacterClassEscape() {
      return this.eatRegExp(/^[dDsSwW]$/);
    }
  }, {
    key: "readCharacterClass",
    value: function readCharacterClass() {
      var start = this.index;
      return this.eat("[") && this.trackback(start, (this.eat("^"), true) && this.readClassRanges() && this.eat("]"));
    }
  }, {
    key: "readClassRanges",
    value: function readClassRanges() {
      var start = this.index;
      if (!this.readNonemptyClassRanges()) {
        this.index = start;
      }
      return true;
    }
  }, {
    key: "readNonemptyClassRanges",
    value: function readNonemptyClassRanges() {
      if (!this.readClassAtom()) return false;
      if (this.match("]")) return true;
      if (this.eat("-")) {
        if (this.match("]")) return true;
        return this.readClassAtom() && this.readClassRanges();
      }
      return this.readNonemptyClassRangesNoDash();
    }
  }, {
    key: "readNonemptyClassRangesNoDash",
    value: function readNonemptyClassRangesNoDash() {
      // NOTE: it is impossible to reach this next line with a value matched by RegularExpressionLiteral;
      // the pattern "[-a" would reach here if it could get past RegularExpressionLiteral
      /* istanbul ignore next */
      if (!this.readClassAtomNoDash()) return false;
      if (this.match("]")) return true;
      if (this.eat("-")) {
        if (this.match("]")) return true;
        return this.readClassAtom() && this.readClassRanges();
      }
      return this.readNonemptyClassRangesNoDash();
    }
  }, {
    key: "readClassAtom",
    value: function readClassAtom() {
      return this.eat("-") || this.readClassAtomNoDash();
    }
  }, {
    key: "readClassAtomNoDash",
    value: function readClassAtomNoDash() {
      return this.eatRegExp(/^[^\\\]-]$/) || this.eat("\\") && this.readClassEscape();
    }
  }, {
    key: "readClassEscape",
    value: function readClassEscape() {
      return this.readDecimalEscape() || this.eat("b") || this.u && this.eat("-") || this.readCharacterEscape() || this.readCharacterClassEscape();
    }
  }], [{
    key: "test",
    value: function test(pattern, u) {
      var acceptor = new PatternAcceptor(pattern, u);
      return acceptor.readDisjunction() && acceptor.index === acceptor.length;
    }
  }]);

  return PatternAcceptor;
}();