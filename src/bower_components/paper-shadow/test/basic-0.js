

    var s1 = document.getElementById('s1');

    var fake = new Fake();

    test('default', function() {
      assert.notEqual(getComputedStyle(s1.$['shadow-bottom'])['box-shadow'], 'none');
    });

    test('shadows are pointer-events: none', function(done) {
      var foo = document.getElementById('foo');
      PolymerGestures.addEventListener(wrap(document), 'tap', function(e) {
        assert.strictEqual(e.target, foo);
        done();
      });
      fake.downOnNode(foo, function() {
        fake.upOnNode(foo);
      });
    });

  