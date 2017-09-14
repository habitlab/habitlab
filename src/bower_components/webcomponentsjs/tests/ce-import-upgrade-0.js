
      test('import upgrade', function() {
        // import upgraded
        assert.ok(a1);
        assert.isTrue(isA1Upgraded);
        // order expected
        assert.deepEqual(a1DocsList, ['a1-instance.html', 'a1-reference.html']);
        assert.isTrue(styleAppliedToDocument);
      });
    