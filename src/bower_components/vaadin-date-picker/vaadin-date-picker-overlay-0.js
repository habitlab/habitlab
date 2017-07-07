
    Polymer({
      is: 'vaadin-date-picker-overlay',

      listeners: {
        'keydown': '_onKeydown',
        'tap': '_stopPropagation',
        'focus': '_onOverlayFocus',
        'blur': '_onOverlayBlur'
      },

      hostAttributes: {
        'tabIndex': '0'
      },

      properties: {
        /**
         * The value for this element.
         */
        selectedDate: {
          type: Date,
          notify: true
        },

        /**
         * Date value which is focused using keyboard.
         */
        focusedDate: {
          type: Date,
          notify: true,
          observer: '_focusedDateChanged'
        },

        _focusedMonthDate: Number,

        /**
         * Date which should be visible when there is no value selected.
         */
        initialPosition: {
          type: Date,
          observer: '_initialPositionChanged'
        },

        _originDate: {
          value: new Date()
        },

        _visibleMonthIndex: Number,

        _desktopMode: Boolean,

        _translateX: {
          observer: '_translateXChanged'
        },

        _yearScrollerWidth: {
          value: 50
        },

        i18n: {
          type: Object
        },

        showWeekNumbers: {
          type: Boolean
        },

        _ignoreTaps: Boolean,

        _notTapping: Boolean,

        /**
         * The earliest date that can be selected. All earlier dates will be disabled.
         */
        minDate: Date,

        /**
         * The latest date that can be selected. All later dates will be disabled.
         */
        maxDate: Date,

        _focused: Boolean
      },

      /**
       * Fired when the scroller reaches the target scrolling position.
       * @event scroll-animation-finished
       * @param {Number} detail.position new position
       * @param {Number} detail.oldPosition old position
       */

      attached: function() {
        this._translateX = this._yearScrollerWidth;
        this.toggleClass('animate', true);
        this.setScrollDirection('y', this.$.scrollers);
        Polymer.IronA11yAnnouncer.requestAvailability();
      },

      announceFocusedDate: function() {
        var focusedDate = this._currentlyFocusedDate();
        var announce = [];
        if (vaadin.elements.datepicker.DatePickerHelper._dateEquals(focusedDate, new Date())) {
          announce.push(this.i18n.today);
        }
        announce = announce.concat([
          this.i18n.weekdays[focusedDate.getDay()],
          focusedDate.getDate(),
          this.i18n.monthNames[focusedDate.getMonth()],
          focusedDate.getFullYear()
        ]);
        if (this.showWeekNumbers && this.i18n.firstDayOfWeek === 1) {
          announce.push(this.i18n.week);
          announce.push(vaadin.elements.datepicker.DatePickerHelper._getISOWeekNumber(focusedDate));
        }
        this.fire('iron-announce', {text: announce.join(' ')});
        return;
      },

      /**
       * Focuses the cancel button
       */
      focusCancel: function() {
        this.$.cancelButton.focus();
      },

      /**
       * Scrolls the list to the given Date.
       */
      scrollToDate: function(date, animate) {
        this._scrollToPosition(this._differenceInMonths(date, this._originDate), animate);
      },

      _focusedDateChanged: function(focusedDate) {
        this.revealDate(focusedDate);
      },

      /**
       * Scrolls the month and year scrollers enough to reveal the given date.
       */
      revealDate: function(date) {
        if (date) {
          var diff = this._differenceInMonths(date, this._originDate);
          var scrolledAboveViewport = this.$.scroller.position > diff;

          var visibleItems = this.$.scroller.clientHeight / this.$.scroller.itemHeight;
          var scrolledBelowViewport = this.$.scroller.position + visibleItems - 1 < diff;

          if (scrolledAboveViewport) {
            this._scrollToPosition(diff, true);
          } else if (scrolledBelowViewport) {
            this._scrollToPosition(diff - visibleItems + 1, true);
          }
        }
      },

      _onOverlayFocus: function() {
        this._focused = true;
      },

      _onOverlayBlur: function() {
        this._focused = false;
      },

      _initialPositionChanged: function(initialPosition) {
        this.scrollToDate(initialPosition);
      },

      _repositionYearScroller: function() {
        this._visibleMonthIndex = Math.floor(this.$.scroller.position);
        this.$.yearScroller.position = (this.$.scroller.position + this._originDate.getMonth()) / 12;
      },

      _repositionMonthScroller: function() {
        this.$.scroller.position = this.$.yearScroller.position * 12 - this._originDate.getMonth();
        this._visibleMonthIndex = Math.floor(this.$.scroller.position);
      },

      _onMonthScroll: function() {
        this._repositionYearScroller();
        this._doIgnoreTaps();
      },

      _onYearScroll: function() {
        this._repositionMonthScroller();
        this._doIgnoreTaps();
      },

      _onYearScrollTouchStart: function() {
        this._notTapping = false;
        this.async(function() {
          this._notTapping = true;
        }, 300);

        this._repositionMonthScroller();
      },

      _onMonthScrollTouchStart: function() {
        this._repositionYearScroller();
      },

      _doIgnoreTaps: function() {
        this._ignoreTaps = true;
        this.debounce('restore-taps', function() {
          this._ignoreTaps = false;
        }, 300);
      },

      _formatDisplayed: function(date, formatDate) {
        if (date) {
          return formatDate(date);
        }
      },

      _onTodayTap: function() {
        var today = new Date();
        if (this.$.scroller.position === this._differenceInMonths(today, this._originDate)) {
          // Select today only if the month scroller is positioned exactly
          // at the beginning of the current month
          this.selectedDate = today;
          this._close();
        } else {
          this._scrollToCurrentMonth();
        }
      },

      _scrollToCurrentMonth: function() {
        if (this.focusedDate) {
          this.focusedDate = new Date();
        }

        this.scrollToDate(new Date(), true);
      },

      _showClear: function(selectedDate) {
        return selectedDate !== null;
      },

      _onYearTap: function(e) {
        if (!this._ignoreTaps && !this._notTapping) {
          var scrollDelta = e.detail.y - (this.$.yearScroller.getBoundingClientRect().top + this.$.yearScroller.clientHeight / 2);
          var yearDelta = scrollDelta / this.$.yearScroller.itemHeight;
          this._scrollToPosition(this.$.scroller.position + yearDelta * 12, true);
        }
      },

      _scrollToPosition: function(targetPosition, animate) {
        if (this._targetPosition !== undefined) {
          this._targetPosition = targetPosition;
          return;
        }

        if (!animate) {
          this.$.scroller.position = targetPosition;
          this._targetPosition = undefined;
          this._repositionYearScroller();
          return;
        }

        this._targetPosition = targetPosition;

        // http://gizma.com/easing/
        var easingFunction = function(t, b, c, d) {
          t /= d / 2;
          if (t < 1) {
            return c / 2 * t * t + b;
          }
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
        };

        var duration = animate ? 300 : 0;
        var start = 0;
        var initialPosition = this.$.scroller.position;

        var smoothScroll = function(timestamp) {
          start = start || timestamp;
          var currentTime = timestamp - start;

          if (currentTime < duration) {
            var currentPos = easingFunction(currentTime, initialPosition, this._targetPosition - initialPosition, duration);
            this.$.scroller.position = currentPos;
            window.requestAnimationFrame(smoothScroll);
          } else {
            this.fire('scroll-animation-finished', {
              position: this._targetPosition,
              oldPosition: initialPosition
            });
            this.$.scroller.position = this._targetPosition;
            this._targetPosition = undefined;
          }

          this.async(this._repositionYearScroller, 1);
        }.bind(this);

        // Start the animation.
        window.requestAnimationFrame(smoothScroll);
      },

      _limit: function(value, range) {
        return Math.min(range.max, Math.max(range.min, value));
      },

      _handleTrack: function(e) {
        // Check if horizontal movement threshold (dx) not exceeded or
        // scrolling fast vertically (ddy).
        if (Math.abs(e.detail.dx) < 10 || Math.abs(e.detail.ddy) > 10) {
          return;
        }

        // If we're flinging quickly -> start animating already.
        if (Math.abs(e.detail.ddx) > this._yearScrollerWidth / 3) {
          this.toggleClass('animate', true);
        }

        var newTranslateX = this._translateX + e.detail.ddx;
        this._translateX = this._limit(newTranslateX, {
          min: 0,
          max: this._yearScrollerWidth
        });
      },

      _track: function(e) {
        if (this._desktopMode) {
          // No need to track for swipe gestures on desktop.
          return;
        }

        switch (e.detail.state) {
          case 'start':
            this.toggleClass('animate', false);
            break;

          case 'track':
            this._handleTrack(e);
            break;

          case 'end':
            this.toggleClass('animate', true);
            if (this._translateX >= this._yearScrollerWidth / 2) {
              this._closeYearScroller();
            } else {
              this._openYearScroller();
            }
            break;
        }
      },

      _toggleYearScroller: function() {
        this._isYearScrollerVisible() ? this._closeYearScroller() : this._openYearScroller();
      },

      _openYearScroller: function() {
        this._translateX = 0;
      },

      _closeYearScroller: function() {
        this._translateX = this._yearScrollerWidth;
      },

      _isYearScrollerVisible: function() {
        return this._translateX < this._yearScrollerWidth / 2;
      },

      _translateXChanged: function(x) {
        if (!this._desktopMode) {
          this.transform('translateX(' + (x - this._yearScrollerWidth) + 'px)', this.$.scroller);
          this.transform('translateX(' + x + 'px)', this.$.yearScroller);
          this.transform('translateX(' + -x + 'px)', this.$.fade);
        }
      },

      _yearAfterXYears: function(index) {
        var result = new Date(this._originDate);
        result.setFullYear(parseInt(index) + this._originDate.getFullYear());
        return result.getFullYear();
      },

      _yearAfterXMonths: function(months) {
        return this._dateAfterXMonths(months).getFullYear();
      },

      _dateAfterXMonths: function(months) {
        var result = new Date(this._originDate);
        result.setDate(1);
        result.setMonth(parseInt(months) + this._originDate.getMonth());
        return result;
      },

      _differenceInMonths: function(date1, date2) {
        var months = (date1.getFullYear() - date2.getFullYear()) * 12;
        return months - date2.getMonth() + date1.getMonth();
      },

      _differenceInYears: function(date1, date2) {
        return this._differenceInMonths(date1, date2) / 12;
      },

      _clear: function() {
        this.selectedDate = '';
        this._close();
      },

      _close: function() {
        this.fire('close');
      },

      _cancel: function() {
        this.focusedDate = this.selectedDate;
        this._close();
      },

      _preventDefault: function(e) {
        e.preventDefault();
      },

      /**
       * Keyboard Navigation
       */
      _eventKey: function(e) {
        var keys = ['down', 'up', 'right', 'left', 'enter', 'space', 'home', 'end', 'pageup', 'pagedown', 'tab'];

        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          if (Polymer.IronA11yKeysBehavior.keyboardEventMatchesKeys(e, k)) {
            return k;
          }
        }
      },

      _onKeydown: function(e) {
        var focus = this._currentlyFocusedDate();

        var eventKey = this._eventKey(e);
        if (eventKey === 'tab') {
          e.stopPropagation();
          if (this.hasAttribute('fullscreen')) {
            e.preventDefault();
          } else if ((this.$.cancelButton.focused && !e.shiftKey) || (this._focused && e.shiftKey)) {
            // Return focus back to the input field
            e.preventDefault();
            this.fire('focus-input');
          } else {
            this.async(function() {
              if (this._focused) {
                this.revealDate(this.focusedDate);
              }
            }, 1);
          }
        } else if (eventKey) {
          e.preventDefault();
          e.stopPropagation();

          switch (eventKey) {
            case 'down':
              this._moveFocusByDays(7);
              this.focus();
              break;
            case 'up':
              this._moveFocusByDays(-7);
              this.focus();
              break;
            case 'right':
              if (!this._buttonFocused()) {
                this._moveFocusByDays(1);
              }
              break;
            case 'left':
              if (!this._buttonFocused()) {
                this._moveFocusByDays(-1);
              }
              break;
            case 'enter':
              if (!this._buttonFocused()) {
                this._close();
              }
              break;
            case 'space':
              var focusedDate = this.focusedDate;
              if (vaadin.elements.datepicker.DatePickerHelper._dateEquals(focusedDate, this.selectedDate)) {
                this.selectedDate = '';
                this.focusedDate = focusedDate;
              } else {
                this.selectedDate = focusedDate;
              }
              break;
            case 'home':
              this._moveFocusInsideMonth(focus, 'minDate');
              break;
            case 'end':
              this._moveFocusInsideMonth(focus, 'maxDate');
              break;
            case 'pagedown':
              this._moveFocusByMonths(e.shiftKey ? 12 : 1);
              break;
            case 'pageup':
              this._moveFocusByMonths(e.shiftKey ? -12 : -1);
              break;
          }
        }
      },

      _buttonFocused: function() {
        return this.$.todayButton.focused || this.$.cancelButton.focused;
      },

      _currentlyFocusedDate: function() {
        return this.focusedDate || this.selectedDate || this.initialPosition || new Date();
      },

      _moveFocusByDays: function(days) {
        var focus = this._currentlyFocusedDate();
        var dateToFocus = new Date(0, 0);
        dateToFocus.setFullYear(focus.getFullYear());
        dateToFocus.setMonth(focus.getMonth());
        dateToFocus.setDate(focus.getDate() + days);

        if (this._dateAllowed(dateToFocus, this.minDate, this.maxDate)) {
          this.focusedDate = dateToFocus;
          this._focusedMonthDate = this.focusedDate.getDate();
        } else {
          if (this._dateAllowed(focus, this.minDate, this.maxDate)) {
            // Move to min or max date
            if (days > 0) { // down or right
              this.focusedDate = this.maxDate;
              this._focusedMonthDate = this.maxDate.getDate();
            } else { // up or left
              this.focusedDate = this.minDate;
              this._focusedMonthDate = this.minDate.getDate();
            }
          } else {
            // Move to closest allowed date
            this.focusedDate = vaadin.elements.datepicker.DatePickerHelper._getClosestDate(focus, [this.minDate, this.maxDate]);
            this._focusedMonthDate = this.focusedDate.getDate();
          }
        }
      },

      _moveFocusByMonths: function(months) {
        var focus = this._currentlyFocusedDate();
        var dateToFocus = new Date(0, 0);
        dateToFocus.setFullYear(focus.getFullYear());
        dateToFocus.setMonth(focus.getMonth() + months);

        var targetMonth = dateToFocus.getMonth();

        dateToFocus.setDate(this._focusedMonthDate || (this._focusedMonthDate = focus.getDate()));
        if (dateToFocus.getMonth() !== targetMonth) {
          dateToFocus.setDate(0);
        }

        if (this._dateAllowed(dateToFocus, this.minDate, this.maxDate)) {
          this.focusedDate = dateToFocus;
        } else {
          if (this._dateAllowed(focus, this.minDate, this.maxDate)) {
            // Move to min or max date
            if (months > 0) { // pagedown
              this.focusedDate = this.maxDate;
              this._focusedMonthDate = this.maxDate.getDate();
            } else { // pageup
              this.focusedDate = this.minDate;
              this._focusedMonthDate = this.minDate.getDate();
            }
          } else {
            // Move to closest allowed date
            this.focusedDate = vaadin.elements.datepicker.DatePickerHelper._getClosestDate(focus, [this.minDate, this.maxDate]);
            this._focusedMonthDate = this.focusedDate.getDate();
          }
        }
      },

      _moveFocusInsideMonth: function(focusedDate, property) {
        var dateToFocus = new Date(0, 0);
        dateToFocus.setFullYear(focusedDate.getFullYear());

        if (property === 'minDate') {
          dateToFocus.setMonth(focusedDate.getMonth());
          dateToFocus.setDate(1);
        } else {
          dateToFocus.setMonth(focusedDate.getMonth() + 1);
          dateToFocus.setDate(0);
        }

        if (this._dateAllowed(dateToFocus, this.minDate, this.maxDate)) {
          this.focusedDate = dateToFocus;
          this._focusedMonthDate = this.focusedDate.getDate();
        } else {
          if (this._dateAllowed(focusedDate, this.minDate, this.maxDate)) {
            // Move to minDate or maxDate
            this.focusedDate = this[property];
            this._focusedMonthDate = this[property].getDate();
          } else {
            // Move to closest allowed date
            this.focusedDate = vaadin.elements.datepicker.DatePickerHelper._getClosestDate(focusedDate, [this.minDate, this.maxDate]);
            this._focusedMonthDate = this.focusedDate.getDate();
          }
        }
      },

      _dateAllowed: function(date, min, max) {
        return (!min || date >= min) && (!max || date <= max);
      },

      _isTodayAllowed: function(min, max) {
        var today = new Date();
        var todayMidnight = new Date(0, 0);
        todayMidnight.setFullYear(today.getFullYear());
        todayMidnight.setMonth(today.getMonth());
        todayMidnight.setDate(today.getDate());
        return this._dateAllowed(todayMidnight, min, max);
      },

      _stopPropagation: function(e) {
        e.stopPropagation();
      }
    });
  