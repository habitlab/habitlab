void(0)
      window.addEventListener('WebComponentsReady', function() {
        Polymer({
          is: 'event-list',

          created: function() {
            this.tapHandler = sinon.spy();
          }
        });
      });
    

  suite('basic features', function() {
    var list, container;

    setup(function() {
      container = fixture('trivialList');
      list = container.$.list;
    });

    test('event.model property is passed to declarative event handlers', function() {
      list.items = buildDataSet(100);
      PolymerFlush();
      MockInteractions.tap(getFirstItemFromList(list));

      var model = container.tapHandler.firstCall.args[0].model;
      assert.isDefined(model);
      assert.equal(model.item, list.items[0]);
      assert.equal(model.index, 0);
    });
  });

