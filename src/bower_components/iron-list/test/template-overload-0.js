void(0)

    suite('template overloading', function() {
      var list;

      setup(function() {
        list = fixture('templateOverloadList');
      });

      test('check physical item size', function(done) {
        var setSize = 10;
        list.items = buildDataSet(setSize);

        flush(function() {
          assert.equal(list.items.length, setSize);
          done();
        });
      });

      test('check item template', function(done) {
        list.items = buildDataSet(1);

        flush(function() {
          assert.isNotNull(Polymer.dom(list).querySelector('.overloaded-template'));
          done();
        });
      });

      test('check count of physical items', function(done) {
        var setSize = 1;
        list.items = buildDataSet(setSize);

        flush(function() {
          assert.equal(Polymer.dom(list).querySelectorAll('*').length - 1, setSize);
          done();
        });
      });
    });

  