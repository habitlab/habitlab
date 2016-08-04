[![Build Status](https://travis-ci.org/doug-martin/date-extended.png?branch=master)]((https://travis-ci.org/doug-martin/date-extended)

[![browser support](https://ci.testling.com/doug-martin/date-extended.png)](https://ci.testling.com/doug-martin/date-extended)

# date-extended

`date-extended` is a Javascript library that can be used standalone or incorporated into [`extended`](https://github.com/doug-martin/extended)

```javascript
var date = require("date-extended");
```

Or

```javascript
var myextended = require("extended")
	.register(require("date-extended"));
```

## Installation

```
npm install date-extended
```

Or [download the source](https://raw.github.com/doug-martin/date-extended/master/index.js) ([minified](https://raw.github.com/doug-martin/date-extended/master/date-extended.min.js))

## Usage


**`getDaysInMonth`**

Returns the number of days in the month of a date

```javascript

 date.getDaysInMonth(new Date(2006, 1, 1)); //28
 date.getDaysInMonth(new Date(2004, 1, 1)); //29
 date.getDaysInMonth(new Date(2006, 2, 1)); //31
 date.getDaysInMonth(new Date(2006, 3, 1)); //30


 date(new Date(2006, 4, 1)).getDaysInMonth().value(); //31
 date(new Date(2006, 5, 1)).getDaysInMonth().value(); //30
 date(new Date(2006, 6, 1)).getDaysInMonth(); //31
```

**`isLeapYear`**

Determines if a date is a leap year

```javascript

 date.isLeapYear(new Date(1600, 0, 1)); //true
 date.isLeapYear(new Date(2006, 0, 1)); //false
 date.isLeapYear(new Date(2004, 0, 1)); //true

 date(new Date(1900, 0, 1)).isLeapYear(); //false
 date(new Date(2000, 0, 1)).isLeapYear(); //true
 date(new Date(1800, 0, 1)).isLeapYear(); //false
```

**`isWeekend`**

Determines if a date is on a weekend

```javascript

var thursday = new Date(2006, 8, 21);
date.isWeekend(thursday)); //false

var saturday = new Date(2006, 8, 23);
date(saturday).isWeekend(); //true

var sunday = new Date(2006, 8, 24);
date.isWeekend(sunday); //true

var monday = new Date(2006, 8, 25);
date(monday).isWeekend()); //false
```

**`getTimezoneName`**
Get the timezone of a date

**`compare`**
Compares two dates

```javascript

var d1 = new Date();
d1.setHours(0);
date.compare(d1, d1); // 0

var d1 = new Date(), d2 = new Date();
d1.setHours(0);
d2.setFullYear(2005);
d2.setHours(12);

date.compare(d1, d2, "date"); // 1
date(d1).compare(d2, "datetime"); // 1

var d1 = new Date(), d2 = new Date();
d1.setHours(0);
d2.setFullYear(2005);
d2.setHours(12);

date(d2).compare(d1, "date"); // -1
date(d1).compare(d2, "time"); //-1
```

**`add`**

Adds a specified interval and amount to a date

 * day | days
 * weekday | weekdays
 * year | years
 * week | weeks
 * quarter | quarters
 * months | months
 * hour | hours
 * minute | minutes
 * second | seconds
 * millisecond | milliseconds

```javascript
var dtA = new Date(2005, 11, 27);
date.add(dtA, "year", 1); //new Date(2006, 11, 27);
date(dtA).add("years", 1).value(); //new Date(2006, 11, 27);

dtA = new Date(2000, 0, 1);
date.add(dtA, "quarter", 1); //new Date(2000, 3, 1);
date(dtA).add("quarters", 1).value(); //new Date(2000, 3, 1);

dtA = new Date(2000, 0, 1);
date.add(dtA, "month", 1); //new Date(2000, 1, 1);
date(dtA).add("months", 1).value(); //new Date(2000, 1, 1);

dtA = new Date(2000, 0, 31);
date.add(dtA, "month", 1); //new Date(2000, 1, 29);
date(dtA).add("months", 1).value(); //new Date(2000, 1, 29);

dtA = new Date(2000, 0, 1);
date.add(dtA, "week", 1); //new Date(2000, 0, 8);
date(dtA).add("weeks", 1).value(); //new Date(2000, 0, 8);

dtA = new Date(2000, 0, 1);
date(dtA).add("day", 1).value(); //new Date(2000, 0, 2);

dtA = new Date(2000, 0, 1);
date(dtA).add("weekday", 1); //new Date(2000, 0, 3);

dtA = new Date(2000, 0, 1, 11);
date(dtA).add("hour", 1).value(); //new Date(2000, 0, 1, 12);

dtA = new Date(2000, 11, 31, 23, 59);
date.add(dtA, "minute", 1); //new Date(2001, 0, 1, 0, 0);

dtA = new Date(2000, 11, 31, 23, 59, 59);
date.add(dtA, "second", 1); //new Date(2001, 0, 1, 0, 0, 0);

dtA = new Date(2000, 11, 31, 23, 59, 59, 999);
date.add(dtA, "millisecond", 1); //new Date(2001, 0, 1, 0, 0, 0, 0);
```

**`difference`**

Finds the difference between two dates based on the specified interval

 * day | days
 * weekday | weekdays
 * year | years
 * week | weeks
 * quarter | quarters
 * months | months
 * hour | hours
 * minute | minutes
 * second | seconds
 * millisecond | milliseconds

```javascript

var dtA, dtB;

dtA = new Date(2005, 11, 27);
dtB = new Date(2006, 11, 27);
date.difference(dtA, dtB, "year"); //1

dtA = new Date(2000, 1, 29);
dtB = new Date(2001, 2, 1);
date.difference(dtA, dtB, "quarter"); //4
date(dtA).difference(dtB, "month").value(); //13

dtA = new Date(2000, 1, 1);
dtB = new Date(2000, 1, 8);
date.difference(dtA, dtB, "week"); //1

dtA = new Date(2000, 1, 29);
dtB = new Date(2000, 2, 1);
date(dtA).difference(dtB, "day").value(); //1

dtA = new Date(2006, 7, 3);
dtB = new Date(2006, 7, 11);
date.difference(dtA, dtB, "weekday"); //6

dtA = new Date(2000, 11, 31, 23);
dtB = new Date(2001, 0, 1, 0);
date(dtA).difference(dtB, "hour").value(); //1

dtA = new Date(2000, 11, 31, 23, 59);
dtB = new Date(2001, 0, 1, 0, 0);
date.difference(dtA, dtB, "minute"); //1

dtA = new Date(2000, 11, 31, 23, 59, 59);
dtB = new Date(2001, 0, 1, 0, 0, 0);
date(dtA).difference(dtB, "second").value(); //1

dtA = new Date(2000, 11, 31, 23, 59, 59, 999);
dtB = new Date(2001, 0, 1, 0, 0, 0, 0);
date.difference(dtA, dtB, "millisecond"); //1
````


**`format`**

Formats a date to the specified format string

 * `G`    Era designator    Text    AD
 * `y`    Year    Year    1996; 96
 * `M`    Month in year    Month    July; Jul; 07
 * `w`    Week in year    Number    27
 * `W`    Week in month    Number    2
 * `D`    Day in year    Number    189
 * `d`    Day in month    Number    10
 * `E`    Day in week    Text    Tuesday; Tue
 * `a`    Am/pm marker    Text    PM
 * `H`    Hour in day (0-23)    Number    0
 * `k`    Hour in day (1-24)    Number    24
 * `K`    Hour in am/pm (0-11)    Number    0
 * `h`    Hour in am/pm (1-12)    Number    12
 * `m`    Minute in hour    Number    30
 * `s`    Second in minute    Number    55
 * `S`    Millisecond    Number    978
 * `z`    Time zone    General time zone    Pacific Standard Time; PST; GMT-08:00
 * `Z`    Time zone    RFC 822 time zone    -0800 

```javascript
var date = new Date(2006, 7, 11, 0, 55, 12, 345);
date.format(date, "EEEE, MMMM dd, yyyy"); //"Friday, August 11, 2006"
date(date).format("M/dd/yy").value(); //"8/11/06"
date.format(date, "E"); //"6"
date(date).format("h:m a").value(); //"12:55 AM"
date.format(date, 'h:m:s'); //"12:55:12"
date(date).format('h:m:s.SS').value(); //"12:55:12.35"
date.format(date, 'k:m:s.SS'); //"24:55:12.35"
date(date).format('H:m:s.SS').value(); //"0:55:12.35"
date.format(date, "ddMMyyyy"); //"11082006"
```

**`parseDate`**

Parses a date string into a date object

 * `G`    Era designator    Text    AD
 * `y`    Year    Year    1996; 96
 * `M`    Month in year    Month    July; Jul; 07
 * `w`    Week in year    Number    27
 * `W`    Week in month    Number    2
 * `D`    Day in year    Number    189
 * `d`    Day in month    Number    10
 * `E`    Day in week    Text    Tuesday; Tue
 * `a`    Am/pm marker    Text    PM
 * `H`    Hour in day (0-23)    Number    0
 * `k`    Hour in day (1-24)    Number    24
 * `K`    Hour in am/pm (0-11)    Number    0
 * `h`    Hour in am/pm (1-12)    Number    12
 * `m`    Minute in hour    Number    30
 * `s`    Second in minute    Number    55
 * `S`    Millisecond    Number    978
 * `z`    Time zone    General time zone    Pacific Standard Time; PST; GMT-08:00
 * `Z`    Time zone    RFC 822 time zone    -0800

```javascript
 var aug_11_2006 = new Date(2006, 7, 11, 0);
 date.parse("08/11/06", "MM/dd/yy"); //aug_11_2006
 date.parse("11Aug2006", 'ddMMMyyyy'); //aug_11_2006
 date.parse("Aug2006", 'MMMyyyy'); //new Date(2006, 7, 1)
 date.parse("Aug 11, 2006", "MMM dd, yyyy"); //aug_11_2006
 date.parse("August 11, 2006", "MMMM dd, yyyy"); //aug_11_2006
 date.parse("Friday, August 11, 2006", "EEEE, MMMM dd, yyyy"); //aug_11_2006
```



**FromNow and Ago**

The following are convenience methods for adding ad subtracting intervals from the current date.

* `yearsFromNow` 
* `yearsAgo`
* `monthsFromNow`
* `monthsAgo`
* `daysFromNow`
* `daysAgo`
* `hoursFromNow`
* `hoursAgo`
* `minutesFromNow`
* `minutesAgo`
* `secondsFromNow`
* `secondsAgo`

```javascript
//two years ago
date(2).yearsAgo();
date.yearsAgo(2)

//five hours from now
date(5).hoursFromNow();
date.hoursFromNow(5);

//two seconds ago
date(2).secondsAgo();
date.secondsAgo(2)
```