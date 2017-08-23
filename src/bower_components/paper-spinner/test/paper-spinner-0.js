
      'use strict';

      suite('<paper-spinner>', function() {

        suite('an accessible paper spinner', function() {
          var spinner;
          var activeSpinner;

          setup(function() {
            spinner = fixture('PaperSpinner');
            activeSpinner = fixture('ActivePaperSpinner');
          });

          test('adds an ARIA label when `alt` is supplied', function() {
            var ALT_TEXT = 'Loading the next gif...';

            spinner.alt = ALT_TEXT;
            expect(spinner.getAttribute('aria-label')).to.be.eql(ALT_TEXT);
          });

          test('hides from ARIA when inactive', function() {
            spinner.active = false;
            expect(spinner.getAttribute('aria-hidden')).to.be.eql('true');
          });

          test('toggle during cooldown', function(done) {
            activeSpinner.active = false;

            // Set active to true before cooldown animation completes.
            setTimeout(function() {
              activeSpinner.active = true;

              // Wait for cooldown animation to complete.
              setTimeout(function() {
                expect(activeSpinner.active).to.equal(true);
                done();
              }, 500);
            }, 100);
          });
        });

      });
    