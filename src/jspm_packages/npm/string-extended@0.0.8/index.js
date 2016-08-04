(function () {
    "use strict";

    function defineString(extended, is, date, arr) {

        var stringify;
        if (typeof JSON === "undefined") {
            /*
             json2.js
             2012-10-08

             Public Domain.

             NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
             */

            (function () {
                function f(n) {
                    // Format integers to have at least two digits.
                    return n < 10 ? '0' + n : n;
                }

                var isPrimitive = is.tester().isString().isNumber().isBoolean().tester();

                function toJSON(obj) {
                    if (is.isDate(obj)) {
                        return isFinite(obj.valueOf()) ? obj.getUTCFullYear() + '-' +
                            f(obj.getUTCMonth() + 1) + '-' +
                            f(obj.getUTCDate()) + 'T' +
                            f(obj.getUTCHours()) + ':' +
                            f(obj.getUTCMinutes()) + ':' +
                            f(obj.getUTCSeconds()) + 'Z'
                            : null;
                    } else if (isPrimitive(obj)) {
                        return obj.valueOf();
                    }
                    return obj;
                }

                var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    gap,
                    indent,
                    meta = {    // table of character substitutions
                        '\b': '\\b',
                        '\t': '\\t',
                        '\n': '\\n',
                        '\f': '\\f',
                        '\r': '\\r',
                        '"': '\\"',
                        '\\': '\\\\'
                    },
                    rep;


                function quote(string) {
                    escapable.lastIndex = 0;
                    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                        var c = meta[a];
                        return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    }) + '"' : '"' + string + '"';
                }


                function str(key, holder) {

                    var i, k, v, length, mind = gap, partial, value = holder[key];
                    if (value) {
                        value = toJSON(value);
                    }
                    if (typeof rep === 'function') {
                        value = rep.call(holder, key, value);
                    }
                    switch (typeof value) {
                    case 'string':
                        return quote(value);
                    case 'number':
                        return isFinite(value) ? String(value) : 'null';
                    case 'boolean':
                    case 'null':
                        return String(value);
                    case 'object':
                        if (!value) {
                            return 'null';
                        }
                        gap += indent;
                        partial = [];
                        if (Object.prototype.toString.apply(value) === '[object Array]') {
                            length = value.length;
                            for (i = 0; i < length; i += 1) {
                                partial[i] = str(i, value) || 'null';
                            }
                            v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                            gap = mind;
                            return v;
                        }
                        if (rep && typeof rep === 'object') {
                            length = rep.length;
                            for (i = 0; i < length; i += 1) {
                                if (typeof rep[i] === 'string') {
                                    k = rep[i];
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                        } else {
                            for (k in value) {
                                if (Object.prototype.hasOwnProperty.call(value, k)) {
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                        }
                        v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                        gap = mind;
                        return v;
                    }
                }

                stringify = function (value, replacer, space) {
                    var i;
                    gap = '';
                    indent = '';
                    if (typeof space === 'number') {
                        for (i = 0; i < space; i += 1) {
                            indent += ' ';
                        }
                    } else if (typeof space === 'string') {
                        indent = space;
                    }
                    rep = replacer;
                    if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                            typeof replacer.length !== 'number')) {
                        throw new Error('JSON.stringify');
                    }
                    return str('', {'': value});
                };
            }());
        } else {
            stringify = JSON.stringify;
        }


        var isHash = is.isHash, aSlice = Array.prototype.slice;

        var FORMAT_REGEX = /%((?:-?\+?.?\d*)?|(?:\[[^\[|\]]*\]))?([sjdDZ])/g;
        var INTERP_REGEX = /\{(?:\[([^\[|\]]*)\])?(\w+)\}/g;
        var STR_FORMAT = /(-?)(\+?)([A-Z|a-z|\W]?)([1-9][0-9]*)?$/;
        var OBJECT_FORMAT = /([1-9][0-9]*)$/g;

        function formatString(string, format) {
            var ret = string;
            if (STR_FORMAT.test(format)) {
                var match = format.match(STR_FORMAT);
                var isLeftJustified = match[1], padChar = match[3], width = match[4];
                if (width) {
                    width = parseInt(width, 10);
                    if (ret.length < width) {
                        ret = pad(ret, width, padChar, isLeftJustified);
                    } else {
                        ret = truncate(ret, width);
                    }
                }
            }
            return ret;
        }

        function formatNumber(number, format) {
            var ret;
            if (is.isNumber(number)) {
                ret = "" + number;
                if (STR_FORMAT.test(format)) {
                    var match = format.match(STR_FORMAT);
                    var isLeftJustified = match[1], signed = match[2], padChar = match[3], width = match[4];
                    if (signed) {
                        ret = (number > 0 ? "+" : "") + ret;
                    }
                    if (width) {
                        width = parseInt(width, 10);
                        if (ret.length < width) {
                            ret = pad(ret, width, padChar || "0", isLeftJustified);
                        } else {
                            ret = truncate(ret, width);
                        }
                    }

                }
            } else {
                throw new Error("stringExtended.format : when using %d the parameter must be a number!");
            }
            return ret;
        }

        function formatObject(object, format) {
            var ret, match = format.match(OBJECT_FORMAT), spacing = 0;
            if (match) {
                spacing = parseInt(match[0], 10);
                if (isNaN(spacing)) {
                    spacing = 0;
                }
            }
            try {
                ret = stringify(object, null, spacing);
            } catch (e) {
                throw new Error("stringExtended.format : Unable to parse json from ", object);
            }
            return ret;
        }


        var styles = {
            //styles
            bold: 1,
            bright: 1,
            italic: 3,
            underline: 4,
            blink: 5,
            inverse: 7,
            crossedOut: 9,

            red: 31,
            green: 32,
            yellow: 33,
            blue: 34,
            magenta: 35,
            cyan: 36,
            white: 37,

            redBackground: 41,
            greenBackground: 42,
            yellowBackground: 43,
            blueBackground: 44,
            magentaBackground: 45,
            cyanBackground: 46,
            whiteBackground: 47,

            encircled: 52,
            overlined: 53,
            grey: 90,
            black: 90
        };

        var characters = {
            SMILEY: "☺",
            SOLID_SMILEY: "☻",
            HEART: "♥",
            DIAMOND: "♦",
            CLOVE: "♣",
            SPADE: "♠",
            DOT: "•",
            SQUARE_CIRCLE: "◘",
            CIRCLE: "○",
            FILLED_SQUARE_CIRCLE: "◙",
            MALE: "♂",
            FEMALE: "♀",
            EIGHT_NOTE: "♪",
            DOUBLE_EIGHTH_NOTE: "♫",
            SUN: "☼",
            PLAY: "►",
            REWIND: "◄",
            UP_DOWN: "↕",
            PILCROW: "¶",
            SECTION: "§",
            THICK_MINUS: "▬",
            SMALL_UP_DOWN: "↨",
            UP_ARROW: "↑",
            DOWN_ARROW: "↓",
            RIGHT_ARROW: "→",
            LEFT_ARROW: "←",
            RIGHT_ANGLE: "∟",
            LEFT_RIGHT_ARROW: "↔",
            TRIANGLE: "▲",
            DOWN_TRIANGLE: "▼",
            HOUSE: "⌂",
            C_CEDILLA: "Ç",
            U_UMLAUT: "ü",
            E_ACCENT: "é",
            A_LOWER_CIRCUMFLEX: "â",
            A_LOWER_UMLAUT: "ä",
            A_LOWER_GRAVE_ACCENT: "à",
            A_LOWER_CIRCLE_OVER: "å",
            C_LOWER_CIRCUMFLEX: "ç",
            E_LOWER_CIRCUMFLEX: "ê",
            E_LOWER_UMLAUT: "ë",
            E_LOWER_GRAVE_ACCENT: "è",
            I_LOWER_UMLAUT: "ï",
            I_LOWER_CIRCUMFLEX: "î",
            I_LOWER_GRAVE_ACCENT: "ì",
            A_UPPER_UMLAUT: "Ä",
            A_UPPER_CIRCLE: "Å",
            E_UPPER_ACCENT: "É",
            A_E_LOWER: "æ",
            A_E_UPPER: "Æ",
            O_LOWER_CIRCUMFLEX: "ô",
            O_LOWER_UMLAUT: "ö",
            O_LOWER_GRAVE_ACCENT: "ò",
            U_LOWER_CIRCUMFLEX: "û",
            U_LOWER_GRAVE_ACCENT: "ù",
            Y_LOWER_UMLAUT: "ÿ",
            O_UPPER_UMLAUT: "Ö",
            U_UPPER_UMLAUT: "Ü",
            CENTS: "¢",
            POUND: "£",
            YEN: "¥",
            CURRENCY: "¤",
            PTS: "₧",
            FUNCTION: "ƒ",
            A_LOWER_ACCENT: "á",
            I_LOWER_ACCENT: "í",
            O_LOWER_ACCENT: "ó",
            U_LOWER_ACCENT: "ú",
            N_LOWER_TILDE: "ñ",
            N_UPPER_TILDE: "Ñ",
            A_SUPER: "ª",
            O_SUPER: "º",
            UPSIDEDOWN_QUESTION: "¿",
            SIDEWAYS_L: "⌐",
            NEGATION: "¬",
            ONE_HALF: "½",
            ONE_FOURTH: "¼",
            UPSIDEDOWN_EXCLAMATION: "¡",
            DOUBLE_LEFT: "«",
            DOUBLE_RIGHT: "»",
            LIGHT_SHADED_BOX: "░",
            MEDIUM_SHADED_BOX: "▒",
            DARK_SHADED_BOX: "▓",
            VERTICAL_LINE: "│",
            MAZE__SINGLE_RIGHT_T: "┤",
            MAZE_SINGLE_RIGHT_TOP: "┐",
            MAZE_SINGLE_RIGHT_BOTTOM_SMALL: "┘",
            MAZE_SINGLE_LEFT_TOP_SMALL: "┌",
            MAZE_SINGLE_LEFT_BOTTOM_SMALL: "└",
            MAZE_SINGLE_LEFT_T: "├",
            MAZE_SINGLE_BOTTOM_T: "┴",
            MAZE_SINGLE_TOP_T: "┬",
            MAZE_SINGLE_CENTER: "┼",
            MAZE_SINGLE_HORIZONTAL_LINE: "─",
            MAZE_SINGLE_RIGHT_DOUBLECENTER_T: "╡",
            MAZE_SINGLE_RIGHT_DOUBLE_BL: "╛",
            MAZE_SINGLE_RIGHT_DOUBLE_T: "╢",
            MAZE_SINGLE_RIGHT_DOUBLEBOTTOM_TOP: "╖",
            MAZE_SINGLE_RIGHT_DOUBLELEFT_TOP: "╕",
            MAZE_SINGLE_LEFT_DOUBLE_T: "╞",
            MAZE_SINGLE_BOTTOM_DOUBLE_T: "╧",
            MAZE_SINGLE_TOP_DOUBLE_T: "╤",
            MAZE_SINGLE_TOP_DOUBLECENTER_T: "╥",
            MAZE_SINGLE_BOTTOM_DOUBLECENTER_T: "╨",
            MAZE_SINGLE_LEFT_DOUBLERIGHT_BOTTOM: "╘",
            MAZE_SINGLE_LEFT_DOUBLERIGHT_TOP: "╒",
            MAZE_SINGLE_LEFT_DOUBLEBOTTOM_TOP: "╓",
            MAZE_SINGLE_LEFT_DOUBLETOP_BOTTOM: "╙",
            MAZE_SINGLE_LEFT_TOP: "Γ",
            MAZE_SINGLE_RIGHT_BOTTOM: "╜",
            MAZE_SINGLE_LEFT_CENTER: "╟",
            MAZE_SINGLE_DOUBLECENTER_CENTER: "╫",
            MAZE_SINGLE_DOUBLECROSS_CENTER: "╪",
            MAZE_DOUBLE_LEFT_CENTER: "╣",
            MAZE_DOUBLE_VERTICAL: "║",
            MAZE_DOUBLE_RIGHT_TOP: "╗",
            MAZE_DOUBLE_RIGHT_BOTTOM: "╝",
            MAZE_DOUBLE_LEFT_BOTTOM: "╚",
            MAZE_DOUBLE_LEFT_TOP: "╔",
            MAZE_DOUBLE_BOTTOM_T: "╩",
            MAZE_DOUBLE_TOP_T: "╦",
            MAZE_DOUBLE_LEFT_T: "╠",
            MAZE_DOUBLE_HORIZONTAL: "═",
            MAZE_DOUBLE_CROSS: "╬",
            SOLID_RECTANGLE: "█",
            THICK_LEFT_VERTICAL: "▌",
            THICK_RIGHT_VERTICAL: "▐",
            SOLID_SMALL_RECTANGLE_BOTTOM: "▄",
            SOLID_SMALL_RECTANGLE_TOP: "▀",
            PHI_UPPER: "Φ",
            INFINITY: "∞",
            INTERSECTION: "∩",
            DEFINITION: "≡",
            PLUS_MINUS: "±",
            GT_EQ: "≥",
            LT_EQ: "≤",
            THEREFORE: "⌠",
            SINCE: "∵",
            DOESNOT_EXIST: "∄",
            EXISTS: "∃",
            FOR_ALL: "∀",
            EXCLUSIVE_OR: "⊕",
            BECAUSE: "⌡",
            DIVIDE: "÷",
            APPROX: "≈",
            DEGREE: "°",
            BOLD_DOT: "∙",
            DOT_SMALL: "·",
            CHECK: "√",
            ITALIC_X: "✗",
            SUPER_N: "ⁿ",
            SQUARED: "²",
            CUBED: "³",
            SOLID_BOX: "■",
            PERMILE: "‰",
            REGISTERED_TM: "®",
            COPYRIGHT: "©",
            TRADEMARK: "™",
            BETA: "β",
            GAMMA: "γ",
            ZETA: "ζ",
            ETA: "η",
            IOTA: "ι",
            KAPPA: "κ",
            LAMBDA: "λ",
            NU: "ν",
            XI: "ξ",
            OMICRON: "ο",
            RHO: "ρ",
            UPSILON: "υ",
            CHI_LOWER: "φ",
            CHI_UPPER: "χ",
            PSI: "ψ",
            ALPHA: "α",
            ESZETT: "ß",
            PI: "π",
            SIGMA_UPPER: "Σ",
            SIGMA_LOWER: "σ",
            MU: "µ",
            TAU: "τ",
            THETA: "Θ",
            OMEGA: "Ω",
            DELTA: "δ",
            PHI_LOWER: "φ",
            EPSILON: "ε"
        };

        function pad(string, length, ch, end) {
            string = "" + string; //check for numbers
            ch = ch || " ";
            var strLen = string.length;
            while (strLen < length) {
                if (end) {
                    string += ch;
                } else {
                    string = ch + string;
                }
                strLen++;
            }
            return string;
        }

        function truncate(string, length, end) {
            var ret = string;
            if (is.isString(ret)) {
                if (string.length > length) {
                    if (end) {
                        var l = string.length;
                        ret = string.substring(l - length, l);
                    } else {
                        ret = string.substring(0, length);
                    }
                }
            } else {
                ret = truncate("" + ret, length);
            }
            return ret;
        }

        function format(str, obj) {
            if (obj instanceof Array) {
                var i = 0, len = obj.length;
                //find the matches
                return str.replace(FORMAT_REGEX, function (m, format, type) {
                    var replacer, ret;
                    if (i < len) {
                        replacer = obj[i++];
                    } else {
                        //we are out of things to replace with so
                        //just return the match?
                        return m;
                    }
                    if (m === "%s" || m === "%d" || m === "%D") {
                        //fast path!
                        ret = replacer + "";
                    } else if (m === "%Z") {
                        ret = replacer.toUTCString();
                    } else if (m === "%j") {
                        try {
                            ret = stringify(replacer);
                        } catch (e) {
                            throw new Error("stringExtended.format : Unable to parse json from ", replacer);
                        }
                    } else {
                        format = format.replace(/^\[|\]$/g, "");
                        switch (type) {
                        case "s":
                            ret = formatString(replacer, format);
                            break;
                        case "d":
                            ret = formatNumber(replacer, format);
                            break;
                        case "j":
                            ret = formatObject(replacer, format);
                            break;
                        case "D":
                            ret = date.format(replacer, format);
                            break;
                        case "Z":
                            ret = date.format(replacer, format, true);
                            break;
                        }
                    }
                    return ret;
                });
            } else if (isHash(obj)) {
                return str.replace(INTERP_REGEX, function (m, format, value) {
                    value = obj[value];
                    if (!is.isUndefined(value)) {
                        if (format) {
                            if (is.isString(value)) {
                                return formatString(value, format);
                            } else if (is.isNumber(value)) {
                                return formatNumber(value, format);
                            } else if (is.isDate(value)) {
                                return date.format(value, format);
                            } else if (is.isObject(value)) {
                                return formatObject(value, format);
                            }
                        } else {
                            return "" + value;
                        }
                    }
                    return m;
                });
            } else {
                var args = aSlice.call(arguments).slice(1);
                return format(str, args);
            }
        }

        function toArray(testStr, delim) {
            var ret = [];
            if (testStr) {
                if (testStr.indexOf(delim) > 0) {
                    ret = testStr.replace(/\s+/g, "").split(delim);
                }
                else {
                    ret.push(testStr);
                }
            }
            return ret;
        }

        function multiply(str, times) {
            var ret = [];
            if (times) {
                for (var i = 0; i < times; i++) {
                    ret.push(str);
                }
            }
            return ret.join("");
        }


        function style(str, options) {
            var ret, i, l;
            if (options) {
                if (is.isArray(str)) {
                    ret = [];
                    for (i = 0, l = str.length; i < l; i++) {
                        ret.push(style(str[i], options));
                    }
                } else if (options instanceof Array) {
                    ret = str;
                    for (i = 0, l = options.length; i < l; i++) {
                        ret = style(ret, options[i]);
                    }
                } else if (options in styles) {
                    ret = '\x1B[' + styles[options] + 'm' + str + '\x1B[0m';
                }
            }
            return ret;
        }

        function escape(str, except) {
            return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function (ch) {
                if (except && arr.indexOf(except, ch) !== -1) {
                    return ch;
                }
                return "\\" + ch;
            });
        }

        function trim(str) {
            return str.replace(/^\s*|\s*$/g, "");
        }

        function trimLeft(str) {
            return str.replace(/^\s*/, "");
        }

        function trimRight(str) {
            return str.replace(/\s*$/, "");
        }

        function isEmpty(str) {
            return str.length === 0;
        }


        var string = {
            toArray: toArray,
            pad: pad,
            truncate: truncate,
            multiply: multiply,
            format: format,
            style: style,
            escape: escape,
            trim: trim,
            trimLeft: trimLeft,
            trimRight: trimRight,
            isEmpty: isEmpty
        };
        return extended.define(is.isString, string).define(is.isArray, {style: style}).expose(string).expose({characters: characters});
    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineString(require("extended"), require("is-extended"), require("date-extended"), require("array-extended"));

        }
    } else if ("function" === typeof define && define.amd) {
        define(["extended", "is-extended", "date-extended", "array-extended"], function (extended, is, date, arr) {
            return defineString(extended, is, date, arr);
        });
    } else {
        this.stringExtended = defineString(this.extended, this.isExtended, this.dateExtended, this.arrayExtended);
    }

}).call(this);






