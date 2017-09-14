
    'use strict';

    suite('basic', function() {

      var toolbar;

      setup(function() {
        toolbar = fixture('basic');
      });

      test('has expected medium-tall height', function() {
        var old = toolbar.offsetHeight;
        toolbar.classList.add('medium-tall');
        expect(toolbar.offsetHeight).to.be.eql(old * 2);
      });

      test('has expected tall height', function() {
        var old = toolbar.offsetHeight;
        toolbar.classList.add('tall');
        expect(toolbar.offsetHeight).to.be.eql(old * 3);
      });

      test('distributes nodes to topBar by default', function() {
        var item = document.createElement('div');
        item.setAttribute('slot', 'top');
        Polymer.dom(toolbar).appendChild(item);
        Polymer.dom.flush();
        var insertionPoint = Polymer.dom(item).getDestinationInsertionPoints()[0];
        expect(Polymer.dom(insertionPoint).parentNode).to.be.eql(toolbar.$.topBar);
      });

      test('distributes nodes with "middle" slot to middleBar', function() {
        var item = document.createElement('div');
        item.setAttribute('slot', 'middle');
        Polymer.dom(toolbar).appendChild(item);
        Polymer.dom.flush();
        var insertionPoint = Polymer.dom(item).getDestinationInsertionPoints()[0];
        expect(Polymer.dom(insertionPoint).parentNode).to.be.eql(toolbar.$.middleBar);
      });

      test('distributes nodes with "bottom" slot to bottomBar', function() {
        var item = document.createElement('div');
        item.setAttribute('slot', 'bottom');
        Polymer.dom(toolbar).appendChild(item);
        Polymer.dom.flush();
        var insertionPoint = Polymer.dom(item).getDestinationInsertionPoints()[0];
        expect(Polymer.dom(insertionPoint).parentNode).to.be.eql(toolbar.$.bottomBar);
      });
    });

    suite('a11y', function() {

      test('has role="toolbar"', function() {
        var toolbar = fixture('basic');
        Polymer.dom.flush();
        assert.equal(toolbar.getAttribute('role'), 'toolbar', 'has role="toolbar"');
      });

      test('children with .title becomes the label', function(done) {
        var toolbar = fixture('title');
        flush(function() {
          assert.isTrue(toolbar.hasAttribute('aria-labelledby'), 'has aria-labelledby');
          assert.equal(toolbar.getAttribute('aria-labelledby'),
              Polymer.dom(toolbar).querySelector('.title').id,
              'aria-labelledby has the id of the .title element');
          done();
        });
      });

      test('existing ids on titles are preserved', function() {
        var toolbar = fixture('title-with-id');
        assert.isTrue(toolbar.hasAttribute('aria-labelledby'), 'has aria-labelledby');
        assert.equal(Polymer.dom(toolbar).querySelector('.title').id, 'title', 'id is preserved');
      });

      test('multiple children with .title becomes the label', function() {
        var toolbar = fixture('multiple-titles');
        assert.isTrue(toolbar.hasAttribute('aria-labelledby'), 'has aria-labelledby');
        var ids = [];
        var titles = Polymer.dom(toolbar).querySelectorAll('.title');
        for (var title, index = 0; title = titles[index]; index++) {
          ids.push(title.id);
        }
        assert.equal(toolbar.getAttribute('aria-labelledby'), ids.join(' '), 'aria-labelledby has the id of all .title elements');
      });

    });

  