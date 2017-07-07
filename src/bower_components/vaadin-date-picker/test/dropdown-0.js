
    HTMLImports.whenReady(function() {
      Polymer({
        is: 'vaadin-date-picker-wrapper'
      });
    });
  
    describe('Dropdown', function() {
      var datepicker;
      var dropdown;

      beforeEach(function() {
        datepicker = fixture('datepicker');
        dropdown = datepicker.$.dropdown;
      });

      afterEach(function(done) {
        datepicker.async(done, 1);
      });

      it('should set body `pointer-events: none` on open and restore initial value on close', function(done) {
        document.body.style.pointerEvents = 'painted';

        datepicker.addEventListener('iron-overlay-opened', function() {
          expect(getComputedStyle(document.body).pointerEvents).to.be.equal('none');
          expect(getComputedStyle(datepicker).pointerEvents).to.be.equal('auto');
          datepicker._close();
        });

        datepicker.addEventListener('iron-overlay-closed', function() {
          expect(getComputedStyle(document.body).pointerEvents).to.be.equal('painted');
          done();
        });

        datepicker.open();
      });

      it('should not close on calendar icon down', function(done) {
        datepicker.addEventListener('iron-overlay-opened', function() {
          MockInteractions.down(datepicker.$.calendar);
          expect(datepicker.$.dropdown.opened).to.be.true;

          done();
        });
        datepicker.open();
      });

      if (document.createElement('div').style.webkitOverflowScrolling === '') {
        it('should handle webkit-overflow-scrolling', function(done) {
          document.body.style.webkitOverflowScrolling = 'touch';

          datepicker.addEventListener('iron-overlay-opened', function() {
            expect(window.getComputedStyle(document.body).webkitOverflowScrolling).to.equal('auto');
            datepicker.close();
          });

          datepicker.addEventListener('iron-overlay-closed', function() {
            expect(window.getComputedStyle(document.body).webkitOverflowScrolling).to.equal('touch');
            done();
          });
          datepicker.open();
        });
      }

      describe('Sizing', function() {

        beforeEach(function() {
          var viewport = document.createElement('meta');
          viewport.setAttribute('name', 'viewport');
          viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0');
          document.getElementsByTagName('head')[0].appendChild(viewport);

          datepicker._fullscreenMediaQuery = 'max-width: 520px';
        });

        it('should select fullscreen/desktop mode', function(done) {
          datepicker.addEventListener('iron-overlay-opened', function() {
            var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            var fullscreen = viewportWidth < 520;

            expect(isFullscreen(datepicker)).to.equal(fullscreen);
            expect(dropdown.style.marginTop).to.equal((fullscreen ? 0 : datepicker.clientHeight + 2) + 'px');
            expect(dropdown.positionTarget).to.equal(fullscreen ? document.documentElement : datepicker);
            done();
          });
          Polymer.Base.async(function() {
            datepicker.open();
          });
        });

      });

      describe('Alignment', function() {

        beforeEach(function() {
          document.body.style.padding = '500px';
        });

        it('should align top/left', function(done) {
          datepicker.style.left = '0';
          datepicker.style.top = '0';
          datepicker.addEventListener('iron-overlay-opened', function() {
            expect(dropdown.verticalAlign).to.equal('top');
            expect(dropdown.horizontalAlign).to.equal('left');
            done();
          });
          datepicker.open();
        });

        it('should align borrom/right', function(done) {
          datepicker.style.right = '0';
          datepicker.style.bottom = '0';
          datepicker.addEventListener('iron-overlay-opened', function() {
            expect(datepicker.$.dropdown.verticalAlign).to.equal('bottom');
            expect(datepicker.$.dropdown.horizontalAlign).to.equal('right');
            done();
          });
          datepicker.open();
        });

      });
    });

    describe('Dropdown-wrapped', function() {
      var datepicker;

      beforeEach(function() {
        datepicker = fixture('datepicker-wrapped').$.datepicker;
      });

      afterEach(function(done) {
        datepicker.async(done, 1);
      });

      it('should not close on calendar icon down', function(done) {
        datepicker.addEventListener('iron-overlay-opened', function() {
          MockInteractions.down(datepicker.$.calendar);
          expect(datepicker.$.dropdown.opened).to.be.true;

          done();
        });
        datepicker.open();
      });

    });
  