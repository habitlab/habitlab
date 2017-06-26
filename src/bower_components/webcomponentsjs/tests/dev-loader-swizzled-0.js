
      suite('Development Loader Swizzeled', function() {
        test('loader swizzeled', function() {
          assert(window.WebComponents, 'Platform scope missing');
          assert.equal(WebComponents.flags.squid, 'never', '"squid" flag missing');
          assert(WebComponents.flags.spoo, '"spoo" flag missing');
          assert(WebComponents.flags.log, 'flags.log missing');
          assert(WebComponents.flags.log.foo, 'flags.log.foo missing');
          assert(WebComponents.flags.log.boo, 'flags.log.foo missing');
        });
      });
    