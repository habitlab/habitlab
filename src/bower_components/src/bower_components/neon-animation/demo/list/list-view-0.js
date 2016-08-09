

  Polymer({

    is: 'list-view',

    behaviors: [
      Polymer.NeonAnimatableBehavior
    ],

    listeners: {
      'click': '_onClick'
    },

    properties: {

      data: {
        type: Array,
        value: function() {
          return [];
        }
      },

      animationConfig: {
        type: Object,
        value: function() {
          return {
            'entry': [{
              name: 'fade-in-animation',
              node: this.$.button
            }],

            'exit': [{
              name: 'fade-out-animation',
              node: this.$.button
            }, {
              name: 'hero-animation',
              id: 'hero',
              fromPage: this
            }]
          };
        }
      }

    },

    _onClick: function(event) {
      var target = event.target;
      while (target !== this && !target._templateInstance) {
        target = target.parentNode;
      }

      // configure the page animation
      this.sharedElements = {
        'hero': target,
      };

      this.fire('item-click', {
        item: target,
      });
    }

  });

