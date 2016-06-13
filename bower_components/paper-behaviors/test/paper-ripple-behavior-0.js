
    HTMLImports.whenReady(function() {
      Polymer({
        is: 'test-ripple',
        behaviors: [
          Polymer.IronButtonState,
          Polymer.IronControlState,
          Polymer.PaperRippleBehavior
        ]
      });
    });
    
    suite('PaperRippleBehavior', function() {
      var ripple;

      setup(function() {
        ripple = fixture('basic');
      });

      test('no ripple at startup', function() {
        assert.isFalse(ripple.hasRipple());
      });

      test('calling getRipple returns ripple', function() {
        assert.ok(ripple.getRipple());
      });

      test('focus generates ripple', function() {
        MockInteractions.focus(ripple);
        assert.ok(ripple.hasRipple());
      });

      test('down generates ripple', function() {
        MockInteractions.down(ripple);
        assert.ok(ripple.hasRipple());
        MockInteractions.up(ripple);
      });

      suite('Correct Targeting', function() {

        function assertInteractionCausesRipple(host, node, expected, msg) {
          var ripple = host.getRipple();
          Polymer.dom.flush();
          MockInteractions.down(node);
          assert.equal(ripple.ripples.length > 0, expected, msg);
          MockInteractions.up(node);
        }

        function assertInteractionAtLocationCausesRipple(host, node, location, expected, msg) {
          var ripple = host.getRipple();
          Polymer.dom.flush();
          MockInteractions.down(node, location);
          assert.equal(ripple.ripples.length > 0, expected, msg);
          MockInteractions.up(node);
        }

        suite('basic', function() {
          suite('container = host', function() {

            setup(function() {
              ripple = fixture('ShadowBasic');
            });

            test('tap host', function() {
              assertInteractionCausesRipple(ripple, ripple, true, 'ripple');
            });
            test('tap #wrapper', function() {
              assertInteractionCausesRipple(ripple, ripple.$.wrapper, true, '#wrapper');
            });
            test('tap #separate', function() {
              assertInteractionCausesRipple(ripple, ripple.$.separate, true, '#separate')
            });
          });

          suite('container = wrapper', function() {

            setup(function() {
              ripple = fixture('ShadowBasic');
              ripple._rippleContainer = ripple.$.wrapper;
            });

            test('tap host', function() {
              assertInteractionCausesRipple(ripple, ripple, false, 'ripple');
            });

            test('tap #wrapper', function() {
              assertInteractionCausesRipple(ripple, ripple.$.wrapper, true, '#wrapper');
            });

            test('tap #separate', function() {
              assertInteractionCausesRipple(ripple, ripple.$.separate, false, '#separate')
            });
          });

          suite('container = separate', function(done) {

            setup(function() {
              ripple = fixture('ShadowBasic');
              ripple._rippleContainer = ripple.$.separate;
            });

            test('tap host', function() {
              assertInteractionCausesRipple(ripple, ripple, false, 'ripple');
            });

            test('tap wrapper', function() {
              assertInteractionCausesRipple(ripple, ripple.$.wrapper, false, '#wrapper');
            });

            test('tap separate', function() {
              assertInteractionCausesRipple(ripple, ripple.$.separate, true, '#separate')
            });
          });
        });

        suite('distributed text', function() {
          var textLocation;

          function getTextLocation(ripple) {
            // build a Range to get the BCR of a given text node
            var r = document.createRange();
            r.selectNode(Polymer.dom(ripple.$.content).getDistributedNodes()[0]);
            return MockInteractions.middleOfNode(r);
          }

          suite('container = host', function() {
            setup(function() {
              ripple = fixture('ShadowText');
              textLocation = getTextLocation(ripple);
            });

            test('tap host', function() {
              assertInteractionCausesRipple(ripple, ripple, true, 'ripple');
            });

            test('tap wrapper', function() {
              assertInteractionCausesRipple(ripple, ripple.$.wrapper, true, '#wrapper');
            });

            test('tap separate', function() {
              assertInteractionCausesRipple(ripple, ripple.$.separate, true, '#separate')
            });

            test('tap text', function() {
              assertInteractionAtLocationCausesRipple(ripple, ripple.$.wrapper, textLocation, true, 'text');
            });
          });

          suite('container = wrapper', function() {
            setup(function() {
              ripple = fixture('ShadowText');
              ripple._rippleContainer = ripple.$.wrapper;
              textLocation = getTextLocation(ripple);
            });

            test('tap host', function() {
              assertInteractionCausesRipple(ripple, ripple, false, 'ripple');
            });

            test('tap wrapper', function() {
              assertInteractionCausesRipple(ripple, ripple.$.wrapper, true, '#wrapper');
            });

            test('tap separate', function() {
              assertInteractionCausesRipple(ripple, ripple.$.separate, false, '#separate')
            });

            test('tap text', function() {
              assertInteractionAtLocationCausesRipple(ripple, ripple.$.wrapper, textLocation, true, 'text');
            });
          });

          suite('container = separate', function() {
            setup(function() {
              ripple = fixture('ShadowText');
              ripple._rippleContainer = ripple.$.separate;
              textLocation = getTextLocation(ripple);
            });

            test('tap host', function() {
              assertInteractionCausesRipple(ripple, ripple, false, 'ripple');
            });

            test('tap wrapper', function() {
              assertInteractionCausesRipple(ripple, ripple.$.wrapper, false, '#wrapper');
            });

            test('tap separate', function() {
              assertInteractionCausesRipple(ripple, ripple.$.separate, true, '#separate')
            });

            test('tap text', function() {
              assertInteractionAtLocationCausesRipple(ripple, ripple.$.wrapper, textLocation, false, 'text');
            });
          });
        });

        suite('distributed element', function() {
          var source;

          suite('container = host', function() {
            setup(function() {
              ripple = fixture('ShadowElement');
              source = Polymer.dom(ripple).querySelector('#source');
            });

            test('tap host', function() {
              assertInteractionCausesRipple(ripple, ripple, true, 'ripple');
            });

            test('tap wrapper', function() {
              assertInteractionCausesRipple(ripple, ripple.$.wrapper, true, '#wrapper');
            });

            test('tap separate', function() {
              assertInteractionCausesRipple(ripple, ripple.$.separate, true, '#separate')
            });

            test('tap source', function() {
              assertInteractionCausesRipple(ripple, source, true, '#source');
            });
          });

          suite('container = wrapper', function() {
            setup(function() {
              ripple = fixture('ShadowElement');
              ripple._rippleContainer = ripple.$.wrapper;
              source = Polymer.dom(ripple).querySelector('#source');
            });

            test('tap host', function() {
              assertInteractionCausesRipple(ripple, ripple, false, 'ripple');
            });

            test('tap wrapper', function() {
              assertInteractionCausesRipple(ripple, ripple.$.wrapper, true, '#wrapper');
            });

            test('tap separate', function() {
              assertInteractionCausesRipple(ripple, ripple.$.separate, false, '#separate')
            });

            test('tap source', function() {
              assertInteractionCausesRipple(ripple, source, true, '#source');
            });
          });

          suite('container = separate', function() {
            setup(function() {
              ripple = fixture('ShadowElement');
              ripple._rippleContainer = ripple.$.separate;
              source = Polymer.dom(ripple).querySelector('#source');
            });

            test('tap host', function() {
              assertInteractionCausesRipple(ripple, ripple, false, 'ripple');
            });

            test('tap wrapper', function() {
              assertInteractionCausesRipple(ripple, ripple.$.wrapper, false, '#wrapper');
            });

            test('tap separate', function() {
              assertInteractionCausesRipple(ripple, ripple.$.separate, true, '#separate')
            });

            test('tap source', function() {
              assertInteractionCausesRipple(ripple, source, false, '#source');
            });
          });
        });
      });
    });
  