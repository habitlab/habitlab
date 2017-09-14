

    HTMLImports.whenReady(function() {

      Polymer({
        is: 'x-group',

        properties: {

          items: Array,

          states: Array

        },

        attached: function() {
          this._groupIdxMap = {};
        },

        _generateGroupsFor: function(items) {
          // Sort by state name
          var items = items.slice().sort(function(a, b) {
            return a.state.localeCompare(b.state);
          });
          var states = [];
          // Group by state where _groupIdxMap[index] = true means that items[index] starts a new group
          this._groupIdxMap = items.reduce(function(map, item, idx, arr) {
            if (idx == 0 || item.state != arr[idx-1].state) {
              map[idx] = true;
              states.push({ state: item.state, index: idx });
            }
            return map;
          }, {});

          this.states = states;
          return items;
        },

        _hasGroup: function(idx) {
          return this._groupIdxMap[idx] == true;
        },

        _onStateClick: function(e) {
          // scroll on the main list
          this.$.menu.close();
          this.$.list.scrollToIndex(e.model.item.index);
        }

      });

    });

  