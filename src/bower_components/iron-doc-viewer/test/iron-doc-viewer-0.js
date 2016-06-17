

      var ELEMENT = {
        "is": "awesome-sauce",
        "properties": [
          {"name": "isAwesome", "type": "boolean", "desc": "Is it awesome?"},
        ]
      };

      describe('<iron-doc-viewer>', function() {

        var page;
        afterEach(function() {
          page = null; // Make sure that we don't reuse another test's element.
        });

        describe('with a bound descriptor', function() {

          beforeEach(function() { page = fixture('bound', {descriptor: ELEMENT}); });

          it('loads the descriptor', function() {
            expect(page.descriptor.is).to.eq('awesome-sauce');
            expect(page.descriptor.properties.length).to.eq(1);
          });

        });

        describe('with a JSON descriptor', function() {

          beforeEach(function() { page = fixture('json'); });

          it('loads the descriptor', function() {
            expect(page.descriptor.is).to.eq('awesome-sauce');
            expect(page.descriptor.properties.length).to.eq(1);
          });

        });

        describe('edge cases', function() {

        //   // TODO(nevir): Cannot enable until https://github.com/Polymer/polymer/issues/1200
        //   it.skip('throws when a bound and JSON descriptor are provided', function() {
        //     expect(function() {
        //       fixture('json-and-bound', {descriptor: ELEMENT});
        //     }).to.throw(Error, /descriptor/i);
        //   });

        });

      });

    