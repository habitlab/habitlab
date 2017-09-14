


    suite('<iron-iconset>', function() {

      suite('basic behavior', function() {
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

      suite('when stamping in an RTL context', function() {

        var rtlSuite = function(iconsetFixture, iconContainerFixture) {
          var iconset;
          var iconContainer;

          setup(function() {
            iconset = fixture(iconsetFixture);
            iconContainer = fixture(iconContainerFixture);
          });

          test('icons marked as mirror-in-rtl are mirrored', function() {
            iconset.applyIcon(iconContainer, 'rect');
            var svg = iconContainer.firstElementChild;
            var computedStyle = window.getComputedStyle(svg);
            var transform = computedStyle.transform || computedStyle.webkitTransform;
            expect(transform).to.be.eql('matrix(-1, 0, 0, 1, 0, 0)');
          });

          test('icons not marked as mirror-in-rtl are not mirrored', function() {
            iconset.applyIcon(iconContainer, 'circle');
            var svg = iconContainer.firstElementChild;
            var computedStyle = window.getComputedStyle(svg);
            var transform = computedStyle.transform || computedStyle.webkitTransform;
            expect(transform).to.be.eql('none');
          });

          test('getComputedStyle is called no more once for all icons', function() {
            sinon.spy(window, 'getComputedStyle');

            for (var i = 0; i < 3; ++i) {
              iconset.applyIcon(iconContainer, 'rect');
            }

            expect(window.getComputedStyle.callCount).to.be.lessThan(2);
            window.getComputedStyle.restore();
          });
        };

        rtlSuite('MirroredIconsetSvg', 'RtlContainer');

        suite('when preferring the global RTL attribute', function() {

          suite('and dir="rtl" on <body>', function() {
            setup(function() {
              document.body.setAttribute('dir', 'rtl');
            });

            teardown(function() {
              document.body.removeAttribute('dir');
            });

            rtlSuite('GloballyMirroredIconsetSVG', 'DefaultContainer');
          });

          suite('and dir="rtl" on <html>', function() {
            setup(function() {
              document.documentElement.setAttribute('dir', 'rtl');
            });

            teardown(function() {
              document.documentElement.removeAttribute('dir');
            });

            rtlSuite('GloballyMirroredIconsetSVG', 'DefaultContainer');
          });
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

      suite('Adding / removal from iron-icon', function () {
        var iconset;
        var div;
        var ironIcon;

        setup(function () {
          var elements = fixture('StandardIconsetSvg');
          iconset = elements[0];
          div = elements[1];
          ironIcon = elements[2];
        });

        test('be able to remove an iconset from a standard DOM element', function () {
          iconset.applyIcon(div, 'circle');
          Polymer.dom.flush();
          expect(div.children.length).to.be.equal(1);
          iconset.removeIcon(div);
          Polymer.dom.flush();
          expect(div.children.length).to.be.equal(0);
        });

        test('be able to remove an iconset from a Polymer element', function () {
          var baseLength = Polymer.dom(ironIcon.root).children.length;
          iconset.applyIcon(ironIcon, 'circle');
          Polymer.dom.flush();
          expect(Polymer.dom(ironIcon.root).children.length - baseLength).to.be.equal(1);
          iconset.removeIcon(ironIcon);
          Polymer.dom.flush();
          expect(Polymer.dom(ironIcon.root).children.length - baseLength).to.be.equal(0);
        });

        test('prevents SVG from receiving a tab stop in IE/Edge', function() {
            iconset.applyIcon(div, 'rect');
            expect(div.firstElementChild.getAttribute('focusable')).to.be.equal('false');
        });

      });

    });

  