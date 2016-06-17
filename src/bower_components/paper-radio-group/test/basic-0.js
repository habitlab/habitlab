
      suite('defaults', function() {
        var LEFT_ARROW = 37;
        var RIGHT_ARROW = 39;

        test('group can have no selection', function (done) {
          var g = fixture('NoSelection');

          // Needs to be async since the underlying iron-selector uses observeNodes.
          Polymer.Base.async(function() {
            expect(g.selected).to.not.be.ok;
            var items = g.items;
            expect(items.length).to.be.equal(3);

            expect(items[0].checked).to.be.equal(false);
            expect(items[1].checked).to.be.equal(false);
            expect(items[2].checked).to.be.equal(false);

            done();
          }, 1);

        });

        test('group can have a selection', function (done) {
          var g = fixture('WithSelection');

          // Needs to be async since the underlying iron-selector uses observeNodes.
          Polymer.Base.async(function() {
            expect(g.selected).to.be.ok;
            var items = g.items;
            expect(items.length).to.be.equal(3);

            expect(items[0].checked).to.be.equal(true);
            expect(items[1].checked).to.be.equal(false);
            expect(items[2].checked).to.be.equal(false);
            expect(items[0].getAttribute('name')).to.be.equal(g.selected);

            done();
          }, 1);
        });

        test('right arrow advances the selection', function (done) {
          var g = fixture('WithSelection');
          MockInteractions.focus(g);

          // Needs to be async since the underlying iron-selector uses observeNodes.
          Polymer.Base.async(function() {
            var items = g.items;
            expect(items[0].checked).to.be.equal(true);

            g.addEventListener('paper-radio-group-changed', function () {
              expect(items[0].checked).to.be.equal(false);
              expect(items[1].checked).to.be.equal(true);
              expect(items[2].checked).to.be.equal(false);
              done();
            });
            MockInteractions.keyDownOn(g, RIGHT_ARROW);
          }, 1);
        });

        test('left arrow reverses the selection', function (done) {
          var g = fixture('WithSelection');
          MockInteractions.focus(g);

          // Needs to be async since the underlying iron-selector uses observeNodes.
          Polymer.Base.async(function() {
            var items = g.items;
            expect(items[0].checked).to.be.equal(true);

            g.addEventListener('paper-radio-group-changed', function () {
              expect(items[0].checked).to.be.equal(false);
              expect(items[1].checked).to.be.equal(false);
              expect(items[2].checked).to.be.equal(true);
              done();
            });
            MockInteractions.keyDownOn(g, LEFT_ARROW);
          }, 1);
        });

        test('selection should skip disabled items', function (done) {
          var g = fixture('WithDisabled');
          MockInteractions.focus(g);

          // Needs to be async since the underlying iron-selector uses observeNodes.
          Polymer.Base.async(function() {
            var items = g.items;
            expect(items[0].checked).to.be.equal(true);

            g.addEventListener('paper-radio-group-changed', function () {
              expect(items[0].checked).to.be.equal(false);
              expect(items[1].checked).to.be.equal(false);
              expect(items[2].checked).to.be.equal(true);
              done();
            });
            MockInteractions.keyDownOn(g, RIGHT_ARROW);
          }, 1);
        });

        test('clicking should change the selection', function (done) {
          var g = fixture('WithSelection');
          MockInteractions.focus(g);

          // Needs to be async since the underlying iron-selector uses observeNodes.
          Polymer.Base.async(function() {
            var items = g.items;
            expect(items[0].checked).to.be.equal(true);

            g.addEventListener('paper-radio-group-changed', function () {
              expect(items[0].checked).to.be.equal(false);
              expect(items[1].checked).to.be.equal(true);
              expect(items[2].checked).to.be.equal(false);
              done();
            });
            MockInteractions.tap(items[1]);
          }, 1);
        });

        test('clicking the selected item should not deselect', function (done) {
          var g = fixture('WithSelection');
          MockInteractions.focus(g);

          // Needs to be async since the underlying iron-selector uses observeNodes.
          Polymer.Base.async(function() {
            var items = g.items;
            expect(items[0].checked).to.be.equal(true);

            // The selection should not change, but wait for a little bit just
            // in case it would and an event would be fired.
            setTimeout(function() {
              expect(items[0].checked).to.be.equal(true);
              expect(items[1].checked).to.be.equal(false);
              expect(items[2].checked).to.be.equal(false);
              done();
            }, 1);
            MockInteractions.tap(items[0]);
          }, 1);
        });

        test('clicking the selected item should deselect if allow-empty-selection is set', function (done) {
          var g = fixture('WithSelection');
          g.allowEmptySelection = true;

          // Needs to be async since the underlying iron-selector uses observeNodes.
          Polymer.Base.async(function() {
            var items = g.items;
            expect(items[0].checked).to.be.equal(true);

            // The selection should not change, but wait for a little bit just
            // in case it would and an event would be fired.
            setTimeout(function() {
              expect(items[0].checked).to.be.equal(false);
              expect(items[1].checked).to.be.equal(false);
              expect(items[2].checked).to.be.equal(false);
              done();
            }, 1);
            MockInteractions.tap(items[0]);
          }, 1);
        });

        test('arrow keys cause iron-activate events', function(done) {
          var g = fixture('WithSelection');
          MockInteractions.focus(g);

          // Needs to be async since the underlying iron-selector uses observeNodes.
          Polymer.Base.async(function() {
            g.items[0].focus();

            var i = 0;
            g.addEventListener('iron-activate', function() {
              switch (i++) {
                case 0:
                  MockInteractions.pressAndReleaseKeyOn(g, 38);
                break;

                case 1:
                  MockInteractions.pressAndReleaseKeyOn(g, 39);
                break;

                case 2:
                  MockInteractions.pressAndReleaseKeyOn(g, 40);
                break;

                default:
                  done();
              }
            });

            MockInteractions.pressAndReleaseKeyOn(g, 37);
          }, 1);
        });

      });
    