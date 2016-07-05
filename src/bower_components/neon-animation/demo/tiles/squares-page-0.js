

  Polymer({

    is: 'squares-page',

    behaviors: [
      Polymer.NeonSharedElementAnimatableBehavior
    ],

    properties: {

      sharedElements: {
        value: function() {
          return {
            'hero': this.$.header
          }
        }
      },

      animationConfig: {
        value: function() {
          var squares = Polymer.dom(this.root).querySelectorAll('.square');
          var squaresArray = Array.prototype.slice.call(squares);
          return {
            'entry': [{
              name: 'hero-animation',
              id: 'hero',
              toPage: this
            }, {
              name: 'cascaded-animation',
              animation: 'transform-animation',
              transformFrom: 'translateY(100%)',
              nodes: squaresArray
            }],

            'exit': [{
              name: 'slide-up-animation',
              node: this.$.header
            }, {
              name: 'cascaded-animation',
              animation: 'transform-animation',
              transformTo: 'translateY(60vh)',
              nodes: squaresArray
            }]
          };
        }
      }
    }

  });

