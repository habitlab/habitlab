
    suite('<iron-a11y-announcer>', function() {
      var announcer;

      setup(function() {
        announcer = fixture('Announcer');
      });

      test('announces when there is an iron-announce event', function() {
        var event = new CustomEvent('iron-announce', {
          bubbles: true,
          detail: {
            text: 'foo'
          }
        });

        sinon.spy(announcer, 'announce');

        document.body.dispatchEvent(event);

        expect(announcer.announce.callCount).to.be.equal(1);
      });
    });
  