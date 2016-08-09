

  Polymer({

    is: 'circles-page',

    behaviors: [
      Polymer.NeonSharedElementAnimatableBehavior
    ],

    properties: {

      animationConfig: {
        value: function() {
          var circles = Polymer.dom(this.root).querySelectorAll('.circle');
          var circlesArray = Array.prototype.slice.call(circles);
          return {
            'entry': [{
              name: 'cascaded-animation',
              animation: 'scale-up-animation',
              nodes: circlesArray
            }],

            'exit': [{
              name: 'hero-animation',
              id: 'hero',
              fromPage: this
            }, {
              name: 'cascaded-animation',
              animation: 'scale-down-animation'
            }]
          };
        }
      }
    },

    listeners: {
      'click': '_onClick'
    },

    _onClick: function(event) {
      var target = event.target;
      if (target.classList.contains('circle')) {
        // configure the page animation
        this.sharedElements = {
          'hero': target
        };

        var nodesToScale = [];
        var circles = Polymer.dom(this.root).querySelectorAll('.circle');
        for (var node, index = 0; node = circles[index]; index++) {
          if (node !== event.target) {
            nodesToScale.push(node);
          }
        }
        this.animationConfig['exit'][1].nodes = nodesToScale;

        this.fire('circle-click');
      }
    }

  });

