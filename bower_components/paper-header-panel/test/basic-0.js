

    suite('shadow', function() {
      var standard, seamed, waterfall, waterfallTall, scroll, cover;

      setup(function(done) {
        standard = fixture('standard');
        seamed = fixture('seamed');
        seamedShadow = fixture('seamed-shadow');
        waterfall = fixture('waterfall');
        waterfallTall = fixture('waterfall-tall');
        scroll = fixture('scroll');
        cover = fixture('cover');
        // async to let change handlers fire
        setTimeout(done, 0);
      });

      function hasShadow(panel) {
        return panel.visibleShadow;
      };

      test('has shadow in standard mode', function() {
        assert.isTrue(hasShadow(standard), 'shadow has display');
      });

      test('no shadow in seamed mode', function() {
        assert.isFalse(hasShadow(seamed), 'shadow is display:none');
      });

      test('no shadow in waterfall mode', function() {
        assert.isFalse(hasShadow(waterfall), 'shadow is display:none');
      });

      test('no shadow in waterfall-tall mode', function() {
        assert.isFalse(hasShadow(waterfallTall), 'shadow is display:none');
      });

      test('no shadow in scroll mode', function() {
        assert.isFalse(hasShadow(scroll), 'shadow is display:none');
      });

      test('no shadow in cover mode', function() {
        assert.isFalse(hasShadow(cover), 'shadow is display:none');
      });

      test('shadow property forces shadow to show', function() {
        assert.isTrue(hasShadow(seamedShadow), 'shadow has display');
      });

    });

  