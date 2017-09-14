
      function positionEquals(node, top, bottom, left, right) {
        var rect = node.getBoundingClientRect();
        return rect.top === top && rect.bottom === bottom &&
               rect.left === left && rect.right === right;
      }
      suite('basic layout', function() {
        suiteSetup(function() {
          // In Polymer 2.0, custom-style is lazy, and won't boot until a
          // Polymer element is used (and these tests don't have a Polymer element).
          if (Polymer.Element) {
            window.ShadyCSS.styleDocument();
          }
        });
        
        var container;

        setup(function() {
          container = fixture('basic');
        });

        test('layout-horizontal', function() {
          container.classList.add('horizontal');
          assert.isTrue(positionEquals(container, 0, 50, 0, 300), "container position ok");
          // |c1| |c2| |c3|
          assert.isTrue(positionEquals(c1, 0, 50, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 0, 50, 50, 100), "child 2 position ok");
          assert.isTrue(positionEquals(c3, 0, 50, 100, 150), "child 3 position ok");
        });

        test('layout-horizontal-reverse', function() {
          container.classList.add('horizontal-reverse');
          assert.isTrue(positionEquals(container, 0, 50, 0, 300), "container position ok");
          //     |c3| |c2| |c1|
          assert.isTrue(positionEquals(c1, 0, 50, 250, 300), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 0, 50, 200, 250), "child 2 position ok");
          assert.isTrue(positionEquals(c3, 0, 50, 150, 200), "child 3 position ok");
        });

        test('layout-vertical', function() {
          container.classList.add('vertical');
          assert.isTrue(positionEquals(container, 0, 150, 0, 300), "container position ok");
          // vertically, |c1| |c2| |c3|
          assert.isTrue(positionEquals(c1, 0, 50, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 50, 100, 0, 50), "child 2 position ok");
          assert.isTrue(positionEquals(c3, 100, 150, 0, 50), "child 3 position ok");
        });

        test('layout-vertical-reverse', function() {
          container.classList.add('vertical-reverse');
          assert.isTrue(positionEquals(container, 0, 150, 0, 300), "container position ok");
          // vertically, |c3| |c2| |c1|
          assert.isTrue(positionEquals(c1, 100, 150, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 50, 100, 0, 50), "child 2 position ok");
          assert.isTrue(positionEquals(c3, 0, 50, 0, 50), "child 3 position ok");
        });

        test('layout-wrap', function() {
          container.classList.add('horizontal');
          container.classList.add('wrap');
          container.classList.add('small');
          assert.isTrue(positionEquals(container, 0, 100, 0, 120), "container position ok");
          // |c1| |c2|
          // |c3|
          assert.isTrue(positionEquals(c1, 0, 50, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 0, 50, 50, 100), "child 2 position ok");
          assert.isTrue(positionEquals(c3, 50, 100, 0, 50), "child 3 position ok");
        });

        test('layout-wrap-reverse', function() {
          container.classList.add('horizontal-reverse');
          container.classList.add('wrap-reverse');
          container.style.width = '100px';
          assert.isTrue(positionEquals(container, 0, 100, 0, 100), "container position ok");
          //      |c3|
          // |c2| |c1|
          assert.isTrue(positionEquals(c1, 50, 100, 50, 100), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 50, 100, 0, 50), "child 2 position ok");
          assert.isTrue(positionEquals(c3, 0, 50, 50, 100), "child 3 position ok");
        });
      });

      suite('flex', function() {
        var container;

        setup(function() {
          container = fixture('flex');
        });

        test('layout-flex child in a horizontal layout', function() {
          container.classList.add('horizontal');
          c2.classList.add('flex');
          assert.isTrue(positionEquals(container, 0, 50, 0, 300), "container position ok");
          // |c1| |    c2    | |c3|
          assert.isTrue(positionEquals(c1, 0, 50, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 0, 50, 50, 250), "child 2 position ok");
          assert.isTrue(positionEquals(c3, 0, 50, 250, 300), "child 3 position ok");
        });

        test('layout-flex child in a vertical layout', function() {
          container.classList.add('vertical');
          container.classList.add('tall');
          c2.classList.add('flex');
          assert.isTrue(positionEquals(container, 0, 300, 0, 300), "container position ok");
          // vertically, |c1| |    c2    | |c3|
          assert.isTrue(positionEquals(c1, 0, 50, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 50, 250, 0, 50), "child 2 position ok");
          assert.isTrue(positionEquals(c3, 250, 300, 0, 50), "child 3 position ok");
        });

        test('layout-flex, layout-flex-2, layout-flex-3 in a horizontal layout', function() {
          container.classList.add('horizontal');
          c1.classList.add('flex');
          c2.classList.add('flex-2');
          c3.classList.add('flex-3');
          assert.isTrue(positionEquals(container, 0, 50, 0, 300), "container position ok");
          // |c1| | c2 | |  c3  |
          assert.isTrue(positionEquals(c1, 0, 50, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 0, 50, 50, 150), "child 2 position ok");
          assert.isTrue(positionEquals(c3, 0, 50, 150, 300), "child 3 position ok");
        });

        test('layout-flex, layout-flex-2, layout-flex-3 in a vertical layout', function() {
          container.classList.add('vertical');
          container.classList.add('tall');
          c1.classList.add('flex');
          c2.classList.add('flex-2');
          c3.classList.add('flex-3');
          assert.isTrue(positionEquals(container, 0, 300, 0, 300), "container position ok");
          // vertically, |c1| | c2 | |  c3  |
          assert.isTrue(positionEquals(c1, 0, 50, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 50, 150, 0, 50), "child 2 position ok");
          assert.isTrue(positionEquals(c3, 150, 300, 0, 50), "child 3 position ok");
        });
      });

      suite('alignment', function() {
        var container;

        setup(function() {
          container = fixture('single-child');
          container.classList.add('horizontal');
        });

        test('stretch (default)', function() {
          container.classList.add('tall');
          assert.isTrue(positionEquals(container, 0, 300, 0, 300), "container position ok");
          assert.isTrue(positionEquals(c1, 0, 300, 0, 50), "child 1 position ok");
        });

        test('layout-center', function() {
          container.classList.add('center');
          container.classList.add('tall');
          assert.isTrue(positionEquals(container, 0, 300, 0, 300), "container position ok");
          var center = (300 - 50) / 2;
          assert.isTrue(positionEquals(c1, center, center + 50, 0, 50), "child 1 position ok");
        });

        test('layout-start', function() {
          container.classList.add('start');
          container.classList.add('tall');
          assert.isTrue(positionEquals(container, 0, 300, 0, 300), "container position ok");
          assert.isTrue(positionEquals(c1, 0, 50, 0, 50), "child 1 position ok");
        });

        test('layout-end', function() {
          container.classList.add('end');
          container.classList.add('tall');
          assert.isTrue(positionEquals(container, 0, 300, 0, 300), "container position ok");
          assert.isTrue(positionEquals(c1, 250, 300, 0, 50), "child 1 position ok");
        });

        test('layout-start-justified', function() {
          container.classList.add('start-justified');
          assert.isTrue(positionEquals(container, 0, 50, 0, 300), "container position ok");
          assert.isTrue(positionEquals(c1, 0, 50, 0, 50), "child 1 position ok");
        });

        test('layout-end-justified', function() {
          container.classList.add('end-justified');
          assert.isTrue(positionEquals(container, 0, 50, 0, 300), "container position ok");
          assert.isTrue(positionEquals(c1, 0, 50, 250, 300), "child 1 position ok");
        });

        test('layout-center-justified', function() {
          container.classList.add('center-justified');
          assert.isTrue(positionEquals(container, 0, 50, 0, 300), "container position ok");
          var center = (300 - 50) / 2;
          assert.isTrue(positionEquals(c1, 0, 50, center, center + 50), "child 1 position ok");
        });
      });

      suite('justification', function() {
        var container;

        setup(function() {
          container = fixture('flex');
          container.classList.add('horizontal');
        });

        test('layout-justified', function() {
          container.classList.add('justified');
          assert.isTrue(positionEquals(container, 0, 50, 0, 300), "container position ok");
          var center = (300 - 50) / 2;
          assert.isTrue(positionEquals(c1, 0, 50, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 0, 50, center, center + 50), "child 2 position ok");
          assert.isTrue(positionEquals(c3, 0, 50, 250, 300), "child 3 position ok");
        });

        test('layout-around-justified', function() {
          container.classList.add('around-justified');
          assert.isTrue(positionEquals(container, 0, 50, 0, 300), "container position ok");
          var spacing = (300 - 50 * 3) / 6;
          // Every child gets `spacing` on its left and right side.
          assert.isTrue(positionEquals(c1, 0, 50, spacing, spacing + 50), "child 1 position ok");
          var end = spacing + 50 + spacing;
          assert.isTrue(positionEquals(c2, 0, 50, end + spacing, end + spacing + 50), "child 2 position ok");
          end = end + spacing + 50 + spacing;
          assert.isTrue(positionEquals(c3, 0, 50, end + spacing, end + spacing + 50), "child 3 position ok");
        });
      });

      suite('align-content', function() {
        var container;

        setup(function() {
          container = fixture('align-content');
          container.classList.add('small');
          container.classList.add('tall');
          container.classList.add('horizontal');
          container.classList.add('flex');
          container.classList.add('wrap');
        });

        test('default is stretch', function() {
          assert.isTrue(positionEquals(container, 0, 300, 0, 120), "container position ok");
          assert.isTrue(positionEquals(c1, 0, 100, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 0, 100, 50, 100), "child 2 position ok");
          assert.isTrue(positionEquals(c3, 100, 200, 0, 50), "child 3 position ok");
          assert.isTrue(positionEquals(c4, 100, 200, 50, 100), "child 4 position ok");
          assert.isTrue(positionEquals(c5, 200, 300, 0, 50), "child 5 position ok");
        });

        test('layout-start-aligned', function() {
          container.classList.add('start-aligned');
          assert.isTrue(positionEquals(container, 0, 300, 0, 120), "container position ok");
          assert.isTrue(positionEquals(c1, 0, 50, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 0, 50, 50, 100), "child 2 position ok");
          assert.isTrue(positionEquals(c3, 50, 100, 0, 50), "child 3 position ok");
          assert.isTrue(positionEquals(c4, 50, 100, 50, 100), "child 4 position ok");
          assert.isTrue(positionEquals(c5, 100, 150, 0, 50), "child 5 position ok");
        });

        test('layout-end-aligned', function() {
          container.classList.add('end-aligned');
          assert.isTrue(positionEquals(container, 0, 300, 0, 120), "container position ok");
          assert.isTrue(positionEquals(c1, 150, 200, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 150, 200, 50, 100), "child 2 position ok");
          assert.isTrue(positionEquals(c3, 200, 250, 0, 50), "child 3 position ok");
          assert.isTrue(positionEquals(c4, 200, 250, 50, 100), "child 4 position ok");
          assert.isTrue(positionEquals(c5, 250, 300, 0, 50), "child 5 position ok");
        });

        test('layout-center-aligned', function() {
          container.classList.add('center-aligned');
          assert.isTrue(positionEquals(container, 0, 300, 0, 120), "container position ok");
          var center = (300 - 50) / 2;
          assert.isTrue(positionEquals(c1, center-50, center, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, center-50, center, 50, 100), "child 2 position ok");
          assert.isTrue(positionEquals(c3, center, center+50, 0, 50), "child 3 position ok");
          assert.isTrue(positionEquals(c4, center, center+50, 50, 100), "child 4 position ok");
          assert.isTrue(positionEquals(c5, center+50, center+100, 0, 50), "child 5 position ok");
        });

        test('layout-between-aligned', function() {
          container.classList.add('between-aligned');
          assert.isTrue(positionEquals(container, 0, 300, 0, 120), "container position ok");
          var center = (300 - 50) / 2;
          assert.isTrue(positionEquals(c1, 0, 50, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 0, 50, 50, 100), "child 2 position ok");
          assert.isTrue(positionEquals(c3, center, center+50, 0, 50), "child 3 position ok");
          assert.isTrue(positionEquals(c4, center, center+50, 50, 100), "child 4 position ok");
          assert.isTrue(positionEquals(c5, 250, 300, 0, 50), "child 5 position ok");
        });

        test('layout-around-aligned', function() {
          container.classList.add('around-aligned');
          assert.isTrue(positionEquals(container, 0, 300, 0, 120), "container position ok");
          var center = (300 - 50) / 2;
          assert.isTrue(positionEquals(c1, 25, 75, 0, 50), "child 1 position ok");
          assert.isTrue(positionEquals(c2, 25, 75, 50, 100), "child 2 position ok");
          assert.isTrue(positionEquals(c3, center, center+50, 0, 50), "child 3 position ok");
          assert.isTrue(positionEquals(c4, center, center+50, 50, 100), "child 4 position ok");
          assert.isTrue(positionEquals(c5, 225, 275, 0, 50), "child 5 position ok");
        });
      });

      suite('positioning', function() {
        var container;

        setup(function() {
          container = fixture('positioning');
          container.classList.add('tall');
        });

        test('layout-fit', function() {
          c1.classList.add('fit');
          assert.isTrue(positionEquals(container, 0, 300, 0, 300), "container position ok");
          assert.isTrue(positionEquals(container, 0, 300, 0, 300), "child 1 position ok");
        });
      });
    