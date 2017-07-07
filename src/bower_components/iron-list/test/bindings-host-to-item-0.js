

    suite('host property and sub-property bindings to list items', function() {
        var list, container,
            propertyText="propertyText",
            anotherPropertyText="anotherPropertyText",
            subPropertyText="subPropertyText",
            anotherSubPropertyText="anotherSubpropertyText",
            getItemScopedBinding= function(){
                return getFirstItemFromList(list).parentElement.querySelector('[item-scope-binding]').textContent
            },
            getHostScopedPropertyBinding = function(){
                return getFirstItemFromList(list).parentElement.querySelector('[host-scope-property-binding]').textContent;
            },
            getHostScopedSubpropertyBinding = function(){
                return getFirstItemFromList(list).parentElement.querySelector('[host-scope-subproperty-binding]').textContent
            };

        setup(function() {
            container = fixture('listWithBindings');
            list = container.list;
        });

        test('changes are forwarded to the off screen focused item', function() {
            list.items = buildDataSet(100);
            var firstItem = list.items[0],
                lastItem = list.items[list.items.length-1];

            list.scrollToItem(firstItem);
            list.selectItem(firstItem);

            var topItemMarker=getItemScopedBinding();

            container.set('propertyForReassignmentForwarding', propertyText);
            container.set('propertyForPathChangeForwarding.text', subPropertyText);

            assert.equal(getHostScopedPropertyBinding(),propertyText);
            assert.equal(getHostScopedSubpropertyBinding(),subPropertyText);

            list.scrollToItem(lastItem);

            assert.notEqual(getItemScopedBinding(),
                  topItemMarker,"selected item became invisible");

            container.set('propertyForReassignmentForwarding', anotherPropertyText);
            container.set('propertyForPathChangeForwarding.text', anotherSubPropertyText);

            list.scrollToItem(firstItem);

            assert.equal(getItemScopedBinding(),
                    topItemMarker,"selected item became again visible");

            assert.equal(getHostScopedPropertyBinding(),anotherPropertyText);
            assert.equal(getHostScopedSubpropertyBinding(),anotherSubPropertyText);
        });
    });
