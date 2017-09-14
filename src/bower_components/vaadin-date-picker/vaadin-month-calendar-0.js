
    Polymer({
      is: 'vaadin-month-calendar',

      properties: {
        /**
         * A `Date` object defining the month to be displayed. Only year and
         * month properties are actually used.
         */
        month: {
          type: Date,
          value: new Date()
        },

        /**
         * A `Date` object for the currently selected date.
         */
        selectedDate: {
          type: Date,
          notify: true
        },

        /**
         * A `Date` object for the currently focused date.
         */
        focusedDate: Date,

        showWeekNumbers: {
          type: Boolean,
          value: false
        },

        i18n: {
          type: Object
        },

        /**
         * Flag stating whether taps on the component should be ignored.
         */
        ignoreTaps: Boolean,

        _notTapping: Boolean,

        /**
         * The earliest date that can be selected. All earlier dates will be disabled.
         */
        minDate: {
          type: Date,
          value: null
        },

        /**
         * The latest date that can be selected. All later dates will be disabled.
         */
        maxDate: {
          type: Date,
          value: null
        },

        _days: {
          type: Array,
          computed: '_getDays(month, i18n.firstDayOfWeek, minDate, maxDate)'
        }
      },

      observers: [
        '_showWeekNumbersChanged(showWeekNumbers, i18n.firstDayOfWeek)'
      ],

      _getTitle: function(month, monthNames) {
        return this.i18n.formatTitle(monthNames[month.getMonth()], month.getFullYear());
      },

      _dateEquals: vaadin.elements.datepicker.DatePickerHelper._dateEquals,

      _onMonthGridTouchStart: function() {
        this._notTapping = false;
        this.async(function() {
          this._notTapping = true;
        }, 300);
      },

      _dateAdd: function(date, delta) {
        date.setDate(date.getDate() + delta);
      },

      _applyFirstDayOfWeek: function(weekDayNames, firstDayOfWeek) {
        return weekDayNames.slice(firstDayOfWeek).concat(weekDayNames.slice(0, firstDayOfWeek));
      },

      _getWeekDayNames: function(weekDayNames, weekDayNamesShort, showWeekNumbers, firstDayOfWeek) {
        weekDayNames = this._applyFirstDayOfWeek(weekDayNames, firstDayOfWeek);
        weekDayNamesShort = this._applyFirstDayOfWeek(weekDayNamesShort, firstDayOfWeek);
        weekDayNames = weekDayNames.map(function(day, index) {
          return {
            weekDay: day,
            weekDayShort: weekDayNamesShort[index]
          };
        });

        // Add extra space in the beginning of weekday names
        if (showWeekNumbers && firstDayOfWeek === 1) {
          weekDayNames.unshift({
            weekDay: '',
            weekDayShort: ''
          });
        }

        return weekDayNames;
      },

      _getDate: function(date) {
        return date ? date.getDate() : '';
      },

      _showWeekNumbersChanged: function(showWeekNumbers, firstDayOfWeek) {
        this.toggleAttribute('week-numbers', showWeekNumbers && firstDayOfWeek === 1);
      },

      _showWeekSeparator: function(showWeekNumbers, firstDayOfWeek, index) {
        // Currently only supported for locales that start the week on Monday.
        return showWeekNumbers && firstDayOfWeek === 1 && (index % 7 === 0);
      },

      _isToday: function(date) {
        return this._dateEquals(new Date(), date);
      },

      _getDays: function(month, firstDayOfWeek) {
        // First day of the month (at midnight).
        var date = new Date(0, 0);
        date.setFullYear(month.getFullYear());
        date.setMonth(month.getMonth());
        date.setDate(1);

        // Rewind to first day of the week.
        while (date.getDay() !== firstDayOfWeek) {
          this._dateAdd(date, -1);
        }

        var days = [];
        var startMonth = date.getMonth();
        var targetMonth = month.getMonth();
        while (date.getMonth() === targetMonth || date.getMonth() === startMonth) {
          days.push(date.getMonth() === targetMonth ? new Date(date.getTime()) : null);

          // Advance to next day.
          this._dateAdd(date, 1);
        }
        return days;
      },

      _getWeekNumber: function(date, days) {
        if (!date) {
          // Get the first non-null date from the days array.
          date = days.reduce(function(acc, d) {
            return (!acc && d ? d : acc);
          });
        }

        return vaadin.elements.datepicker.DatePickerHelper._getISOWeekNumber(date);
      },

      _handleTap: function(e) {
        if (!this.ignoreTaps && !this._notTapping && e.target.date && !e.target.hasAttribute('disabled')) {
          this.selectedDate = e.target.date;
          this.fire('date-tap');
        }
      },

      _preventDefault: function(e) {
        e.preventDefault();
      },

      _dateAllowed: vaadin.elements.datepicker.DatePickerHelper._dateAllowed,

      _getRole: function(date) {
        return date ? 'button' : 'presentational';
      },

      _getAriaLabel: function(date) {
        if (!date) {
          return '';
        }

        var ariaLabel = this._getDate(date) + ' ' +
          this.i18n.monthNames[date.getMonth()] + ' ' +
          date.getFullYear() + ', ' +
          this.i18n.weekdays[date.getDay()];

        if (this._isToday(date)) {
          ariaLabel += ', ' + this.i18n.today;
        }

        return ariaLabel;
      },

      _getAriaDisabled: function(date, min, max) {
        return this._dateAllowed(date, min, max) ? 'false' : 'true';
      }
    });
  