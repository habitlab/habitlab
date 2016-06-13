
    'use strict';

    suite('<iron-query-params>', function () {

      var paramsElem;
      setup(function() {
        paramsElem = fixture('BasicQueryParams');
      });

      test('basic functionality with ?key=value params', function() {
        // Check initialization
        expect(paramsElem.paramsString).to.be.eq('');
        expect(paramsElem.paramsObject).to.deep.eq({});

        // Check the mapping from paramsString to paramsObject.
        paramsElem.paramsString = 'greeting=hello&target=world';
        expect(paramsElem.paramsObject).to.deep.equal(
            {greeting: 'hello', target: 'world'});

        // Check the mapping from paramsObject back to paramsString.
        paramsElem.set('paramsObject.another', 'key');
        expect(paramsElem.paramsString).to.be.equal(
            'greeting=hello&target=world&another=key');
      });
      test('encoding of params', function() {
        var mappings = [
          {
            string: 'a=b',
            object: {'a': 'b'}
          },
          {
            string: 'debug&ok',
            object: {'debug': '', 'ok': ''}
          },
          {
            string: 'monster%20kid%3A=%F0%9F%98%BF',
            object: {'monster kid:': '😿'}
          },
          {
            string: 'yes%2C%20ok%3F%20what%20is%20up%20with%20%CB%9Athiiis%CB%9A=%E2%98%83',
            object: {'yes, ok? what is up with ˚thiiis˚': '☃'}
          },
        ];

        mappings.forEach(function(mapping) {
          // Clear
          paramsElem.paramsObject = {};
          expect(paramsElem.paramsString).to.be.equal('');

          // Test going from string to object
          paramsElem.paramsString = mapping.string;
          expect(paramsElem.paramsObject).to.deep.equal(mapping.object);

          // Clear again.
          paramsElem.paramsObject = {};
          expect(paramsElem.paramsString).to.be.equal('');

          // Test going from object to string
          paramsElem.paramsObject = mapping.object;
          expect(paramsElem.paramsString).to.be.equal(mapping.string);
        });
      });
    });

  