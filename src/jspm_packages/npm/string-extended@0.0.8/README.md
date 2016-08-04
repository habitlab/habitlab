[![Build Status](https://travis-ci.org/doug-martin/string-extended.png?branch=master)](https://travis-ci.org/doug-martin/string-extended)

[![browser support](https://ci.testling.com/doug-martin/string-extended.png)](http://ci.testling.com/doug-martin/string-extended)

# string-extended

`string-extended` is a Javascript library that can be used standalone or incorporated into [`extended`](https://github.com/doug-martin/extended)

```javascript
var string = require("string-extended");
```

Or

```javascript
var myextended = require("extended")
	.register(require("string-extended"));
```

## Installation

```
npm install string-extended
```

Or [download the source](https://raw.github.com/doug-martin/string-extended/master/index.js) ([minified](https://raw.github.com/doug-martin/string-extended/master/string-extended.min.js))

## Usage

**`toArray`**

 Converts a string to an array

```javascript

string.toArray("a|b|c|d", "|") => ["a","b","c","d"]
string.toArray("a", "|") => ["a"]
string.toArray("", "|") => []
```

**`pad`**

Pads a string

```javascript

//pad at the end
string.pad("STR", 5, " ", true) => "STR  "

//pad at the beginning
string.pad("STR", 5, "$") => "$$STR"
```

**`truncate`**

Truncates a string to the specified length.

```javascript
//from the beginning
string.truncate("abcdefg", 3) => "abc";
//from the end
string.truncate("abcdefg", 3,true) => "efg"
//omit the length
string.truncate("abcdefg") => "abcdefg"
```

**`multiply`**

Returns a string duplicated n times

```javascript
string.multiply("HELLO", 5) => "HELLOHELLOHELLOHELLOHELLO"
```


**`escape`**

Escapes a string so that it can safely be used in a RegExp.

```javascript
stringExtended.escape(".$?*|{}()[]\/+^"); "//\.\$\?\*\|\{\}\(\)\[\]\/\+\^"

stringExtended(".$?*|{}()[]\/+^").escape().value(); "//\.\$\?\*\|\{\}\(\)\[\]\/\+\^"
```

You can also specify an optional array of characters to ignore when escaping.

```javascript
stringExtended.escape(".$?*|{}()[]\/+^", [".", "?", "{", "["]); //".\$?\*\|{\}\(\)[\]\/\+\^"
stringExtended(".$?*|{}()[]\/+^").escape([".", "?", "{", "["]).value(); //".\$?\*\|{\}\(\)[\]\/\+\^"
```

**`trim`**
Trims white space characters from the beginning and end of a string.

```javascript
stringExtended.trim("   Hello World   "); //"Hello World"

stringExtended("   Hello World   ").trim().value(); //"Hello World"
```

**`trimLeft`**

Trims white space characters from the beginning of a string.

```javascript
stringExtended.trimLeft("   Hello World   "); //"Hello World   "

stringExtended("   Hello World   ").trimLeft().value(); //"Hello World   "
```

**`trimRight`**

Trims white space characters from the end of a string.

```javascript
stringExtended.trimLeft("   Hello World   "); //"   Hello World"

stringExtended("   Hello World   ").trimLeft().value(); //"   Hello World"
```

**`format`**

Formats a string with the specified format.

 
1. String Formats %[options]s
   * - : left justified
   * Char : padding character **Excludes d,j,s**
   * Number : width
         
2. Number Formats %[options]d
   * - : left justified
   * + : signed number
   * Char : padding character **Excludes d,j,s**
   * Number : width         
3. Object Formats %[options]j
   * Number : spacing for object properties.     

```javascript
var format = string.format;

format("%s, %s", ["Hello", "World"]) => "Hello, World";

format("%[ 10]s, %[- 10]s", ["Hello", "World"]); //"     Hello, World     ";

format("%-!10s, %#10s, %10s and %-10s", "apple", "orange", "bananas", "watermelons")
     //"apple!!!!!, ####orange,    bananas and watermelon"

format("%+d, %+d, %10d, %-10d, %-+#10d, %10d", 1,-2, 1, 2, 3, 100000000000)
     //"+1, -2, 0000000001, 2000000000, +3########, 1000000000"

format("%[h:mm a]D", [date]) => 7:32 PM - local -

format("%[h:mm a]Z", [date]) => 12:32 PM - UTC

 //When using object formats they must be in an array otherwise
 //format will try to interpolate the properties into the string.
format("%j", [{a : "b"}]); //'{"a":"b"}'

format("%1j, %4j", [{a : "b"}, {a : "b"}]); //'{\n "a": "b"\n},\n{\n    "a": "b"\n}'

format("{hello}, {world}", {hello : "Hello", world : "World"); //"Hello, World";

format({[-s10]apple}, {[%#10]orange}, {[10]banana} and {[-10]watermelons}",{
    apple : "apple",
    orange : "orange",
    banana : "bananas",
    watermelons : "watermelons"
}); //"applesssss, ####orange,    bananas and watermelon"
```     




**`style`**

Styles a string according to the specified styles.

* bold
* bright
* italic
* underline
* inverse
* crossedOut
* blink
* red
* green
* yellow
* blue
* magenta
* cyan
* white
* redBackground
* greenBackground
* yellowBackground
* blueBackground
* magentaBackground
* cyanBackground
* whiteBackground
* grey
* black


```javascript
//style a string red
string.style('myStr', 'red');
//style a string red and bold
string.style('myStr', ['red', bold]);
```


**`characters`**

* `SMILEY` : `☺`
* `SOLID_SMILEY` : `☻`
* `HEART` : `♥`
* `DIAMOND` : `♦`
* `CLOVE` : `♣`
* `SPADE` : `♠`
* `DOT` : `•`
* `SQUARE_CIRCLE` : `◘`
* `CIRCLE` : `○`
* `FILLED_SQUARE_CIRCLE` : `◙`
* `MALE` : `♂`
* `FEMALE` : `♀`
* `EIGHT_NOTE` : `♪`
* `DOUBLE_EIGHTH_NOTE` : `♫`
* `SUN` : `☼`
* `PLAY` : `►`
* `REWIND` : `◄`
* `UP_DOWN` : `↕`
* `PILCROW` : `¶`
* `SECTION` : `§`
* `THICK_MINUS` : `▬`
* `SMALL_UP_DOWN` : `↨`
* `UP_ARROW` : `↑`
* `DOWN_ARROW` : `↓`
* `RIGHT_ARROW` : `→`
* `LEFT_ARROW` : `←`
* `RIGHT_ANGLE` : `∟`
* `LEFT_RIGHT_ARROW` : `↔`
* `TRIANGLE` : `▲`
* `DOWN_TRIANGLE` : `▼`
* `HOUSE` : `⌂`
* `C_CEDILLA` : `Ç`
* `U_UMLAUT` : `ü`
* `E_ACCENT` : `é`
* `A_LOWER_CIRCUMFLEX` : `â`
* `A_LOWER_UMLAUT` : `ä`
* `A_LOWER_GRAVE_ACCENT` : `à`
* `A_LOWER_CIRCLE_OVER` : `å`
* `C_LOWER_CIRCUMFLEX` : `ç`
* `E_LOWER_CIRCUMFLEX` : `ê`
* `E_LOWER_UMLAUT` : `ë`
* `E_LOWER_GRAVE_ACCENT` : `è`
* `I_LOWER_UMLAUT` : `ï`
* `I_LOWER_CIRCUMFLEX` : `î`
* `I_LOWER_GRAVE_ACCENT` : `ì`
* `A_UPPER_UMLAUT` : `Ä`
* `A_UPPER_CIRCLE` : `Å`
* `E_UPPER_ACCENT` : `É`
* `A_E_LOWER` : `æ`
* `A_E_UPPER` : `Æ`
* `O_LOWER_CIRCUMFLEX` : `ô`
* `O_LOWER_UMLAUT` : `ö`
* `O_LOWER_GRAVE_ACCENT` : `ò`
* `U_LOWER_CIRCUMFLEX` : `û`
* `U_LOWER_GRAVE_ACCENT` : `ù`
* `Y_LOWER_UMLAUT` : `ÿ`
* `O_UPPER_UMLAUT` : `Ö`
* `U_UPPER_UMLAUT` : `Ü`
* `CENTS` : `¢`
* `POUND` : `£`
* `YEN` : `¥`
* `CURRENCY` : `¤`
* `PTS` : `₧`
* `FUNCTION` : `ƒ`
* `A_LOWER_ACCENT` : `á`
* `I_LOWER_ACCENT` : `í`
* `O_LOWER_ACCENT` : `ó`
* `U_LOWER_ACCENT` : `ú`
* `N_LOWER_TILDE` : `ñ`
* `N_UPPER_TILDE` : `Ñ`
* `A_SUPER` : `ª`
* `O_SUPER` : `º`
* `UPSIDEDOWN_QUESTION` : `¿`
* `SIDEWAYS_L` : `⌐`
* `NEGATION` : `¬`
* `ONE_HALF` : `½`
* `ONE_FOURTH` : `¼`
* `UPSIDEDOWN_EXCLAMATION` : `¡`
* `DOUBLE_LEFT` : `«`
* `DOUBLE_RIGHT` : `»`
* `LIGHT_SHADED_BOX` : `░`
* `MEDIUM_SHADED_BOX` : `▒`
* `DARK_SHADED_BOX` : `▓`
* `VERTICAL_LINE` : `│`
* `MAZE__SINGLE_RIGHT_T` : `┤`
* `MAZE_SINGLE_RIGHT_TOP` : `┐`
* `MAZE_SINGLE_RIGHT_BOTTOM_SMALL` : `┘`
* `MAZE_SINGLE_LEFT_TOP_SMALL` : `┌`
* `MAZE_SINGLE_LEFT_BOTTOM_SMALL` : `└`
* `MAZE_SINGLE_LEFT_T` : `├`
* `MAZE_SINGLE_BOTTOM_T` : `┴`
* `MAZE_SINGLE_TOP_T` : `┬`
* `MAZE_SINGLE_CENTER` : `┼`
* `MAZE_SINGLE_HORIZONTAL_LINE` : `─`
* `MAZE_SINGLE_RIGHT_DOUBLECENTER_T` : `╡`
* `MAZE_SINGLE_RIGHT_DOUBLE_BL` : `╛`
* `MAZE_SINGLE_RIGHT_DOUBLE_T` : `╢`
* `MAZE_SINGLE_RIGHT_DOUBLEBOTTOM_TOP` : `╖`
* `MAZE_SINGLE_RIGHT_DOUBLELEFT_TOP` : `╕`
* `MAZE_SINGLE_LEFT_DOUBLE_T` : `╞`
* `MAZE_SINGLE_BOTTOM_DOUBLE_T` : `╧`
* `MAZE_SINGLE_TOP_DOUBLE_T` : `╤`
* `MAZE_SINGLE_TOP_DOUBLECENTER_T` : `╥`
* `MAZE_SINGLE_BOTTOM_DOUBLECENTER_T` : `╨`
* `MAZE_SINGLE_LEFT_DOUBLERIGHT_BOTTOM` : `╘`
* `MAZE_SINGLE_LEFT_DOUBLERIGHT_TOP` : `╒`
* `MAZE_SINGLE_LEFT_DOUBLEBOTTOM_TOP` : `╓`
* `MAZE_SINGLE_LEFT_DOUBLETOP_BOTTOM` : `╙`
* `MAZE_SINGLE_LEFT_TOP` : `Γ`
* `MAZE_SINGLE_RIGHT_BOTTOM` : `╜`
* `MAZE_SINGLE_LEFT_CENTER` : `╟`
* `MAZE_SINGLE_DOUBLECENTER_CENTER` : `╫`
* `MAZE_SINGLE_DOUBLECROSS_CENTER` : `╪`
* `MAZE_DOUBLE_LEFT_CENTER` : `╣`
* `MAZE_DOUBLE_VERTICAL` : `║`
* `MAZE_DOUBLE_RIGHT_TOP` : `╗`
* `MAZE_DOUBLE_RIGHT_BOTTOM` : `╝`
* `MAZE_DOUBLE_LEFT_BOTTOM` : `╚`
* `MAZE_DOUBLE_LEFT_TOP` : `╔`
* `MAZE_DOUBLE_BOTTOM_T` : `╩`
* `MAZE_DOUBLE_TOP_T` : `╦`
* `MAZE_DOUBLE_LEFT_T` : `╠`
* `MAZE_DOUBLE_HORIZONTAL` : `═`
* `MAZE_DOUBLE_CROSS` : `╬`
* `SOLID_RECTANGLE` : `█`
* `THICK_LEFT_VERTICAL` : `▌`
* `THICK_RIGHT_VERTICAL` : `▐`
* `SOLID_SMALL_RECTANGLE_BOTTOM` : `▄`
* `SOLID_SMALL_RECTANGLE_TOP` : `▀`
* `PHI_UPPER` : `Φ`
* `INFINITY` : `∞`
* `INTERSECTION` : `∩`
* `DEFINITION` : `≡`
* `PLUS_MINUS` : `±`
* `GT_EQ` : `≥`
* `LT_EQ` : `≤`
* `THEREFORE` : `⌠`
* `SINCE` : `∵`
* `DOESNOT_EXIST` : `∄`
* `EXISTS` : `∃`
* `FOR_ALL` : `∀`
* `EXCLUSIVE_OR` : `⊕`
* `BECAUSE` : `⌡`
* `DIVIDE` : `÷`
* `APPROX` : `≈`
* `DEGREE` : `°`
* `BOLD_DOT` : `∙`
* `DOT_SMALL` : `·`
* `CHECK` : `√`
* `ITALIC_X` : `✗`
* `SUPER_N` : `ⁿ`
* `SQUARED` : `²`
* `CUBED` : `³`
* `SOLID_BOX` : `■`
* `PERMILE` : `‰`
* `REGISTERED_TM` : `®`
* `COPYRIGHT` : `©`
* `TRADEMARK` : `™`
* `BETA` : `β`
* `GAMMA` : `γ`
* `ZETA` : `ζ`
* `ETA` : `η`
* `IOTA` : `ι`
* `KAPPA` : `κ`
* `LAMBDA` : `λ`
* `NU` : `ν`
* `XI` : `ξ`
* `OMICRON` : `ο`
* `RHO` : `ρ`
* `UPSILON` : `υ`
* `CHI_LOWER` : `φ`
* `CHI_UPPER` : `χ`
* `PSI` : `ψ`
* `ALPHA` : `α`
* `ESZETT` : `ß`
* `PI` : `π`
* `SIGMA_UPPER` : `Σ`
* `SIGMA_LOWER` : `σ`
* `MU` : `µ`
* `TAU` : `τ`
* `THETA` : `Θ`
* `OMEGA` : `Ω`
* `DELTA` : `δ`
* `PHI_LOWER` : `φ`
* `EPSILON` : "ε"