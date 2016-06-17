

      function ensureDocumentHasFocus() {
        window.top && window.top.focus();
      }

      function checkSelectionBar(tabs, tab) {
        var tabRect = tab.getBoundingClientRect();
        var rect = Polymer.dom(tabs.root).querySelector('#selectionBar').getBoundingClientRect();
        assert.equal(Math.round(tabRect.left), Math.round(rect.left));
      }

      suite('defaults', function() {

        var tabs;

        setup(function () {
          tabs = fixture('basic');
        });

        test('to nothing selected', function() {
          assert.equal(tabs.selected, undefined);
        });

        test('no tabs have iron-selected class', function() {
          Array.prototype.forEach.call(tabs.querySelectorAll('paper-tab'), function(tab) {
            assert.isFalse(tab.classList.contains('iron-selected'));
          });
        });

        test('to false as noink', function() {
          assert.equal(tabs.noink, false);
        });

        test('to false as noBar', function() {
          assert.equal(tabs.noBar, false);
        });

        test('to false as noSlide', function() {
          assert.equal(tabs.noSlide, false);
        });

        test('to false as scrollable', function() {
          assert.equal(tabs.scrollable, false);
        });

        test('to false as disableDrag', function() {
          assert.equal(tabs.disableDrag, false);
        });

        test('to false as hideScrollButtons', function() {
          assert.equal(tabs.hideScrollButtons, false);
        });

        test('to false as alignBottom', function() {
          assert.equal(tabs.alignBottom, false);
        });
      });

      suite('hidden tabs', function() {
        var tabs;

        setup(function() {
          tabs = fixture('HiddenTabs');
        });

        test('choose the correct bar position once made visible', function() {
          tabs.removeAttribute('hidden');
          tabs.selected = 0;
          expect(tabs._width).to.be.greaterThan(0);
          expect(tabs._left).to.be.equal(0);
        });
      });

      suite('set the selected attribute', function() {

        var tabs, index = 0;

        setup(function () {
          tabs = fixture('basic');
          tabs.selected = index;
        });

        test('selected value', function() {
          assert.equal(tabs.selected, index);
        });

        test('selected tab has iron-selected class', function() {
          var tab = tabs.querySelectorAll('paper-tab')[index];
          assert.isTrue(tab.classList.contains('iron-selected'));
        });

        test('selected tab has selection bar position at the bottom of the tab', function(done) {
          setTimeout(function() {
            checkSelectionBar(tabs, tabs.querySelectorAll('paper-tab')[index]);
            done();
          }, 1000);
        });

      });

      suite('select tab via click', function() {

        var tabs, index = 1;
        var tab;

        setup(function () {
          tabs = fixture('basic');
          tab = tabs.querySelectorAll('paper-tab')[index];
          tab.dispatchEvent(new CustomEvent('click', {bubbles: true}));
        });

        test('selected value', function() {
          assert.equal(tabs.selected, index);
        });

        test('selected tab has iron-selected class', function() {
          var tab = tabs.querySelectorAll('paper-tab')[index];
          assert.isTrue(tab.classList.contains('iron-selected'));
        });

        test('selected tab has selection bar position at the bottom of the tab', function(done) {
          setTimeout(function() {
            checkSelectionBar(tabs, tabs.querySelectorAll('paper-tab')[index]);
            done();
          }, 1000);
        });

        test('pressing enter on tab causes a click', function(done) {
          var clickCount = 0;
          tab.addEventListener('click', function onTabClick() {
            clickCount++;
            tab.removeEventListener('click', onTabClick);

            expect(clickCount).to.be.equal(1);
            done();
          });

          MockInteractions.pressEnter(tab);
        });
      });

      suite('noink attribute', function() {
        var tabs;

        setup(function () {
          tabs = fixture('basic');
        });

        test('noink attribute propagates to all descendant tabs', function() {
          tabs.noink = true;
          Array.prototype.slice.apply(tabs.querySelectorAll('paper-tab')).forEach(function(tab) {
            assert.isTrue(tab.noink);
          });

          tabs.noink = false;
          Array.prototype.slice.apply(tabs.querySelectorAll('paper-tab')).forEach(function(tab) {
            assert.isFalse(tab.noink);
          });
        });
      });

      suite('accessibility', function() {
        var LEFT = 37;
        var RIGHT = 39;
        var tabs;

        setup(function () {
          tabs = fixture('basic');
          Polymer.dom.flush();
        });

        test('paper-tabs has role tablist', function() {
          assert.equal(tabs.getAttribute('role'), 'tablist');
        });

        test('paper-tab has role tab', function() {
          tabs.items.forEach(function(tab) {
            assert.equal(tab.getAttribute('role'), 'tab');
          });
        });

        test('without autoselect, tabs are not automatically selected',
          function(done) {
            ensureDocumentHasFocus();
            Polymer.Base.async(function() {
              tabs.select(0);
              MockInteractions.pressAndReleaseKeyOn(tabs.selectedItem, RIGHT);
              Polymer.Base.async(function() {
                assert.equal(tabs.selected, 0);

                MockInteractions.pressAndReleaseKeyOn(tabs.selectedItem, LEFT);
                Polymer.Base.async(function() {
                  assert.equal(tabs.selected, 0);

                  MockInteractions.pressAndReleaseKeyOn(tabs.selectedItem, LEFT);
                  Polymer.Base.async(function() {
                    assert.equal(tabs.selected, 0);
                    done();
                  }, 100);
                }, 100);
              }, 100);
            });
          });

        test('with autoselect, tabs are selected when moved to using arrow ' +
          'keys', function(done) {
            ensureDocumentHasFocus();
            Polymer.Base.async(function() {
              tabs.autoselect = true;
              tabs.select(0);
              MockInteractions.pressAndReleaseKeyOn(tabs.selectedItem, RIGHT);
              Polymer.Base.async(function() {
                assert.equal(tabs.selected, 1);

                MockInteractions.pressAndReleaseKeyOn(tabs.selectedItem, RIGHT);
                Polymer.Base.async(function() {
                  assert.equal(tabs.selected, 2);

                  MockInteractions.pressAndReleaseKeyOn(tabs.selectedItem, LEFT);
                  Polymer.Base.async(function() {
                    assert.equal(tabs.selected, 1);
                    done();
                  }, 100);
                }, 100);
              }, 100);
            });
          });

        test('with autoselect, tabs are selected when moved to using arrow ' +
          'keys (RTL)',function(done) {
            ensureDocumentHasFocus();
            Polymer.Base.async(function() {
              tabs.setAttribute('dir', 'rtl');

              tabs.autoselect = true;
              tabs.select(0);
              MockInteractions.pressAndReleaseKeyOn(tabs.selectedItem, LEFT);
              Polymer.Base.async(function() {
                assert.equal(tabs.selected, 1);

                MockInteractions.pressAndReleaseKeyOn(tabs.selectedItem, LEFT);
                Polymer.Base.async(function() {
                  assert.equal(tabs.selected, 2);

                  MockInteractions.pressAndReleaseKeyOn(tabs.selectedItem, RIGHT);
                  Polymer.Base.async(function() {
                    assert.equal(tabs.selected, 1);
                    done();
                  }, 100);
                }, 100);
              }, 100);
            });
          });

        test('with autoselect-delay zero, tabs are selected with ' +
          'microtask timing after the keyup', function(done) {
            ensureDocumentHasFocus();
            Polymer.Base.async(function() {
              tabs.autoselect = true;
              tabs.autoselectDelay = 0;
              tabs.select(0);

              MockInteractions.keyDownOn(tabs.selectedItem, RIGHT);
              Polymer.Base.async(function() {
                assert.equal(tabs.selected, 0);
                assert.equal(tabs.items.indexOf(tabs.focusedItem), 1);

                // No keyup between keydown events: the key is being held.
                MockInteractions.keyDownOn(tabs.selectedItem, RIGHT);
                Polymer.Base.async(function() {
                  assert.equal(tabs.selected, 0);
                  assert.equal(tabs.items.indexOf(tabs.focusedItem), 2);

                  MockInteractions.keyUpOn(tabs.selectedItem, RIGHT);
                  assert.equal(tabs.selected, 0);
                  Polymer.Base.async(function() {
                    assert.equal(tabs.selected, 2);
                    assert.equal(tabs.items.indexOf(tabs.focusedItem), 2);

                    MockInteractions.keyDownOn(tabs.selectedItem, LEFT);
                    Polymer.Base.async(function() {
                      assert.equal(tabs.selected, 2);
                      assert.equal(tabs.items.indexOf(tabs.focusedItem), 1);

                      MockInteractions.keyUpOn(tabs.selectedItem, LEFT);
                      assert.equal(tabs.selected, 2);
                      Polymer.Base.async(function() {
                        assert.equal(tabs.selected, 1);
                        done();
                      });
                    });
                  });
                });
              });
            });
          });

        test('with autoselect-delay positive, tabs are selected with ' +
          'microtask timing after the keyup and delay', function(done) {
            ensureDocumentHasFocus();
            Polymer.Base.async(function() {
              var DELAY = 100;

              tabs.autoselect = true;
              tabs.autoselectDelay = DELAY;
              tabs.select(0);

              MockInteractions.keyDownOn(tabs.selectedItem, RIGHT);
              Polymer.Base.async(function() {
                assert.equal(tabs.selected, 0);
                assert.equal(tabs.items.indexOf(tabs.focusedItem), 1);

                // No keyup between keydown events: the key is being held.
                MockInteractions.keyDownOn(tabs.selectedItem, RIGHT);
                Polymer.Base.async(function() {
                  assert.equal(tabs.selected, 0);
                  assert.equal(tabs.items.indexOf(tabs.focusedItem), 2);

                  MockInteractions.keyUpOn(tabs.selectedItem, RIGHT);
                  assert.equal(tabs.selected, 0);
                  Polymer.Base.async(function() {
                    assert.equal(tabs.selected, 2);
                    assert.equal(tabs.items.indexOf(tabs.focusedItem), 2);

                    MockInteractions.keyDownOn(tabs.selectedItem, LEFT);
                    Polymer.Base.async(function() {
                      assert.equal(tabs.selected, 2);
                      assert.equal(tabs.items.indexOf(tabs.focusedItem), 1);

                      MockInteractions.keyUpOn(tabs.selectedItem, LEFT);
                      assert.equal(tabs.selected, 2);
                      Polymer.Base.async(function() {
                        assert.equal(tabs.selected, 1);
                        done();
                      }, DELAY + 100);
                    });
                  }, DELAY + 100);
                });
              });
            });
          });
      });

    