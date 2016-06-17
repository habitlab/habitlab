

      suite('links', function() {

        suite('has link attribute', function() {

          var tabs;
          var tab, anchor;

          setup(function () {
            tabs = fixture('links');
            tab = tabs.querySelectorAll('paper-tab')[1];
            anchor = tab.querySelector('a');
          });

          test('pressing enter on tab causes anchor click', function(done) {
            tab.addEventListener('click', function onTabClick(event) {
              tab.removeEventListener('click', onTabClick);

              expect(event.target).to.be.equal(anchor);
              done();
            });

            MockInteractions.pressEnter(tab);
          });

          test('pressing space on tab causes anchor click', function(done) {
            tab.addEventListener('click', function onTabClick(event) {
              tab.removeEventListener('click', onTabClick);

              expect(event.target).to.be.equal(anchor);
              done();
            });

            MockInteractions.pressSpace(tab);
          });

        });

        suite('does not have link attribute', function() {

          var tabs;
          var tab, anchor;

          setup(function () {
            tabs = fixture('not-links');
            tab = tabs.querySelectorAll('paper-tab')[1];
            anchor = tab.querySelector('a');
          });

          test('pressing enter on tab does not cause anchor click', function(done) {
            tab.addEventListener('click', function onTabClick(event) {
              tab.removeEventListener('click', onTabClick);

              expect(event.target).to.not.equal(anchor);
              expect(event.target).to.be.equal(tab);
              done();
            });

            MockInteractions.pressEnter(tab);
          });

        });

        suite('not first child', function() {

          var tabs;
          var tab, anchor;

          setup(function () {
            tabs = fixture('links');
            tab = tabs.querySelectorAll('paper-tab')[1];
            anchor = tab.querySelector('a');
          });

          test('pressing enter on tab causes anchor click', function(done) {
            tab.addEventListener('click', function onTabClick(event) {
              tab.removeEventListener('click', onTabClick);

              expect(event.target).to.be.equal(anchor);
              done();
            });

            MockInteractions.pressEnter(tab);
          });

        });

      });

    