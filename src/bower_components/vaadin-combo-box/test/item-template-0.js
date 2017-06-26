
      HTMLImports.whenReady(function() {
        Polymer({
          is: 'x-scope',
          parentMethod: function() {
            return 'quux';
          },
          parentEventHandler: function() { }
        });
      });
    
    describe('item template', function() {
      var scope, combobox, firstItem;

      beforeEach(function(done) {
        scope = fixture('scope', {items: ['foo', 'bar']});
        combobox = scope.$.combobox;
        combobox.open();
        firstItem = combobox.$.overlay.$.selector.querySelector('vaadin-combo-box-item');
        combobox.async(done, 1);
      });

      it('should render items using template', function() {
        expect(Polymer.dom(firstItem.root).innerHTML).to.contain('item: foo');
      });

      it('should have index property', function() {
        expect(Polymer.dom(firstItem.root).innerHTML).to.contain('index: 0');
      });

      it('should have selected property', function() {
        expect(Polymer.dom(firstItem.root).innerHTML).to.contain('selected: false');
      });

      it('should update selected property', function() {
        combobox.value = 'foo';
        expect(Polymer.dom(firstItem.root).innerHTML).to.contain('selected: true');
      });

      it('should have focused property', function() {
        expect(Polymer.dom(firstItem.root).innerHTML).to.contain('focused: false');
      });

      it('should update focused property', function() {
        MockInteractions.keyDownOn(combobox.$.input, 40); // Press arrow down key
        expect(Polymer.dom(firstItem.root).innerHTML).to.contain('focused: true');
      });

      it('should forward parent properties', function() {
        scope.parentProperty = 'qux';
        expect(Polymer.dom(firstItem.root).innerHTML).to.contain('parentProperty: qux');
      });

      it('should forward parent paths', function() {
        scope.parentProperty = {foo: ''};
        scope.set('parentProperty.foo', 'bar');
        expect(Polymer.dom(firstItem.root).innerHTML).to.contain('parentProperty.foo: bar');
      });

      it('should support computed bindings in parent scope', function() {
        expect(Polymer.dom(firstItem.root).innerHTML).to.contain('parentMethod: quux');
      });

      it('should support event handlers in parent scope', function() {
        var spy = sinon.spy(scope, 'parentEventHandler');
        MockInteractions.tap(Polymer.dom(firstItem.root).querySelector('button'));
        expect(spy.calledOnce).to.be.true;
      });
    });
  