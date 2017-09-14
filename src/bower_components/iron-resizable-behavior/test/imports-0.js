
    suite('imports order', function() {
      test('resizable children and parent updated', function() {
        var parent = document.querySelector('x-resizer-parent');
        var child = parent.firstElementChild;
        assert.deepEqual(parent._interestedResizables, [child], 'resizable children ok');
        assert.equal(child._parentResizable, parent, 'resizable parent ok');
      });
    });
  