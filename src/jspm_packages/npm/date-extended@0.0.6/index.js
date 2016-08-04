(function () {
    "use strict";

    function defineDate(extended, is, array) {

        function _pad(string, length, ch, end) {
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

        function _truncate(string, length, end) {
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
                ret = _truncate("" + ret, length);
            }
            return ret;
        }

        function every(arr, iterator, scope) {
            if (!is.isArray(arr) || typeof iterator !== "function") {
                throw new TypeError();
            }
            var t = Object(arr);
            var len = t.length >>> 0;
            for (var i = 0; i < len; i++) {
                if (i in t && !iterator.call(scope, t[i], i, t)) {
                    return false;
                }
            }
            return true;
        }


        var transforms = (function () {
                var floor = Math.floor, round = Math.round;

                var addMap = {
                    day: function addDay(date, amount) {
                        return [amount, "Date", false];
                    },
                    weekday: function addWeekday(date, amount) {
                        // Divide the increment time span into weekspans plus leftover days
                        // e.g., 8 days is one 5-day weekspan / and two leftover days
                        // Can't have zero leftover days, so numbers divisible by 5 get
                        // a days value of 5, and the remaining days make up the number of weeks
                        var days, weeks, mod = amount % 5, strt = date.getDay(), adj = 0;
                        if (!mod) {
                            days = (amount > 0) ? 5 : -5;
                            weeks = (amount > 0) ? ((amount - 5) / 5) : ((amount + 5) / 5);
                        } else {
                            days = mod;
                            weeks = parseInt(amount / 5, 10);
                        }
                        if (strt === 6 && amount > 0) {
                            adj = 1;
                        } else if (strt === 0 && amount < 0) {
                            // Orig date is Sun / negative increment
                            // Jump back over Sat
                            adj = -1;
                        }
                        // Get weekday val for the new date
                        var trgt = strt + days;
                        // New date is on Sat or Sun
                        if (trgt === 0 || trgt === 6) {
                            adj = (amount > 0) ? 2 : -2;
                        }
                        // Increment by number of weeks plus leftover days plus
                        // weekend adjustments
                        return [(7 * weeks) + days + adj, "Date", false];
                    },
                    year: function addYear(date, amount) {
                        return [amount, "FullYear", true];
                    },
                    week: function addWeek(date, amount) {
                        return [amount * 7, "Date", false];
                    },
                    quarter: function addYear(date, amount) {
                        return [amount * 3, "Month", true];
                    },
                    month: function addYear(date, amount) {
                        return [amount, "Month", true];
                    }
                };

                function addTransform(interval, date, amount) {
                    interval = interval.replace(/s$/, "");
                    if (addMap.hasOwnProperty(interval)) {
                        return addMap[interval](date, amount);
                    }
                    return [amount, "UTC" + interval.charAt(0).toUpperCase() + interval.substring(1) + "s", false];
                }


                var differenceMap = {
                    "quarter": function quarterDifference(date1, date2, utc) {
                        var yearDiff = date2.getFullYear() - date1.getFullYear();
                        var m1 = date1[utc ? "getUTCMonth" : "getMonth"]();
                        var m2 = date2[utc ? "getUTCMonth" : "getMonth"]();
                        // Figure out which quarter the months are in
                        var q1 = floor(m1 / 3) + 1;
                        var q2 = floor(m2 / 3) + 1;
                        // Add quarters for any year difference between the dates
                        q2 += (yearDiff * 4);
                        return q2 - q1;
                    },

                    "weekday": function weekdayDifference(date1, date2, utc) {
                        var days = differenceTransform("day", date1, date2, utc), weeks;
                        var mod = days % 7;
                        // Even number of weeks
                        if (mod === 0) {
                            days = differenceTransform("week", date1, date2, utc) * 5;
                        } else {
                            // Weeks plus spare change (< 7 days)
                            var adj = 0, aDay = date1[utc ? "getUTCDay" : "getDay"](), bDay = date2[utc ? "getUTCDay" : "getDay"]();
                            weeks = parseInt(days / 7, 10);
                            // Mark the date advanced by the number of
                            // round weeks (may be zero)
                            var dtMark = new Date(+date1);
                            dtMark.setDate(dtMark[utc ? "getUTCDate" : "getDate"]() + (weeks * 7));
                            var dayMark = dtMark[utc ? "getUTCDay" : "getDay"]();

                            // Spare change days -- 6 or less
                            if (days > 0) {
                                if (aDay === 6 || bDay === 6) {
                                    adj = -1;
                                } else if (aDay === 0) {
                                    adj = 0;
                                } else if (bDay === 0 || (dayMark + mod) > 5) {
                                    adj = -2;
                                }
                            } else if (days < 0) {
                                if (aDay === 6) {
                                    adj = 0;
                                } else if (aDay === 0 || bDay === 0) {
                                    adj = 1;
                                } else if (bDay === 6 || (dayMark + mod) < 0) {
                                    adj = 2;
                                }
                            }
                            days += adj;
                            days -= (weeks * 2);
                        }
                        return days;
                    },
                    year: function (date1, date2) {
                        return date2.getFullYear() - date1.getFullYear();
                    },
                    month: function (date1, date2, utc) {
                        var m1 = date1[utc ? "getUTCMonth" : "getMonth"]();
                        var m2 = date2[utc ? "getUTCMonth" : "getMonth"]();
                        return (m2 - m1) + ((date2.getFullYear() - date1.getFullYear()) * 12);
                    },
                    week: function (date1, date2, utc) {
                        return round(differenceTransform("day", date1, date2, utc) / 7);
                    },
                    day: function (date1, date2) {
                        return 1.1574074074074074e-8 * (date2.getTime() - date1.getTime());
                    },
                    hour: function (date1, date2) {
                        return 2.7777777777777776e-7 * (date2.getTime() - date1.getTime());
                    },
                    minute: function (date1, date2) {
                        return 0.000016666666666666667 * (date2.getTime() - date1.getTime());
                    },
                    second: function (date1, date2) {
                        return 0.001 * (date2.getTime() - date1.getTime());
                    },
                    millisecond: function (date1, date2) {
                        return date2.getTime() - date1.getTime();
                    }
                };


                function differenceTransform(interval, date1, date2, utc) {
                    interval = interval.replace(/s$/, "");
                    return round(differenceMap[interval](date1, date2, utc));
                }


                return {
                    addTransform: addTransform,
                    differenceTransform: differenceTransform
                };
            }()),
            addTransform = transforms.addTransform,
            differenceTransform = transforms.differenceTransform;


        /**
         * @ignore
         * Based on DOJO Date Implementation
         *
         * Dojo is available under *either* the terms of the modified BSD license *or* the
         * Academic Free License version 2.1. As a recipient of Dojo, you may choose which
         * license to receive this code under (except as noted in per-module LICENSE
         * files). Some modules may not be the copyright of the Dojo Foundation. These
         * modules contain explicit declarations of copyright in both the LICENSE files in
         * the directories in which they reside and in the code itself. No external
         * contributions are allowed under licenses which are fundamentally incompatible
         * with the AFL or BSD licenses that Dojo is distributed under.
         *
         */

        var floor = Math.floor, round = Math.round, min = Math.min, pow = Math.pow, ceil = Math.ceil, abs = Math.abs;
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var monthAbbr = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
        var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var dayAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var eraNames = ["Before Christ", "Anno Domini"];
        var eraAbbr = ["BC", "AD"];


        function getDayOfYear(/*Date*/dateObject, utc) {
            // summary: gets the day of the year as represented by dateObject
            return date.difference(new Date(dateObject.getFullYear(), 0, 1, dateObject.getHours()), dateObject, null, utc) + 1; // Number
        }

        function getWeekOfYear(/*Date*/dateObject, /*Number*/firstDayOfWeek, utc) {
            firstDayOfWeek = firstDayOfWeek || 0;
            var fullYear = dateObject[utc ? "getUTCFullYear" : "getFullYear"]();
            var firstDayOfYear = new Date(fullYear, 0, 1).getDay(),
                adj = (firstDayOfYear - firstDayOfWeek + 7) % 7,
                week = floor((getDayOfYear(dateObject) + adj - 1) / 7);

            // if year starts on the specified day, start counting weeks at 1
            if (firstDayOfYear === firstDayOfWeek) {
                week++;
            }

            return week; // Number
        }

        function getTimezoneName(/*Date*/dateObject) {
            var str = dateObject.toString();
            var tz = '';
            var pos = str.indexOf('(');
            if (pos > -1) {
                tz = str.substring(++pos, str.indexOf(')'));
            }
            return tz; // String
        }


        function buildDateEXP(pattern, tokens) {
            return pattern.replace(/([a-z])\1*/ig,function (match) {
                // Build a simple regexp.  Avoid captures, which would ruin the tokens list
                var s,
                    c = match.charAt(0),
                    l = match.length,
                    p2 = '0?',
                    p3 = '0{0,2}';
                if (c === 'y') {
                    s = '\\d{2,4}';
                } else if (c === "M") {
                    s = (l > 2) ? '\\S+?' : '1[0-2]|' + p2 + '[1-9]';
                } else if (c === "D") {
                    s = '[12][0-9][0-9]|3[0-5][0-9]|36[0-6]|' + p3 + '[1-9][0-9]|' + p2 + '[1-9]';
                } else if (c === "d") {
                    s = '3[01]|[12]\\d|' + p2 + '[1-9]';
                } else if (c === "w") {
                    s = '[1-4][0-9]|5[0-3]|' + p2 + '[1-9]';
                } else if (c === "E") {
                    s = '\\S+';
                } else if (c === "h") {
                    s = '1[0-2]|' + p2 + '[1-9]';
                } else if (c === "K") {
                    s = '1[01]|' + p2 + '\\d';
                } else if (c === "H") {
                    s = '1\\d|2[0-3]|' + p2 + '\\d';
                } else if (c === "k") {
                    s = '1\\d|2[0-4]|' + p2 + '[1-9]';
                } else if (c === "m" || c === "s") {
                    s = '[0-5]\\d';
                } else if (c === "S") {
                    s = '\\d{' + l + '}';
                } else if (c === "a") {
                    var am = 'AM', pm = 'PM';
                    s = am + '|' + pm;
                    if (am !== am.toLowerCase()) {
                        s += '|' + am.toLowerCase();
                    }
                    if (pm !== pm.toLowerCase()) {
                        s += '|' + pm.toLowerCase();
                    }
                    s = s.replace(/\./g, "\\.");
                } else if (c === 'v' || c === 'z' || c === 'Z' || c === 'G' || c === 'q' || c === 'Q') {
                    s = ".*";
                } else {
                    s = c === " " ? "\\s*" : c + "*";
                }
                if (tokens) {
                    tokens.push(match);
                }

                return "(" + s + ")"; // add capture
            }).replace(/[\xa0 ]/g, "[\\s\\xa0]"); // normalize whitespace.  Need explicit handling of \xa0 for IE.
        }


        /**
         * @namespace Utilities for Dates
         */
        var date = {

            /**@lends date*/

            /**
             * Returns the number of days in the month of a date
             *
             * @example
             *
             *  dateExtender.getDaysInMonth(new Date(2006, 1, 1)); //28
             *  dateExtender.getDaysInMonth(new Date(2004, 1, 1)); //29
             *  dateExtender.getDaysInMonth(new Date(2006, 2, 1)); //31
             *  dateExtender.getDaysInMonth(new Date(2006, 3, 1)); //30
             *  dateExtender.getDaysInMonth(new Date(2006, 4, 1)); //31
             *  dateExtender.getDaysInMonth(new Date(2006, 5, 1)); //30
             *  dateExtender.getDaysInMonth(new Date(2006, 6, 1)); //31
             * @param {Date} dateObject the date containing the month
             * @return {Number} the number of days in the month
             */
            getDaysInMonth: function (/*Date*/dateObject) {
                //	summary:
                //		Returns the number of days in the month used by dateObject
                var month = dateObject.getMonth();
                var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if (month === 1 && date.isLeapYear(dateObject)) {
                    return 29;
                } // Number
                return days[month]; // Number
            },

            /**
             * Determines if a date is a leap year
             *
             * @example
             *
             *  dateExtender.isLeapYear(new Date(1600, 0, 1)); //true
             *  dateExtender.isLeapYear(new Date(2004, 0, 1)); //true
             *  dateExtender.isLeapYear(new Date(2000, 0, 1)); //true
             *  dateExtender.isLeapYear(new Date(2006, 0, 1)); //false
             *  dateExtender.isLeapYear(new Date(1900, 0, 1)); //false
             *  dateExtender.isLeapYear(new Date(1800, 0, 1)); //false
             *  dateExtender.isLeapYear(new Date(1700, 0, 1)); //false
             *
             * @param {Date} dateObject
             * @returns {Boolean} true if it is a leap year false otherwise
             */
            isLeapYear: function (/*Date*/dateObject, utc) {
                var year = dateObject[utc ? "getUTCFullYear" : "getFullYear"]();
                return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);

            },

            /**
             * Determines if a date is on a weekend
             *
             * @example
             *
             * var thursday = new Date(2006, 8, 21);
             * var saturday = new Date(2006, 8, 23);
             * var sunday = new Date(2006, 8, 24);
             * var monday = new Date(2006, 8, 25);
             * dateExtender.isWeekend(thursday)); //false
             * dateExtender.isWeekend(saturday); //true
             * dateExtender.isWeekend(sunday); //true
             * dateExtender.isWeekend(monday)); //false
             *
             * @param {Date} dateObject the date to test
             *
             * @returns {Boolean} true if the date is a weekend
             */
            isWeekend: function (/*Date?*/dateObject, utc) {
                // summary:
                //	Determines if the date falls on a weekend, according to local custom.
                var day = (dateObject || new Date())[utc ? "getUTCDay" : "getDay"]();
                return day === 0 || day === 6;
            },

            /**
             * Get the timezone of a date
             *
             * @example
             *  //just setting the strLocal to simulate the toString() of a date
             *  dt.str = 'Sun Sep 17 2006 22:25:51 GMT-0500 (CDT)';
             *  //just setting the strLocal to simulate the locale
             *  dt.strLocale = 'Sun 17 Sep 2006 10:25:51 PM CDT';
             *  dateExtender.getTimezoneName(dt); //'CDT'
             *  dt.str = 'Sun Sep 17 2006 22:57:18 GMT-0500 (CDT)';
             *  dt.strLocale = 'Sun Sep 17 22:57:18 2006';
             *  dateExtender.getTimezoneName(dt); //'CDT'
             * @param dateObject the date to get the timezone from
             *
             * @returns {String} the timezone of the date
             */
            getTimezoneName: getTimezoneName,

            /**
             * Compares two dates
             *
             * @example
             *
             * var d1 = new Date();
             * d1.setHours(0);
             * dateExtender.compare(d1, d1); // 0
             *
             *  var d1 = new Date();
             *  d1.setHours(0);
             *  var d2 = new Date();
             *  d2.setFullYear(2005);
             *  d2.setHours(12);
             *  dateExtender.compare(d1, d2, "date"); // 1
             *  dateExtender.compare(d1, d2, "datetime"); // 1
             *
             *  var d1 = new Date();
             *  d1.setHours(0);
             *  var d2 = new Date();
             *  d2.setFullYear(2005);
             *  d2.setHours(12);
             *  dateExtender.compare(d2, d1, "date"); // -1
             *  dateExtender.compare(d1, d2, "time"); //-1
             *
             * @param {Date|String} date1 the date to comapare
             * @param {Date|String} [date2=new Date()] the date to compare date1 againse
             * @param {"date"|"time"|"datetime"} portion compares the portion specified
             *
             * @returns -1 if date1 is < date2 0 if date1 === date2  1 if date1 > date2
             */
            compare: function (/*Date*/date1, /*Date*/date2, /*String*/portion) {
                date1 = new Date(+date1);
                date2 = new Date(+(date2 || new Date()));

                if (portion === "date") {
                    // Ignore times and compare dates.
                    date1.setHours(0, 0, 0, 0);
                    date2.setHours(0, 0, 0, 0);
                } else if (portion === "time") {
                    // Ignore dates and compare times.
                    date1.setFullYear(0, 0, 0);
                    date2.setFullYear(0, 0, 0);
                }
                return date1 > date2 ? 1 : date1 < date2 ? -1 : 0;
            },


            /**
             * Adds a specified interval and amount to a date
             *
             * @example
             *  var dtA = new Date(2005, 11, 27);
             *  dateExtender.add(dtA, "year", 1); //new Date(2006, 11, 27);
             *  dateExtender.add(dtA, "years", 1); //new Date(2006, 11, 27);
             *
             *  dtA = new Date(2000, 0, 1);
             *  dateExtender.add(dtA, "quarter", 1); //new Date(2000, 3, 1);
             *  dateExtender.add(dtA, "quarters", 1); //new Date(2000, 3, 1);
             *
             *  dtA = new Date(2000, 0, 1);
             *  dateExtender.add(dtA, "month", 1); //new Date(2000, 1, 1);
             *  dateExtender.add(dtA, "months", 1); //new Date(2000, 1, 1);
             *
             *  dtA = new Date(2000, 0, 31);
             *  dateExtender.add(dtA, "month", 1); //new Date(2000, 1, 29);
             *  dateExtender.add(dtA, "months", 1); //new Date(2000, 1, 29);
             *
             *  dtA = new Date(2000, 0, 1);
             *  dateExtender.add(dtA, "week", 1); //new Date(2000, 0, 8);
             *  dateExtender.add(dtA, "weeks", 1); //new Date(2000, 0, 8);
             *
             *  dtA = new Date(2000, 0, 1);
             *  dateExtender.add(dtA, "day", 1); //new Date(2000, 0, 2);
             *
             *  dtA = new Date(2000, 0, 1);
             *  dateExtender.add(dtA, "weekday", 1); //new Date(2000, 0, 3);
             *
             *  dtA = new Date(2000, 0, 1, 11);
             *  dateExtender.add(dtA, "hour", 1); //new Date(2000, 0, 1, 12);
             *
             *  dtA = new Date(2000, 11, 31, 23, 59);
             *  dateExtender.add(dtA, "minute", 1); //new Date(2001, 0, 1, 0, 0);
             *
             *  dtA = new Date(2000, 11, 31, 23, 59, 59);
             *  dateExtender.add(dtA, "second", 1); //new Date(2001, 0, 1, 0, 0, 0);
             *
             *  dtA = new Date(2000, 11, 31, 23, 59, 59, 999);
             *  dateExtender.add(dtA, "millisecond", 1); //new Date(2001, 0, 1, 0, 0, 0, 0);
             *
             * @param {Date} date
             * @param {String} interval the interval to add
             *  <ul>
             *      <li>day | days</li>
             *      <li>weekday | weekdays</li>
             *      <li>year | years</li>
             *      <li>week | weeks</li>
             *      <li>quarter | quarters</li>
             *      <li>months | months</li>
             *      <li>hour | hours</li>
             *      <li>minute | minutes</li>
             *      <li>second | seconds</li>
             *      <li>millisecond | milliseconds</li>
             *  </ul>
             * @param {Number} [amount=0] the amount to add
             */
            add: function (/*Date*/date, /*String*/interval, /*int*/amount) {
                var res = addTransform(interval, date, amount || 0);
                amount = res[0];
                var property = res[1];
                var sum = new Date(+date);
                var fixOvershoot = res[2];
                if (property) {
                    sum["set" + property](sum["get" + property]() + amount);
                }

                if (fixOvershoot && (sum.getDate() < date.getDate())) {
                    sum.setDate(0);
                }

                return sum; // Date
            },

            /**
             * Finds the difference between two dates based on the specified interval
             *
             * @example
             *
             * var dtA, dtB;
             *
             * dtA = new Date(2005, 11, 27);
             * dtB = new Date(2006, 11, 27);
             * dateExtender.difference(dtA, dtB, "year"); //1
             *
             * dtA = new Date(2000, 1, 29);
             * dtB = new Date(2001, 2, 1);
             * dateExtender.difference(dtA, dtB, "quarter"); //4
             * dateExtender.difference(dtA, dtB, "month"); //13
             *
             * dtA = new Date(2000, 1, 1);
             * dtB = new Date(2000, 1, 8);
             * dateExtender.difference(dtA, dtB, "week"); //1
             *
             * dtA = new Date(2000, 1, 29);
             * dtB = new Date(2000, 2, 1);
             * dateExtender.difference(dtA, dtB, "day"); //1
             *
             * dtA = new Date(2006, 7, 3);
             * dtB = new Date(2006, 7, 11);
             * dateExtender.difference(dtA, dtB, "weekday"); //6
             *
             * dtA = new Date(2000, 11, 31, 23);
             * dtB = new Date(2001, 0, 1, 0);
             * dateExtender.difference(dtA, dtB, "hour"); //1
             *
             * dtA = new Date(2000, 11, 31, 23, 59);
             * dtB = new Date(2001, 0, 1, 0, 0);
             * dateExtender.difference(dtA, dtB, "minute"); //1
             *
             * dtA = new Date(2000, 11, 31, 23, 59, 59);
             * dtB = new Date(2001, 0, 1, 0, 0, 0);
             * dateExtender.difference(dtA, dtB, "second"); //1
             *
             * dtA = new Date(2000, 11, 31, 23, 59, 59, 999);
             * dtB = new Date(2001, 0, 1, 0, 0, 0, 0);
             * dateExtender.difference(dtA, dtB, "millisecond"); //1
             *
             *
             * @param {Date} date1
             * @param {Date} [date2 = new Date()]
             * @param {String} [interval = "day"] the intercal to find the difference of.
             *   <ul>
             *      <li>day | days</li>
             *      <li>weekday | weekdays</li>
             *      <li>year | years</li>
             *      <li>week | weeks</li>
             *      <li>quarter | quarters</li>
             *      <li>months | months</li>
             *      <li>hour | hours</li>
             *      <li>minute | minutes</li>
             *      <li>second | seconds</li>
             *      <li>millisecond | milliseconds</li>
             *  </ul>
             */
            difference: function (/*Date*/date1, /*Date?*/date2, /*String*/interval, utc) {
                date2 = date2 || new Date();
                interval = interval || "day";
                return differenceTransform(interval, date1, date2, utc);
            },

            /**
             * Formats a date to the specidifed format string
             *
             * @example
             *
             * var date = new Date(2006, 7, 11, 0, 55, 12, 345);
             * dateExtender.format(date, "EEEE, MMMM dd, yyyy"); //"Friday, August 11, 2006"
             * dateExtender.format(date, "M/dd/yy"); //"8/11/06"
             * dateExtender.format(date, "E"); //"6"
             * dateExtender.format(date, "h:m a"); //"12:55 AM"
             * dateExtender.format(date, 'h:m:s'); //"12:55:12"
             * dateExtender.format(date, 'h:m:s.SS'); //"12:55:12.35"
             * dateExtender.format(date, 'k:m:s.SS'); //"24:55:12.35"
             * dateExtender.format(date, 'H:m:s.SS'); //"0:55:12.35"
             * dateExtender.format(date, "ddMMyyyy"); //"11082006"
             *
             * @param date the date to format
             * @param {String} format the format of the date composed of the following options
             * <ul>
             *                  <li> G    Era designator    Text    AD</li>
             *                  <li> y    Year    Year    1996; 96</li>
             *                  <li> M    Month in year    Month    July; Jul; 07</li>
             *                  <li> w    Week in year    Number    27</li>
             *                  <li> W    Week in month    Number    2</li>
             *                  <li> D    Day in year    Number    189</li>
             *                  <li> d    Day in month    Number    10</li>
             *                  <li> E    Day in week    Text    Tuesday; Tue</li>
             *                  <li> a    Am/pm marker    Text    PM</li>
             *                  <li> H    Hour in day (0-23)    Number    0</li>
             *                  <li> k    Hour in day (1-24)    Number    24</li>
             *                  <li> K    Hour in am/pm (0-11)    Number    0</li>
             *                  <li> h    Hour in am/pm (1-12)    Number    12</li>
             *                  <li> m    Minute in hour    Number    30</li>
             *                  <li> s    Second in minute    Number    55</li>
             *                  <li> S    Millisecond    Number    978</li>
             *                  <li> z    Time zone    General time zone    Pacific Standard Time; PST; GMT-08:00</li>
             *                  <li> Z    Time zone    RFC 822 time zone    -0800 </li>
             * </ul>
             */
            format: function (date, format, utc) {
                utc = utc || false;
                var fullYear, month, day, d, hour, minute, second, millisecond;
                if (utc) {
                    fullYear = date.getUTCFullYear();
                    month = date.getUTCMonth();
                    day = date.getUTCDay();
                    d = date.getUTCDate();
                    hour = date.getUTCHours();
                    minute = date.getUTCMinutes();
                    second = date.getUTCSeconds();
                    millisecond = date.getUTCMilliseconds();
                } else {
                    fullYear = date.getFullYear();
                    month = date.getMonth();
                    d = date.getDate();
                    day = date.getDay();
                    hour = date.getHours();
                    minute = date.getMinutes();
                    second = date.getSeconds();
                    millisecond = date.getMilliseconds();
                }
                return format.replace(/([A-Za-z])\1*/g, function (match) {
                    var s, pad,
                        c = match.charAt(0),
                        l = match.length;
                    if (c === 'd') {
                        s = "" + d;
                        pad = true;
                    } else if (c === "H" && !s) {
                        s = "" + hour;
                        pad = true;
                    } else if (c === 'm' && !s) {
                        s = "" + minute;
                        pad = true;
                    } else if (c === 's') {
                        if (!s) {
                            s = "" + second;
                        }
                        pad = true;
                    } else if (c === "G") {
                        s = ((l < 4) ? eraAbbr : eraNames)[fullYear < 0 ? 0 : 1];
                    } else if (c === "y") {
                        s = fullYear;
                        if (l > 1) {
                            if (l === 2) {
                                s = _truncate("" + s, 2, true);
                            } else {
                                pad = true;
                            }
                        }
                    } else if (c.toUpperCase() === "Q") {
                        s = ceil((month + 1) / 3);
                        pad = true;
                    } else if (c === "M") {
                        if (l < 3) {
                            s = month + 1;
                            pad = true;
                        } else {
                            s = (l === 3 ? monthAbbr : monthNames)[month];
                        }
                    } else if (c === "w") {
                        s = getWeekOfYear(date, 0, utc);
                        pad = true;
                    } else if (c === "D") {
                        s = getDayOfYear(date, utc);
                        pad = true;
                    } else if (c === "E") {
                        if (l < 3) {
                            s = day + 1;
                            pad = true;
                        } else {
                            s = (l === -3 ? dayAbbr : dayNames)[day];
                        }
                    } else if (c === 'a') {
                        s = (hour < 12) ? 'AM' : 'PM';
                    } else if (c === "h") {
                        s = (hour % 12) || 12;
                        pad = true;
                    } else if (c === "K") {
                        s = (hour % 12);
                        pad = true;
                    } else if (c === "k") {
                        s = hour || 24;
                        pad = true;
                    } else if (c === "S") {
                        s = round(millisecond * pow(10, l - 3));
                        pad = true;
                    } else if (c === "z" || c === "v" || c === "Z") {
                        s = getTimezoneName(date);
                        if ((c === "z" || c === "v") && !s) {
                            l = 4;
                        }
                        if (!s || c === "Z") {
                            var offset = date.getTimezoneOffset();
                            var tz = [
                                (offset >= 0 ? "-" : "+"),
                                _pad(floor(abs(offset) / 60), 2, "0"),
                                _pad(abs(offset) % 60, 2, "0")
                            ];
                            if (l === 4) {
                                tz.splice(0, 0, "GMT");
                                tz.splice(3, 0, ":");
                            }
                            s = tz.join("");
                        }
                    } else {
                        s = match;
                    }
                    if (pad) {
                        s = _pad(s, l, '0');
                    }
                    return s;
                });
            }

        };

        var numberDate = {};

        function addInterval(interval) {
            numberDate[interval + "sFromNow"] = function (val) {
                return date.add(new Date(), interval, val);
            };
            numberDate[interval + "sAgo"] = function (val) {
                return date.add(new Date(), interval, -val);
            };
        }

        var intervals = ["year", "month", "day", "hour", "minute", "second"];
        for (var i = 0, l = intervals.length; i < l; i++) {
            addInterval(intervals[i]);
        }

        var stringDate = {

            parseDate: function (dateStr, format) {
                if (!format) {
                    throw new Error('format required when calling dateExtender.parse');
                }
                var tokens = [], regexp = buildDateEXP(format, tokens),
                    re = new RegExp("^" + regexp + "$", "i"),
                    match = re.exec(dateStr);
                if (!match) {
                    return null;
                } // null
                var result = [1970, 0, 1, 0, 0, 0, 0], // will get converted to a Date at the end
                    amPm = "",
                    valid = every(match, function (v, i) {
                        if (i) {
                            var token = tokens[i - 1];
                            var l = token.length, type = token.charAt(0);
                            if (type === 'y') {
                                if (v < 100) {
                                    v = parseInt(v, 10);
                                    //choose century to apply, according to a sliding window
                                    //of 80 years before and 20 years after present year
                                    var year = '' + new Date().getFullYear(),
                                        century = year.substring(0, 2) * 100,
                                        cutoff = min(year.substring(2, 4) + 20, 99);
                                    result[0] = (v < cutoff) ? century + v : century - 100 + v;
                                } else {
                                    result[0] = v;
                                }
                            } else if (type === "M") {
                                if (l > 2) {
                                    var months = monthNames, j, k;
                                    if (l === 3) {
                                        months = monthAbbr;
                                    }
                                    //Tolerate abbreviating period in month part
                                    //Case-insensitive comparison
                                    v = v.replace(".", "").toLowerCase();
                                    var contains = false;
                                    for (j = 0, k = months.length; j < k && !contains; j++) {
                                        var s = months[j].replace(".", "").toLocaleLowerCase();
                                        if (s === v) {
                                            v = j;
                                            contains = true;
                                        }
                                    }
                                    if (!contains) {
                                        return false;
                                    }
                                } else {
                                    v--;
                                }
                                result[1] = v;
                            } else if (type === "E" || type === "e") {
                                var days = dayNames;
                                if (l === 3) {
                                    days = dayAbbr;
                                }
                                //Case-insensitive comparison
                                v = v.toLowerCase();
                                days = array.map(days, function (d) {
                                    return d.toLowerCase();
                                });
                                var d = array.indexOf(days, v);
                                if (d === -1) {
                                    v = parseInt(v, 10);
                                    if (isNaN(v) || v > days.length) {
                                        return false;
                                    }
                                } else {
                                    v = d;
                                }
                            } else if (type === 'D' || type === "d") {
                                if (type === "D") {
                                    result[1] = 0;
                                }
                                result[2] = v;
                            } else if (type === "a") {
                                var am = "am";
                                var pm = "pm";
                                var period = /\./g;
                                v = v.replace(period, '').toLowerCase();
                                // we might not have seen the hours field yet, so store the state and apply hour change later
                                amPm = (v === pm) ? 'p' : (v === am) ? 'a' : '';
                            } else if (type === "k" || type === "h" || type === "H" || type === "K") {
                                if (type === "k" && (+v) === 24) {
                                    v = 0;
                                }
                                result[3] = v;
                            } else if (type === "m") {
                                result[4] = v;
                            } else if (type === "s") {
                                result[5] = v;
                            } else if (type === "S") {
                                result[6] = v;
                            }
                        }
                        return true;
                    });
                if (valid) {
                    var hours = +result[3];
                    //account for am/pm
                    if (amPm === 'p' && hours < 12) {
                        result[3] = hours + 12; //e.g., 3pm -> 15
                    } else if (amPm === 'a' && hours === 12) {
                        result[3] = 0; //12am -> 0
                    }
                    var dateObject = new Date(result[0], result[1], result[2], result[3], result[4], result[5], result[6]); // Date
                    var dateToken = (array.indexOf(tokens, 'd') !== -1),
                        monthToken = (array.indexOf(tokens, 'M') !== -1),
                        month = result[1],
                        day = result[2],
                        dateMonth = dateObject.getMonth(),
                        dateDay = dateObject.getDate();
                    if ((monthToken && dateMonth > month) || (dateToken && dateDay > day)) {
                        return null;
                    }
                    return dateObject; // Date
                } else {
                    return null;
                }
            }
        };


        var ret = extended.define(is.isDate, date).define(is.isString, stringDate).define(is.isNumber, numberDate);
        for (i in date) {
            if (date.hasOwnProperty(i)) {
                ret[i] = date[i];
            }
        }

        for (i in stringDate) {
            if (stringDate.hasOwnProperty(i)) {
                ret[i] = stringDate[i];
            }
        }
        for (i in numberDate) {
            if (numberDate.hasOwnProperty(i)) {
                ret[i] = numberDate[i];
            }
        }
        return ret;
    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineDate(require("extended"), require("is-extended"), require("array-extended"));

        }
    } else if ("function" === typeof define && define.amd) {
        define(["extended", "is-extended", "array-extended"], function (extended, is, arr) {
            return defineDate(extended, is, arr);
        });
    } else {
        this.dateExtended = defineDate(this.extended, this.isExtended, this.arrayExtended);
    }

}).call(this);






