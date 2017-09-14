

suite('<iron-icons>', function() {
  suite('basic behavior', function() {
    var meta;
    var iconsetNames = [
      'av', 'communication', 'device', 'editor', 'hardware', 'icons', 'image',
      'maps', 'notification', 'places', 'social'
    ];

    setup(function() {
      meta = Polymer.Base.create('iron-meta', {type: 'iconset'});
    });

    test('all uniquely named', function() {
      var allIcons = {};
      for (var i = 0; i < iconsetNames.length; i++) {
        var iconset = meta.byKey(iconsetNames[i]);
        expect(iconset).to.be.ok;

        var iconNames = iconset.getIconNames();
        expect(iconNames).to.not.be.empty;

        for (var j = 0; j < iconNames.length; j++) {
          var parts = iconNames[j].split(':');
          expect(parts).to.have.length(2);
          expect(parts[0]).to.equal(iconsetNames[i]);
          expect(parts[1]).to.have.length.at.least(1);
          expect(allIcons.hasOwnProperty(parts[1])).to.be.false;

          allIcons[parts[1]] = true;
        }
      }

      // Sanity check.
      expect(Object.getOwnPropertyNames(allIcons))
          .to.have.length.of.at.least(iconsetNames.length);
    });
  });
});

  