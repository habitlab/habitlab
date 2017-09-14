
    describe('custom input', function() {
      var datepicker;

      beforeEach(function() {
        datepicker = fixture('custom-input-datepicker');
      });

      it('should open calendar on tap', function() {
        // mock-interactions tap does not work in mobile devices
        tap(datepicker);
        expect(datepicker.$.dropdown.opened).to.be.true;
      });

      it('should open calendar on input', function() {
        var target = datepicker.inputElement;
        target.value = '1';
        target.fire('input');
        expect(datepicker.$.dropdown.opened).to.be.true;
      });

      it('should not auto focus overlay', function() {
        expect(datepicker.$.dropdown.noAutoFocus).to.equal(true);
      });
    });
  