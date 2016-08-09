
    (function() {
      function warn() {
        if (window.console) {
          console.warn.apply(console, arguments);
        }
      }

      Polymer({
        is: 'paper-time-picker',
        properties: {
          /**
           * The selected time
           */
          time: {
            type: String,
            value: '00:00',
            notify: true,
            observer: '_timeChanged' 
          },
          /**
           * The time value as the number of minutes from midnight
           */
          rawValue: {
            type: Number,
            value: 0,
            notify: true,
            observer: '_rawValueChanged'
          },
          /**
           * The current 24-hour value (0-24)
           */
          hour: {
            type: Number,
            observer: '_hourChanged',
            notify: true,
            value: 0
          },
          /**
           * The current 12-hour value (0-12)
           */
          hour12: {
            type: Number,
            notify: true,
            observer: '_hour12Changed'
          },
          /**
           * The current minute (0-59)
           */
          minute: {
            type: Number,
            notify: true,
            observer: '_minuteChanged',
            value: 0
          },
          /**
           * The current period ('AM', 'PM')
           */
          period: {
            type: String,
            notify: true,
            observer: '_periodChanged',
            value: 'AM'
          },
          /**
           * The current selector view ('hours' or 'minutes')
           */
          view: {
            type: String,
            notify: true,
            value: 'hours',
            observer: '_viewChanged'
          },
          /**
           * Maximum screen width at which the picker uses a vertical layout
           */
          responsiveWidth: {
            type: String,
            value: '560px'
          },
          /**
           * Force narrow layout
           */
          forceNarrow: {
            type: Boolean,
            value: false
          },
          /**
           * Whether or not to animate the clock hand between selections
           */
          animated: {
            type: Boolean,
            value: false
          },
          narrow: {
            type: Boolean,
            reflectToAttribute: true,
            value: false,
            notify: true,
          },
          isTouch: {
            type: Boolean,
            value: false,
            reflectToAttribute: true
          },
          _queryMatches: {
            type: Boolean,
            value: false,
            observer: '_computeNarrow'
          }
        },
        behaviors: [
          Polymer.IronResizableBehavior
        ],
        observers: [
          '_updateTime(hour, minute)'
        ],
        listeners: {
          'iron-resize': '_resizeHandler',
          'paper-clock-selected': '_onClockSelected'
        },
        ready: function() {
          this.isTouch = 'ontouchstart' in window;
          this.view = 'hours';
        },
        _timeChanged: function(time) {
          if (!time) {
            this.rawValue = 0;
            return;
          }

          var parsed = this.parseTime(time);
          var cleanedTime = this.formatTime(parsed.hour, parsed.minute);
          if (cleanedTime !== time) {
            this.time = cleanedTime;
            return;
          }
          this.rawValue = (parsed.hour * 60) + parsed.minute;
        },
        _updateTime: function(hour, minute) {
          this.rawValue = (hour * 60) + minute;
        },
        formatTime: function(hour, minute) {
          var period = (hour % 24) < 12 ? 'AM' : 'PM';
          hour = hour % 12 || 12;
          minute = ('0' + minute).substr(-2);
          return hour + ':' + minute + ' ' + period;
        },
        parseTime: function(timeString) {
          var pattern = /^\s*(\d{1,2}):?(\d{2})(\s*([AaPp])\.?[Mm]\.?|[A-Z])?\s*$/;
          var match = timeString.match(pattern);
          if (!match) {
            warn('Invalid time:', timeString);
            return;
          }
          var hour = parseInt(match[1]);
          var minute = parseInt(match[2]);
          var period = match[4] ? (match[4][0].toUpperCase() + 'M') : 'AM';
          if (period === 'PM' && hour < 12) {
            hour = (hour + 12) % 24;
          } else if (period === 'AM' && hour === 12) {
            hour = 0;
          }
          return {hour: hour, minute: minute};
        },
        togglePeriod: function() {
          this.period = (this.period === 'AM') ? 'PM' : 'AM';
        },
        _rawValueChanged: function(value, oldValue) {
          if (isNaN(parseInt(value))) {
            this.rawValue = oldValue;
            return;
          }
          this.hour = Math.floor(value / 60);
          this.minute = value % 60;
          this.time = this.formatTime(this.hour, this.minute);
        },
        _hour12Changed: function(hour12) {
          var add = (this.period === 'PM' ? 12 : 0);
          this.hour = ((hour12 % 12) + add) % 24;
        },
        _hourChanged: function(hour, oldValue) {
          hour = parseInt(hour);
          if (isNaN(hour) && !hour) {
            return;
          }
          if (isNaN(hour)) {
            warn('Invalid number:', hour);
            this.hour = oldValue;
            return;
          }
          hour = parseFloat(hour) % 24;
          this.hour = hour;
          this.hour12 = this._twelveHour(hour);
          this.period = ['PM', 'AM'][+(hour < 12)];
        },
        _minuteChanged: function(minute) {
          minute = parseFloat(minute) % 60;
          this.minute = minute;
        },
        _periodChanged: function(period) {
          if (isNaN(parseInt(this.hour)) || isNaN(parseInt(this.minute))) {
            return;
          }
          if (period === 'AM' &&  this.hour >= 12) {
            this.hour -= 12;
          } else if (period === 'PM' && this.hour < 12) {
            this.hour += 12;
          }
        },
        _zeroPad: function(value, length) {
          if (value === undefined || isNaN(value) || isNaN(length)) {
            return;
          }
          return ('0' + value).substr(-length);
        },
        _twelveHour: function(hour) {
          return hour % 12 || 12;
        },
        _isEqual: function(a, b) {
          return a === b;
        },
        _getMediaQuery: function(forceNarrow, responsiveWidth) {
          return '(max-width: ' + (forceNarrow ? '' : responsiveWidth) + ')';
        },
        _computeNarrow: function() {
          this.set('narrow', this._queryMatches || this.forceNarrow);
        },
        _viewChanged: function(toView, fromView) {
          this.$.pages._notifyPageResize();

          // prevent the clock-hand transition when selecting, otherwise the 
          // extra movement would be confusing
          if (this._selecting || !fromView || !toView || !this.animated) {
            return;
          }

          var clocks = {'hours': this.$.hourClock, 'minutes': this.$.minuteClock};
          var from = clocks[fromView];
          var to = clocks[toView];
          var fromAngle = (360 / from.count) * from.selected;
          var toAngle = (360 / to.count) * to.selected;

          // transition both clock hands at the same time
          to.setClockHand(fromAngle, false);
          from.setClockHand(toAngle);

          this.async(function() {
            to.setClockHand(toAngle, true, function() {
              this.async(function() {
                from.setClockHand(fromAngle, false);
              }, 200);
            }.bind(this));
          }.bind(this));
        },
        _onClockSelected: function(event) {
          if (this.view === 'hours') {

            var showMinutes = function() {
              this.async(function() {
                this._selecting = true;
                this.view = 'minutes';
                this._selecting = false;
              }.bind(this), 100);
              this.$.hourClock.removeEventListener('paper-clock-transition-end', showMinutes);
            }.bind(this);

            if (event.detail.animated) {
              this.$.hourClock.addEventListener('paper-clock-transition-end', showMinutes);
            } else {
              showMinutes();
            }

            this.hour12 = event.detail.value;
          }
        },
        _resizeHandler: function() {
          if (!this.offsetWidth || this._resizing) {
            return;
          }
          this.updateStyles();
          this.async(function() {
            this._resizing = true;
            this.$.pages._notifyPageResize();
            this._resizing = false;
          }.bind(this));
        }
      });
    })();
  