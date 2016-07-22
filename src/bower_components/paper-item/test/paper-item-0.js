
      suite('paper-item basic', function() {
        var item, clickHandler;

        setup(function() {
          item = fixture('item').querySelector('paper-item');
          clickHandler = sinon.spy();
          item.addEventListener('click', clickHandler);
        });

        test('space triggers a click event', function(done) {
          MockInteractions.pressSpace(item);
          Polymer.Base.async(function(){
            // You need two ticks, one for the MockInteractions event, and one
            // for the button event.
            Polymer.Base.async(function(){
              expect(clickHandler.callCount).to.be.equal(1);
              done();
            }, 1);
          }, 1);
        });

        test('enter triggers a click event', function(done) {
          MockInteractions.pressEnter(item);
          Polymer.Base.async(function(){
            // You need two ticks, one for the MockInteractions event, and one
            // for the button event.
            Polymer.Base.async(function(){
              expect(clickHandler.callCount).to.be.equal(1);
              done();
            }, 1);
          }, 1);
        });
      });

      suite('paper-icon-item basic', function() {
        var item, clickHandler;

        setup(function() {
          item = fixture('iconItem').querySelector('paper-icon-item');
          clickHandler = sinon.spy();
          item.addEventListener('click', clickHandler);
        });

        test('space triggers a click event', function(done) {
          MockInteractions.pressSpace(item);
          Polymer.Base.async(function(){
            // You need two ticks, one for the MockInteractions event, and one
            // for the button event.
            Polymer.Base.async(function(){
              expect(clickHandler.callCount).to.be.equal(1);
              done();
            }, 1);
          }, 1);
        });

        test('click triggers a click event', function(done) {
          MockInteractions.tap(item);
          Polymer.Base.async(function(){
            expect(clickHandler.callCount).to.be.equal(1);
            done();
          }, 1);
        });
      });

      suite('clickable element inside item', function() {
        test('paper-item: space in child native input does not trigger a click event', function(done) {
          var f = fixture('item-with-input');
          var outerItem = f.querySelector('paper-item');
          var innerInput = f.querySelector('input');

          var itemClickHandler = sinon.spy();
          outerItem.addEventListener('click', itemClickHandler);

          innerInput.focus();
          MockInteractions.pressSpace(innerInput);
          Polymer.Base.async(function(){
            expect(itemClickHandler.callCount).to.be.equal(0);
            done();
          }, 1);
        });

        test('paper-item: space in child paper-input does not trigger a click event', function(done) {
          var f = fixture('item-with-paper-input');
          var outerItem = f.querySelector('paper-item');
          var innerInput = f.querySelector('paper-input');

          var itemClickHandler = sinon.spy();
          outerItem.addEventListener('click', itemClickHandler);

          innerInput.focus();
          MockInteractions.pressSpace(innerInput);
          Polymer.Base.async(function(){
            expect(itemClickHandler.callCount).to.be.equal(0);
            done();
          }, 1);
        });

        test('paper-icon-item: space in child input does not trigger a click event', function(done) {
          var f = fixture('iconItem-with-input');
          var outerItem = f.querySelector('paper-icon-item');
          var innerInput = f.querySelector('input');

          var itemClickHandler = sinon.spy();
          outerItem.addEventListener('click', itemClickHandler);

          MockInteractions.pressSpace(innerInput);
          Polymer.Base.async(function(){
            expect(itemClickHandler.callCount).to.be.equal(0);
            done();
          }, 1);
        });
      });

      suite('item a11y tests', function() {
        var item, iconItem;

        setup(function() {
          item = fixture('item').querySelector('paper-item');
          iconItem = fixture('iconItem').querySelector('paper-icon-item');
        });

        test('item has role="listitem"', function() {
          assert.equal(item.getAttribute('role'), 'option', 'has role="option"');
        });

        test('icon item has role="listitem"', function() {
          assert.equal(iconItem.getAttribute('role'), 'option', 'has role="option"');
        });

        a11ySuite('item');
        a11ySuite('button');
        a11ySuite('iconItem');
      });

    