

      suite('nested', function() {

        var outerCollapse;
        var innerCollapse;

        setup(function () {
          outerCollapse = fixture('test');
        });

        suite('vertical', function() {

          setup(function () {
            innerCollapse = outerCollapse.querySelector('#inner-collapse-vertical');
          });

          test('inner collapse default opened attribute', function() {
            assert.equal(innerCollapse.opened, false);
          });

          test('inner collapse default style height', function() {
            assert.equal(innerCollapse.style.maxHeight, '0px');
          });

          test('open inner collapse updates size without animation', function() {
            innerCollapse.opened = true;

            // Animation disabled
            assert.equal(innerCollapse.style.transitionDuration, '0s');
          });

          test('open inner collapse then open outer collapse reveals inner collapse with expanded height', function() {
            innerCollapse.opened = true;
            outerCollapse.opened = true;

            assert.equal(innerCollapse.getBoundingClientRect().height, 100);
          });

          test('notifyResize triggered only on element\'s animations', function(done) {
            var spy = sinon.spy(outerCollapse, 'notifyResize');

            outerCollapse.opened = true;
            innerCollapse.opened = true;

            setTimeout(function() {
              assert.equal(spy.callCount, 1, 'notifyResize called once');
              done();
            }, 400);
          });

        });

        suite('horizontal', function() {

          setup(function () {
            innerCollapse = outerCollapse.querySelector('#inner-collapse-horizontal');
          });

          test('inner collapse default style width', function() {
            assert.equal(innerCollapse.style.maxWidth, '0px');
          });

          test('open inner collapse updates size without animation', function() {
            innerCollapse.opened = true;

            // Animation disabled
            assert.equal(innerCollapse.style.transitionDuration, '0s');
          });

          test('open inner collapse then open outer collapse reveals inner collapse with expanded width', function() {
            innerCollapse.opened = true;
            outerCollapse.opened = true;

            assert.equal(innerCollapse.getBoundingClientRect().width, 100);
          });

        });
      });
    