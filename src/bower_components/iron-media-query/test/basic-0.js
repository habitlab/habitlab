

      suite('basic', function() {
        var mq;

        suite('set query with different values', function() {
          setup(function () {
            mq = fixture('basic');
          });

          test('small min-width value', function() {
            mq.query = '(min-width: 1px)';
            assert.equal(mq.queryMatches, true);
          });

          test('large min-width value', function() {
            mq.query = '(min-width: 10000px)';
            assert.equal(mq.queryMatches, false);
          });

          test('small max-width value', function() {
            mq.query = '(max-width: 1px)';
            assert.equal(mq.queryMatches, false);
          });

          test('large max-width value', function() {
            mq.query = '(max-width: 10000px)';
            assert.equal(mq.queryMatches, true);
          });

          test('automatically wrap with parens', function() {
            mq.query = 'min-width: 1px';
            assert.equal(mq.queryMatches, true);
          });

          suite('`full` attribute', function() {
            test('media features without wrapping parentheses no longer match', function() {
              mq.full = true;
              mq.query = 'min-width: 1px';
              assert.equal(mq.queryMatches, false);
            });

            test('media queries with both types and features match', function() {
              mq.full = true;
              mq.query = 'all and (min-width: 1px)';
              assert.equal(mq.queryMatches, true);
            });
          });

          suite('query does not activate on empty string or null', function() {

            test('empty string', function() {
              mq.query = '';
              assert.notOk(mq._mq);
            });

            test('null', function() {
              mq.query = null;
              assert.notOk(mq._mq);
            });

          });

          test('media query destroys on detach', function() {
            mq.query = '(max-width: 800px)';
            mq.parentNode.removeChild(mq);
            Polymer.dom.flush();
            assert.notOk(mq._mq);
          });

          test('media query re-enables on attach', function() {
            mq.query = '(max-width: 800px)';
            var parent = mq.parentNode;
            parent.removeChild(mq);
            Polymer.dom.flush();
            parent.appendChild(mq);
            Polymer.dom.flush();
            assert.ok(mq._mq);
          });

        });

      });

    