
    var fake = new Fake();

    function centerOf(node) {
      var rect = node.getBoundingClientRect();
      return {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2};
    }

    function approxEqual(p1, p2) {
      return Math.floor(p1.x) == Math.floor(p2.x) && Math.floor(p1.y) == Math.floor(p2.y);
    }

    test('tall container', function(done) {
      var ripple1 = document.querySelector('.ripple-1-tap');
      fake.downOnNode(ripple1, function() {
        requestAnimationFrame(function() {
          var wave = document.querySelector('.ripple-1 /deep/ .wave');
          assert.ok(approxEqual(centerOf(ripple1), centerOf(wave)));
          done();
        });
      });
    });

    test('wide container', function(done) {
      var ripple2 = document.querySelector('.ripple-2-tap');
      fake.downOnNode(ripple2, function() {
        requestAnimationFrame(function() {
          var wave = document.querySelector('.ripple-2 /deep/ .wave');
          assert.ok(approxEqual(centerOf(ripple2), centerOf(wave)));
          done();
        });

      });
    });

  