
    suite('a11y', function() {
      var f;
      suite('without aria-label attribute set', function() {
        setup(function () {
          f = fixture('basic');
        });

        test('aria-label set on card', function() {
          assert.strictEqual(f.getAttribute('aria-label'), f.heading);
        });

        test('aria-label can be updated by heading', function() {
          assert.strictEqual(f.getAttribute('aria-label'), f.heading);
          f.heading = 'batman';
          assert.strictEqual(f.getAttribute('aria-label'), 'batman');
        });
      });

      suite('with aria-label attribute set', function() {
        setup(function () {
          f = fixture('with-aria-label');
        });

        test('defined aria-label is not overwritten by initial heading', function() {
          assert.strictEqual(f.getAttribute('aria-label'), 'the-aria-label');
        });

        test('defined aria-label is not overwritten by heading update', function() {
          assert.strictEqual(f.getAttribute('aria-label'), 'the-aria-label');
          f.heading = 'batman';
          assert.strictEqual(f.getAttribute('aria-label'), 'the-aria-label');
        });
      });

      suite('with aria-label attribute set to ""', function() {
        setup(function () {
          f = fixture('with-empty-aria-label');
        });

        test('empty aria-label is not overwritten by initial heading', function() {
          assert.strictEqual(f.getAttribute('aria-label'), '');
        });

        test('empty aria-label is not overwritten by heading update', function() {
          assert.strictEqual(f.getAttribute('aria-label'), '');
          f.heading = 'batman';
          assert.strictEqual(f.getAttribute('aria-label'), '');
        });
      });

      suite('header image', function() {
        var img;
        setup(function () {
          f = fixture('basic');
          img = f.$$('iron-image');
        });
        test('aria-hidden is set on image', function() {
          assert.strictEqual(img.getAttribute('aria-hidden'), 'true');
        });

        test('aria-hidden is removed when image is set', function() {
          f.image = 'some-image-url';
          assert.strictEqual(img.getAttribute('aria-hidden'), 'false');
        });
      });
    });

    suite('header image', function() {
      var f, img;
      setup(function () {
        f = fixture('basic');
        img = f.$$('iron-image');
      });

      test('is iron-image', function(){
        expect(img).to.be.ok;
      });

      test('width properly setup', function() {
        assert.strictEqual(img.offsetWidth, 0);
        f.image = 'some-img-url';
        assert.strictEqual(img.src, f.image);
        assert.strictEqual(img.offsetWidth, f.offsetWidth);
      });
      
      test('preload properly setup', function() {
        assert.strictEqual(img.preload, f.preloadImage);
        f.preloadImage = !f.preloadImage;
        assert.strictEqual(img.preload, f.preloadImage);
      });

      test('fade properly setup', function() {
        assert.strictEqual(img.fade, f.fadeImage);
        f.fadeImage = !f.fadeImage;
        assert.strictEqual(img.fade, f.fadeImage);
      });

      test('placeholder properly setup', function() {
        assert.strictEqual(img.placeholder, null);
        f.placeholderImage = 'some-place-holder';
        assert.strictEqual(img.placeholder, f.placeholderImage);
      });

      test('alt properly setup', function() {
        assert.strictEqual(img.alt, null);
        f.alt = 'some-text';
        assert.strictEqual(img.alt, f.alt);
      });
    });
  