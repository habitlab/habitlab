
    function runAfterOpen(overlay, callback) {
        overlay.addEventListener('iron-overlay-opened', callback);
        overlay.open();
    }

    suite('overlay with backdrop', function() {
        var overlay;

        setup(function() {
            overlay = fixture('backdrop');
        });

        test('backdrop size matches parent size', function(done) {
            runAfterOpen(overlay, function() {
                // Flush so we are sure backdrop is added in the DOM.
                Polymer.dom.flush();
                var backdrop = overlay.backdropElement;
                var parent = backdrop.parentElement;
                assert.strictEqual(backdrop.offsetWidth, parent.clientWidth, 'backdrop width matches parent width');
                assert.strictEqual(backdrop.offsetHeight, parent.clientHeight, 'backdrop height matches parent height');
                done();
            });
        });

    });
