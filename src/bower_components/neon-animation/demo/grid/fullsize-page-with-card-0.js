

  Polymer({

    is: 'fullsize-page-with-card',

    behaviors: [
      Polymer.NeonSharedElementAnimatableBehavior
    ],

    properties: {

      color: {
        type: String
      },

      sharedElements: {
        type: Object,
        value: function() {
          return {
            'hero': this.$.card,
            'ripple': this.$.fixed
          }
        }
      },

      animationConfig: {
        type: Object,
        value: function() {
          return {
            'entry': [{
              name: 'ripple-animation',
              id: 'ripple',
              toPage: this,
            }, {
              name: 'hero-animation',
              id: 'hero',
              toPage: this,
              timing: {
                delay: 150
              }
            }],
            'exit': [{
              name: 'fade-out-animation',
              node: this.$.fixed
            }, {
              name: 'transform-animation',
              transformFrom: 'none',
              transformTo: 'translate(0px,-200vh) scale(0.9,1)',
              node: this.$.card
            }]
          }
        }
      }

    },

    _computeCardClass: function(color) {
      var cls = 'card';
      if (color) {
        cls += ' ' + color + '-300';
      }
      return cls;
    },

    _computeFixedBackgroundClass: function(color) {
      var cls = 'fixed';
      if (color) {
        cls += ' ' + color + '-100';
      }
      return cls;
    }

  });

