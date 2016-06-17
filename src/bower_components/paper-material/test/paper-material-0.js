
    suite('<paper-material>', function() {
      suite('with a non-zero elevation attribute', function() {
        var style;
        var card;

        setup(function() {
          card = fixture('TrivialCard');
          style = window.getComputedStyle(card);
        });

        test('has a shadow', function() {
          expect(style.boxShadow).to.be.ok;
          expect(style.boxShadow).to.not.be.eql('none');
        });

        test('loses shadow with elevation value 0', function() {
          card.elevation = 0;
          expect(style.boxShadow).to.be.eql('none');
        });
      });

      suite('progressively increasing values of elevation', function() {
        var cards;

        setup(function() {
          cards = fixture('ProgressiveElevations');
        });

        test('yield progressively "deeper" cards', function() {
          var lastStyle;
          var style;

          expect(cards.length).to.be.eql(5);

          cards.forEach(function (card) {
            style = window.getComputedStyle(card);

            expect(style.boxShadow).to.be.ok;
            expect(style.boxShadow).to.not.be.eql('none');
            expect(style.boxShadow).to.not.be.eql(lastStyle && lastStyle.boxShadow);

            lastStyle = style;
          });
        });
      });
    });
  