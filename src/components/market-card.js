const {polymer_ext} = require('libs_frontend/polymer_utils')
const screenshot_utils = require('libs_common/screenshot_utils')

polymer_ext({
  is: 'market-card',
  properties: {
    name: {
      type: String
    },
    date:{
      type: String
    },
    description:{
      type: String
    },
    starCount:{
      type: Number
    }
  },
  ready: async function() {
    const self = this
    self.S(".card").hover(
    function() {
      self.S("#description").css("display", "inline-block");
      self.S("#image").css("display", "none");
    },
    function() {
      self.S("#description").css("display", "none");
      self.S("#image").css("display", "inline-block");
    });
  }
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'S'
  ]
})
