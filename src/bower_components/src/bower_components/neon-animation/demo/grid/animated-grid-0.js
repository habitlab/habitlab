

  Polymer({

    is: 'animated-grid',

    behaviors: [
      Polymer.NeonSharedElementAnimatableBehavior
    ],

    properties: {

      config: {
        type: Array,
        value: function() {
          return [
            {value: 1, color: 'blue'},
            {value: 2, color: 'red'},
            {value: 3, color: 'blue'},
            {value: 4, color: 'green'},
            {value: 5, color: 'yellow'},
            {value: 6, color: 'blue'},
            {value: 7, color: 'red'},
            {value: 8, color: 'green'},
            {value: 9, color: 'yellow'},
            {value: 10, color: 'red'}
          ]
        }
      },

      animationConfig: {
        type: Object,
        value: function() {
          return {
            'exit': [{
              name: 'ripple-animation',
              id: 'ripple',
              fromPage: this
            }, {
              name: 'hero-animation',
              id: 'hero',
              fromPage: this
            }]
          }
        }
      }

    },

    listeners: {
      click: '_onClick'
    },

    _computeTileClass: function(color) {
      return 'tile ' + color + '-300';
    },

    _onClick: function(event) {
      var target = event.target;
      while (target !== this && !target._templateInstance) {
        target = target.parentNode;
      }

      // configure the page animation
      this.sharedElements = {
        'hero': target,
        'ripple': target
      };
      this.animationConfig['exit'][0].gesture = {
        x: event.x || event.pageX,
        y: event.y || event.pageY
      };

      this.fire('tile-click', {
        tile: target,
        data: target._templateInstance.item
      });
    }

  });

