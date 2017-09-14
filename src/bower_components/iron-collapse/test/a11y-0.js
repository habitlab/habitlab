

      suite('a11y', function() {
        var collapse;

        setup(function () {
          collapse = fixture('trivialCollapse');
        });

        test('aria attributes', function() {
          assert.equal(collapse.getAttribute('role'), 'group');
          assert.equal(collapse.getAttribute('aria-expanded'), 'false');
          assert.equal(collapse.getAttribute('aria-hidden'), 'true');
        });

        test('set opened to true', function() {
          collapse.opened = true;
          assert.equal(collapse.getAttribute('aria-expanded'), 'true');
          assert.equal(collapse.getAttribute('aria-hidden'), 'false');
        });

        test('focus the collapse when opened', function() {
          assert.notEqual(document.activeElement, collapse);
          collapse.opened = true;
          assert.equal(document.activeElement, collapse);
        });

        a11ySuite('trivialCollapse');

      });

    