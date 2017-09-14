

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
            'entry': [{
              name: 'cascaded-animation',
              animation: 'transform-animation',
              transformFrom: 'translateY(100%)',
              transformTo: 'none',
              timing: {
                delay: 50
              }
            }]
          }
        }
      }

    },

    attached: function() {
      this.async(function() {
        var nodeList = Polymer.dom(this.root).querySelectorAll('.tile');
        this.animationConfig['entry'][0].nodes = Array.prototype.slice.call(nodeList);
      });
    },

    _computeTileClass: function(color) {
      return 'tile ' + color + '-300';
    }

  });

