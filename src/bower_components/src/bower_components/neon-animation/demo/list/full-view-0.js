

  Polymer({

    is: 'full-view',

    behaviors: [
      Polymer.NeonAnimatableBehavior
    ],

    properties: {

      sharedElements: {
        type: Object,
        value: function() {
          return {
            'hero': this.$.main
          };
        }
      },

      animationConfig: {
        type: Object,
        value: function() {
          return {
            'entry': [{
              name: 'fade-in-animation',
              node: this.$.button
            }, {
              name: 'hero-animation',
              id: 'hero',
              toPage: this
            }],

            'exit': [{
              name: 'fade-out-animation',
              node: this.$.button
            }, {
              name: 'scale-down-animation',
              node: this.$.main,
              transformOrigin: '50% 50%',
              axis: 'y'
            }]

          }
        }
      }

    },

    _onClearButtonClick: function() {
      this.fire('close');
    }

  });

