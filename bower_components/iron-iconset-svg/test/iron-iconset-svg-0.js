

    suite('<iron-iconset>', function () {

      suite('basic behavior', function () {
        var iconset;
        var meta;
        var loadedPromise;

        setup(function () {
          loadedPromise = new Promise(function(resolve) {
            window.addEventListener('iron-iconset-added', function(ev) {
              if (ev && ev.detail === iconset) {
                resolve();
              }
            });
          });
          var elements = fixture('TrivialIconsetSvg');
          iconset = elements[0];
          meta = elements[1];
        });

        test('it can be accessed via iron-meta', function () {
          expect(meta.byKey('foo')).to.be.equal(iconset);
        });

        test('it does not have a size', function () {
          var rect = iconset.getBoundingClientRect();
          expect(rect.width).to.be.equal(0);
          expect(rect.height).to.be.equal(0);
        });

        test('it fires an iron-iconset-added event on the window', function() {
          return loadedPromise;
        });
      });

      suite('when paired with a size and SVG definition', function () {
        var iconset;
        var div;

        setup(function () {
          var elements = fixture('StandardIconsetSvg');
          iconset = elements[0];
          div = elements[1];
        });

        test('it does not have a size', function () {
          var rect = iconset.getBoundingClientRect();
          expect(rect.width).to.be.equal(0);
          expect(rect.height).to.be.equal(0);
        });
        
        test('appends a child to the target element', function () {
          expect(div.firstElementChild).to.not.be.ok;
          iconset.applyIcon(div, 'circle');
          expect(div.firstElementChild).to.be.ok;
        });

        test('can be queried for all available icons', function () {
          expect(iconset.getIconNames()).to.deep.eql(['my-icons:circle', 'my-icons:square', 'my-icons:rect']);
        });

        test('supports any icon defined in the svg', function () {
          var lastSvgIcon;

          iconset.getIconNames().forEach(function (iconName) {
            iconset.applyIcon(div, iconName.split(':').pop());
            expect(div.firstElementChild).to.not.be.equal(lastSvgIcon);
            lastSvgIcon = div.firstElementChild;
          });
        });

        test('prefers a viewBox attribute over the iconset size', function () {
          iconset.applyIcon(div, 'rect');
          expect(div.firstElementChild.getAttribute('viewBox')).to.be.equal('0 0 50 25');
        });

        test('uses the iconset size when viewBox is not defined on the element', function () {
          iconset.applyIcon(div, 'circle');
          expect(div.firstElementChild.getAttribute('viewBox')).to.be.equal('0 0 20 20');
        });

      });

    });

  